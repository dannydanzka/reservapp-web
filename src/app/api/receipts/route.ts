import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient, ReceiptStatus, ReceiptType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/receipts
 * Get user's receipts and invoices with filtering and pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 50)
 * - type: Filter by receipt type (PAYMENT, INVOICE, REFUND, CREDIT_NOTE)
 * - status: Filter by receipt status (PENDING, VERIFIED, REJECTED, REGENERATED)
 * - startDate: Filter from date (ISO string)
 * - endDate: Filter to date (ISO string)
 * - paymentId: Filter by specific payment ID
 */
export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // Parse filters
    const type = url.searchParams.get('type') as ReceiptType;
    const status = url.searchParams.get('status') as ReceiptStatus;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const paymentId = url.searchParams.get('paymentId');

    // Build where clause
    const whereClause: any = {
      userId: user.id,
    };

    if (type && Object.values(ReceiptType).includes(type)) {
      whereClause.type = type;
    }

    if (status && Object.values(ReceiptStatus).includes(status)) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.issueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (paymentId) {
      whereClause.paymentId = paymentId;
    }

    // Execute queries in parallel
    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        include: {
          payment: {
            select: {
              amount: true,
              currency: true,
              description: true,
              id: true,
              paymentMethod: true,
              reservation: {
                select: {
                  checkInDate: true,
                  checkOutDate: true,
                  confirmationId: true,
                  id: true,
                  service: {
                    select: {
                      category: true,
                      id: true,
                      name: true,
                    },
                  },
                  venue: {
                    select: {
                      category: true,
                      city: true,
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              status: true,
              stripePaymentId: true,
              transactionDate: true,
            },
          },
        },
        orderBy: { issueDate: 'desc' },
        skip: offset,
        take: limit,
        where: whereClause,
      }),
      prisma.receipt.count({ where: whereClause }),
    ]);

    // Get summary statistics
    const [totalAmount, verifiedCount, pendingCount] = await Promise.all([
      prisma.receipt.aggregate({
        _sum: { amount: true },
        where: { type: ReceiptType.PAYMENT, userId: user.id },
      }),
      prisma.receipt.count({
        where: { status: ReceiptStatus.VERIFIED, userId: user.id },
      }),
      prisma.receipt.count({
        where: { status: ReceiptStatus.PENDING, userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Format response
    const formattedReceipts = receipts.map((receipt) => ({
      amount: Number(receipt.amount),
      createdAt: receipt.createdAt,
      currency: receipt.currency,
      // Customer information
      customer: {
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        id: user.id,
      },

      dueDate: receipt.dueDate,

      id: receipt.id,

      isVerified: receipt.isVerified,

      issueDate: receipt.issueDate,

      // Metadata
      metadata: receipt.metadata,
      paidDate: receipt.paidDate,

      // Related payment information
      payment: receipt.payment,

      pdfUrl: receipt.pdfUrl,

      receiptNumber: receipt.receiptNumber,

      status: receipt.status,

      subtotalAmount: Number(receipt.subtotalAmount),

      taxAmount: receipt.taxAmount ? Number(receipt.taxAmount) : null,

      type: receipt.type,

      updatedAt: receipt.updatedAt,

      verifiedBy: receipt.verifiedBy,
    }));

    return NextResponse.json({
      data: {
        pagination: {
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit,
          page,
          total,
          totalPages,
        },
        receipts: formattedReceipts,
        summary: {
          pendingCount,
          totalAmount: Number(totalAmount._sum.amount || 0),
          totalReceipts: total,
          verifiedCount,
        },
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching user receipts:', error);
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
 * POST /api/receipts
 * Request a new receipt for a payment
 *
 * Body:
 * {
 *   paymentId: string;
 *   type?: ReceiptType;
 *   metadata?: object;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const body = await request.json();
    const { metadata, paymentId, type = ReceiptType.PAYMENT } = body;

    // Validate required fields
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required', success: false },
        { status: 400 }
      );
    }

    // Verify payment ownership and existence
    const payment = await prisma.payment.findFirst({
      include: {
        reservation: {
          include: {
            service: { select: { name: true } },
            venue: { select: { name: true } },
          },
        },
      },
      where: {
        id: paymentId,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or not owned by user', success: false },
        { status: 404 }
      );
    }

    // Check if receipt already exists for this payment
    const existingReceipt = await prisma.receipt.findFirst({
      where: {
        paymentId,
        type,
        userId: user.id,
      },
    });

    if (existingReceipt) {
      return NextResponse.json(
        {
          data: { existingReceiptId: existingReceipt.id },
          error: 'Receipt already exists for this payment',
          success: false,
        },
        { status: 409 }
      );
    }

    // Calculate tax amount (16% IVA for Mexico)
    const taxRate = 0.16;
    const subtotalAmount = Number(payment.amount) / (1 + taxRate);
    const taxAmount = Number(payment.amount) - subtotalAmount;

    // Generate description based on payment type
    let { description } = payment;
    if (payment.reservation) {
      description = `Reserva en ${payment.reservation.venue.name} - ${payment.reservation.service.name}`;
    } else {
      // Check metadata for subscription info
      const metadata = payment.metadata as any;
      if (metadata?.paymentType === 'subscription') {
        description = `Suscripción ${metadata.subscriptionType || 'Premium'}`;
      }
    }

    // Create receipt
    const receipt = await prisma.receipt.create({
      data: {
        amount: payment.amount,
        currency: payment.currency,
        issueDate: new Date(),
        metadata: {
          ...metadata,
          description,
          paymentType: payment.reservation
            ? 'reservation'
            : (payment.metadata as any)?.paymentType === 'subscription'
              ? 'subscription'
              : 'business',
          requestedAt: new Date().toISOString(),
          requestedBy: user.id,
        },
        paidDate: payment.status === 'COMPLETED' ? payment.transactionDate : null,
        paymentId,
        status: ReceiptStatus.PENDING,
        subtotalAmount,
        taxAmount,
        type,
        userId: user.id,
      },
      include: {
        payment: {
          select: {
            amount: true,
            description: true,
            id: true,
            status: true,
            transactionDate: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        amount: Number(receipt.amount),
        createdAt: receipt.createdAt,
        currency: receipt.currency,
        id: receipt.id,
        issueDate: receipt.issueDate,
        payment: receipt.payment,
        receiptNumber: receipt.receiptNumber,
        status: receipt.status,
        subtotalAmount: Number(receipt.subtotalAmount),
        taxAmount: Number(receipt.taxAmount),
        type: receipt.type,
      },
      message: 'Receipt requested successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
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
