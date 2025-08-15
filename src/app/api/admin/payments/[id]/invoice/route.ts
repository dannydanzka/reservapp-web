import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient, ReceiptStatus, ReceiptType } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/admin/payments/[id]/invoice
 * Generate Stripe invoice for a payment
 *
 * Body:
 * {
 *   description?: string;
 *   dueDate?: string; // ISO date string
 *   metadata?: object;
 *   autoFinalize?: boolean;
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate authentication and admin role
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Admin access required', success: false }, { status: 403 });
    }

    const { id: paymentId } = await params;
    const body = await request.json();
    const { autoFinalize = true, description, dueDate, metadata } = body;

    // Get payment with all related data
    const payment = await prisma.payment.findUnique({
      include: {
        receipt: {
          select: {
            id: true,
            receiptNumber: true,
            status: true,
            type: true,
          },
        },
        reservation: {
          include: {
            service: {
              select: {
                category: true,
                description: true,
                id: true,
                name: true,
              },
            },
            venue: {
              select: {
                category: true,
                id: true,
                name: true,
                owner: {
                  select: {
                    businessAccount: {
                      select: {
                        businessName: true,
                        legalName: true,
                        taxId: true,
                      },
                    },
                  },
                },
                ownerId: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            id: true,
            lastName: true,
            stripeCustomerId: true,
          },
        },
      },
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found', success: false }, { status: 404 });
    }

    // Check if ADMIN has permission to manage this payment
    if (user.role === 'ADMIN') {
      const adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: user.id },
      });

      const venueIds = adminVenues.map((venue) => venue.id);
      const paymentVenueId = payment.reservation?.venue.id;

      if (!paymentVenueId || !venueIds.includes(paymentVenueId)) {
        return NextResponse.json(
          {
            error: 'No tienes permisos para generar facturas de este pago',
            success: false,
          },
          { status: 403 }
        );
      }
    }

    // Check if invoice already exists
    if (payment.receipt && payment.receipt.type === ReceiptType.INVOICE) {
      const existingInvoice = payment.receipt;
      return NextResponse.json(
        {
          data: {
            existingInvoiceId: existingInvoice.id,
            receiptNumber: existingInvoice.receiptNumber,
            status: existingInvoice.status,
          },
          error: 'Invoice already exists for this payment',
          success: false,
        },
        { status: 409 }
      );
    }

    // Ensure user has Stripe customer ID
    let { stripeCustomerId } = payment.user;
    if (!stripeCustomerId) {
      try {
        const stripeCustomer = await stripe.customers.create({
          email: payment.user.email,
          metadata: {
            createdBy: 'admin-invoice-generation',
            userId: payment.user.id,
          },
          name: `${payment.user.firstName} ${payment.user.lastName}`,
        });

        // Update user with Stripe customer ID
        await prisma.user.update({
          data: { stripeCustomerId: stripeCustomer.id },
          where: { id: payment.user.id },
        });

        stripeCustomerId = stripeCustomer.id;
      } catch (stripeError: any) {
        console.error('Error creating Stripe customer:', stripeError);
        return NextResponse.json(
          {
            details: stripeError.message,
            error: 'Failed to create Stripe customer',
            success: false,
          },
          { status: 500 }
        );
      }
    }

    // Generate invoice description
    let invoiceDescription = description;
    if (!invoiceDescription) {
      if (payment.reservation) {
        invoiceDescription = `Factura por reserva en ${payment.reservation.venue.name} - ${payment.reservation.service.name}`;
      } else {
        // Check metadata for subscription info
        const metadata = payment.metadata as any;
        if (metadata?.paymentType === 'subscription') {
          invoiceDescription = `Factura por suscripción ${metadata.subscriptionType || 'Premium'}`;
        } else {
          invoiceDescription = payment.description || 'Factura por servicios';
        }
      }
    }

    try {
      // Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        auto_advance: autoFinalize,
        collection_method: 'send_invoice',
        customer: stripeCustomerId,
        description: invoiceDescription,
        due_date: dueDate ? Math.floor(new Date(dueDate).getTime() / 1000) : undefined,
        metadata: {
          adminUserId: user.id,
          adminUserName: `${user.firstName} ${user.lastName}`,
          paymentId: payment.id,
          userId: payment.user.id,
          ...metadata,
        },
        pending_invoice_items_behavior: 'exclude',
      });

      // Add invoice item
      await stripe.invoiceItems.create({
        amount: Math.round(Number(payment.amount) * 100),
        // Convert to cents
        currency: payment.currency.toLowerCase(),

        customer: stripeCustomerId,
        description: invoiceDescription,
        invoice: stripeInvoice.id,
        metadata: {
          paymentId: payment.id,
          serviceType: payment.reservation
            ? 'reservation'
            : (payment.metadata as any)?.paymentType === 'subscription'
              ? 'subscription'
              : 'business',
        },
      });

      // Finalize invoice if requested
      if (autoFinalize) {
        await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      }

      // Calculate tax amount (16% IVA for Mexico)
      const taxRate = 0.16;
      const subtotalAmount = Number(payment.amount) / (1 + taxRate);
      const taxAmount = Number(payment.amount) - subtotalAmount;

      // Create receipt record in database
      const receipt = await prisma.receipt.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          dueDate: dueDate ? new Date(dueDate) : null,
          issueDate: new Date(),
          metadata: {
            autoFinalized: autoFinalize,
            description: invoiceDescription,
            generatedAt: new Date().toISOString(),
            generatedBy: user.id,
            stripeInvoiceId: stripeInvoice.id,
            stripeInvoicePdf: stripeInvoice.invoice_pdf,
            stripeInvoiceUrl: stripeInvoice.hosted_invoice_url,
            ...metadata,
          },
          paymentId: payment.id,
          status: ReceiptStatus.PENDING,
          subtotalAmount,
          taxAmount,
          type: ReceiptType.INVOICE,
          userId: payment.user.id,
        },
        include: {
          payment: {
            select: {
              amount: true,
              description: true,
              id: true,
              reservation: {
                select: {
                  service: { select: { name: true } },
                  venue: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      // Send invoice via Stripe if finalized
      if (autoFinalize) {
        try {
          await stripe.invoices.sendInvoice(stripeInvoice.id);
        } catch (sendError) {
          console.warn('Failed to send invoice via Stripe:', sendError);
          // Continue with success response, invoice was created successfully
        }
      }

      return NextResponse.json({
        data: {
          payment: {
            amount: Number(payment.amount),
            description: payment.description,
            id: payment.id,
          },
          receipt: {
            amount: Number(receipt.amount),
            currency: receipt.currency,
            dueDate: receipt.dueDate,
            id: receipt.id,
            issueDate: receipt.issueDate,
            receiptNumber: receipt.receiptNumber,
            status: receipt.status,
            type: receipt.type,
          },
          stripe: {
            hostedUrl: stripeInvoice.hosted_invoice_url,
            invoiceId: stripeInvoice.id,
            number: stripeInvoice.number,
            pdfUrl: stripeInvoice.invoice_pdf,
            status: stripeInvoice.status,
          },
        },
        message: autoFinalize
          ? 'Invoice generated and sent successfully'
          : 'Invoice draft created successfully',
        success: true,
      });
    } catch (stripeError: any) {
      console.error('Error creating Stripe invoice:', stripeError);
      return NextResponse.json(
        {
          details: stripeError.message,
          error: 'Failed to create Stripe invoice',
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      {
        details: error instanceof Error ? error.message : 'Unknown error',
        error: 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/payments/[id]/invoice
 * Get existing invoice for a payment
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate authentication and admin role
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Admin access required', success: false }, { status: 403 });
    }

    const { id: paymentId } = await params;

    // Get payment with invoice
    const payment = await prisma.payment.findUnique({
      include: {
        receipt: {
          where: { type: ReceiptType.INVOICE },
        },
        reservation: {
          select: {
            venue: {
              select: {
                id: true,
                ownerId: true,
              },
            },
          },
        },
      },
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found', success: false }, { status: 404 });
    }

    // Check permissions for ADMIN
    if (user.role === 'ADMIN') {
      const adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: user.id },
      });

      const venueIds = adminVenues.map((venue) => venue.id);
      const paymentVenueId = payment.reservation?.venue.id;

      if (!paymentVenueId || !venueIds.includes(paymentVenueId)) {
        return NextResponse.json(
          {
            error: 'No tienes permisos para ver facturas de este pago',
            success: false,
          },
          { status: 403 }
        );
      }
    }

    if (!payment.receipt || payment.receipt.type !== ReceiptType.INVOICE) {
      return NextResponse.json(
        {
          error: 'No invoice found for this payment',
          success: false,
        },
        { status: 404 }
      );
    }

    const invoice = payment.receipt;
    const stripeInvoiceId = (invoice.metadata as any)?.stripeInvoiceId;

    // Get updated Stripe invoice data if available
    let stripeData = null;
    if (stripeInvoiceId) {
      try {
        const stripeInvoice = await stripe.invoices.retrieve(stripeInvoiceId);
        stripeData = {
          dueDate: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000) : null,
          hostedUrl: stripeInvoice.hosted_invoice_url,
          id: stripeInvoice.id,
          number: stripeInvoice.number,
          paid: stripeInvoice.status === 'paid',
          pdfUrl: stripeInvoice.invoice_pdf,
          status: stripeInvoice.status,
          subtotal: stripeInvoice.subtotal,
          tax: 0, // Tax calculation handled locally
          total: stripeInvoice.total,
        };
      } catch (stripeError) {
        console.warn('Failed to fetch Stripe invoice data:', stripeError);
      }
    }

    return NextResponse.json({
      data: {
        invoice: {
          amount: Number(invoice.amount),
          createdAt: invoice.createdAt,
          currency: invoice.currency,
          dueDate: invoice.dueDate,
          id: invoice.id,
          issueDate: invoice.issueDate,
          metadata: invoice.metadata,
          pdfUrl: invoice.pdfUrl,
          receiptNumber: invoice.receiptNumber,
          status: invoice.status,
          subtotalAmount: Number(invoice.subtotalAmount),
          taxAmount: invoice.taxAmount ? Number(invoice.taxAmount) : null,
          type: invoice.type,
          updatedAt: invoice.updatedAt,
        },
        payment: {
          amount: Number(payment.amount),
          currency: payment.currency,
          description: payment.description,
          id: payment.id,
        },
        stripe: stripeData,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      {
        details: error instanceof Error ? error.message : 'Unknown error',
        error: 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
