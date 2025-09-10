import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient } from '@prisma/client';

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
 * GET /api/payments/[id]
 * Get detailed information about a specific payment
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;

    // Get payment with all related data
    const payment = await prisma.payment.findFirst({
      include: {
        receipt: {
          select: {
            amount: true,
            currency: true,
            dueDate: true,
            id: true,
            isVerified: true,
            issueDate: true,
            metadata: true,
            paidDate: true,
            pdfUrl: true,
            receiptNumber: true,
            status: true,
            subtotalAmount: true,
            taxAmount: true,
            type: true,
            verifiedBy: true,
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
                price: true,
              },
            },
            venue: {
              select: {
                address: true,
                category: true,
                city: true,
                country: true,
                description: true,
                id: true,
                name: true,
                owner: {
                  select: {
                    businessAccount: {
                      select: {
                        businessName: true,
                        businessType: true,
                        contactEmail: true,
                        contactPhone: true,
                      },
                    },
                  },
                },
                state: true,
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
      where: {
        id,
        userId: user.id, // Ensure user owns this payment
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found', success: false }, { status: 404 });
    }

    // Enhance with Stripe data if available
    let stripeData = null;
    if (payment.stripePaymentId) {
      try {
        const stripePayment = await stripe.paymentIntents.retrieve(payment.stripePaymentId, {
          expand: ['charges.data.balance_transaction', 'payment_method'],
        });

        stripeData = {
          amount: stripePayment.amount,
          charges: [],
          clientSecret: stripePayment.client_secret,
          created: new Date(stripePayment.created * 1000),
          currency: stripePayment.currency,
          description: stripePayment.description,
          id: stripePayment.id,
          lastPaymentError: stripePayment.last_payment_error,
          paymentMethod: stripePayment.payment_method,
          status: stripePayment.status,
        };
      } catch (stripeError) {
        console.warn(`Failed to fetch Stripe payment ${payment.stripePaymentId}:`, stripeError);
      }
    }

    // Determine payment type
    const paymentType = payment.reservation
      ? 'reservation'
      : (payment.metadata as any)?.paymentType === 'subscription'
        ? 'subscription'
        : 'business';

    // Format response
    const formattedPayment = {
      amount: Number(payment.amount),
      createdAt: payment.createdAt,
      currency: payment.currency,
      description: payment.description,
      id: payment.id,
      // Metadata and additional info
      metadata: payment.metadata,

      paymentMethod: payment.paymentMethod,

      // Related entities
      reservation: payment.reservation,

      status: payment.status,

      stripeData,

      // Stripe information
      stripePaymentId: payment.stripePaymentId,

      transactionDate: payment.transactionDate,

      // Payment classification
      type: paymentType,

      updatedAt: payment.updatedAt,

      // User info (for admin purposes)
      user: {
        email: payment.user.email,
        fullName: `${payment.user.firstName} ${payment.user.lastName}`,
        id: payment.user.id,
      },
    };

    return NextResponse.json({
      data: formattedPayment,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
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
 * PATCH /api/payments/[id]
 * Update payment metadata or status (limited user actions)
 *
 * Body:
 * {
 *   action: 'cancel' | 'update_metadata';
 *   metadata?: object;
 *   reason?: string;
 * }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;
    const body = await request.json();
    const { action, metadata, reason } = body;

    // Verify payment ownership
    const payment = await prisma.payment.findFirst({
      include: {
        reservation: true,
      },
      where: {
        id,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found', success: false }, { status: 404 });
    }

    let updatedPayment;

    switch (action) {
      case 'cancel':
        // Only allow cancellation of pending payments
        if (payment.status !== 'PENDING') {
          return NextResponse.json(
            { error: 'Only pending payments can be cancelled', success: false },
            { status: 400 }
          );
        }

        // Cancel Stripe payment intent if exists
        if (payment.stripePaymentId) {
          try {
            await stripe.paymentIntents.cancel(payment.stripePaymentId);
          } catch (stripeError) {
            console.warn('Failed to cancel Stripe payment:', stripeError);
          }
        }

        updatedPayment = await prisma.payment.update({
          data: {
            metadata: {
              ...((payment.metadata as object) || {}),
              cancellation: {
                cancelledAt: new Date().toISOString(),
                cancelledBy: user.id,
                reason: reason || 'Cancelled by user',
              },
            },
            status: 'CANCELLED',
          },
          where: { id },
        });
        break;

      case 'update_metadata': {
        // Allow users to update certain metadata fields
        const allowedMetadataFields = ['notes', 'preferences', 'contact_info'];
        const filteredMetadata = Object.keys(metadata || {})
          .filter((key) => allowedMetadataFields.includes(key))
          .reduce((obj: any, key) => {
            obj[key] = metadata[key];
            return obj;
          }, {});

        updatedPayment = await prisma.payment.update({
          data: {
            metadata: {
              ...((payment.metadata as object) || {}),
              ...filteredMetadata,
              lastUpdated: new Date().toISOString(),
              updatedBy: user.id,
            },
          },
          where: { id },
        });
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid action', success: false }, { status: 400 });
    }

    return NextResponse.json({
      data: {
        id: updatedPayment.id,
        metadata: updatedPayment.metadata,
        status: updatedPayment.status,
        updatedAt: updatedPayment.updatedAt,
      },
      message: `Payment ${action} completed successfully`,
      success: true,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
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
