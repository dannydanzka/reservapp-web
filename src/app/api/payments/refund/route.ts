import { NextRequest, NextResponse } from 'next/server';

import { paymentRepository } from '@/libs/data/repositories/PaymentRepository';
import {
  reservationRepository,
  ReservationStatus,
} from '@/libs/data/repositories/ReservationRepository';
import { StripeService } from '@/libs/services/stripe/stripeService';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    error,
    message,
    success,
    timestamp: new Date().toISOString(),
  });
}

interface CreateRefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRefundRequest = await request.json();
    const { amount, metadata, paymentId, reason } = body;

    if (!paymentId) {
      return createResponse(false, 'Missing required fields', undefined, 'paymentId is required');
    }

    // Find payment record in database
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      return createResponse(
        false,
        'Payment not found',
        undefined,
        'Payment with the specified ID does not exist'
      );
    }

    if (payment.status !== 'COMPLETED') {
      return createResponse(
        false,
        'Invalid payment status',
        undefined,
        'Only completed payments can be refunded'
      );
    }

    if (!payment.stripePaymentId) {
      return createResponse(
        false,
        'Missing Stripe payment intent',
        undefined,
        'Payment does not have a valid Stripe payment intent ID'
      );
    }

    // Validate refund amount
    if (amount && amount > Number(payment.amount)) {
      return createResponse(
        false,
        'Invalid refund amount',
        undefined,
        'Refund amount cannot exceed the original payment amount'
      );
    }

    // Create refund in Stripe
    const refund = await StripeService.createRefund(payment.stripePaymentId, amount, reason);

    // Update payment status based on refund
    const isFullRefund = !amount || amount === Number(payment.amount);
    const updatedPayment = await paymentRepository.update(paymentId, {
      metadata: {
        ...((payment.metadata as object) ?? {}),
        refundAmount: refund.amount / 100,
        refundId: refund.id, // Convert to dollars
        refundReason: refund.reason ?? reason,
        refundStatus: refund.status,
        refundedAt: new Date().toISOString(),
        ...metadata,
      },
      refundedAt: isFullRefund ? new Date() : undefined,
      status: isFullRefund ? 'REFUNDED' : 'COMPLETED',
    });

    // Update reservation status if fully refunded
    if (isFullRefund) {
      await reservationRepository.update(payment.reservationId, {
        status: ReservationStatus.CANCELLED,
      });
    }

    return createResponse(true, 'Refund created successfully', {
      amount: refund.amount / 100,

      created: new Date(refund.created * 1000).toISOString(),

      // Convert to dollars
      currency: refund.currency,
      isFullRefund,
      paymentId: updatedPayment.id,
      reason: refund.reason,
      refundId: refund.id,
      status: refund.status,
    });
  } catch (error) {
    console.error('POST /api/payments/refund error:', error);
    return createResponse(
      false,
      'Failed to create refund',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
