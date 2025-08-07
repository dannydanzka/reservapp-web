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

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmPaymentRequest = await request.json();
    const { paymentIntentId, paymentMethodId } = body;

    if (!paymentIntentId || !paymentMethodId) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'paymentIntentId and paymentMethodId are required'
      );
    }

    // Find payment record in database
    const payment = await paymentRepository.findByStripePaymentIntentId(paymentIntentId);
    if (!payment) {
      return createResponse(
        false,
        'Payment not found',
        undefined,
        'Payment with the specified Stripe payment intent ID does not exist'
      );
    }

    // Confirm payment with Stripe
    const confirmedPaymentIntent = await StripeService.confirmPaymentIntent({
      paymentIntentId,
      paymentMethodId,
    });

    // Update payment status based on Stripe response
    let paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' = 'PENDING';
    let reservationStatus: ReservationStatus | undefined;

    switch (confirmedPaymentIntent.status) {
      case 'succeeded':
        paymentStatus = 'COMPLETED';
        reservationStatus = ReservationStatus.CONFIRMED;
        break;
      case 'processing':
        paymentStatus = 'PENDING';
        break;
      case 'requires_action':
      case 'requires_confirmation':
      case 'requires_payment_method':
        paymentStatus = 'PENDING';
        break;
      case 'canceled':
        paymentStatus = 'FAILED';
        reservationStatus = ReservationStatus.CANCELLED;
        break;
      default:
        paymentStatus = 'PENDING';
    }

    // Update payment in database
    const updatedPayment = await paymentRepository.update(payment.id, {
      metadata: {
        ...((payment.metadata as object) ?? {}),
        lastUpdated: new Date().toISOString(),
        stripeStatus: confirmedPaymentIntent.status,
      },
      paidAt: paymentStatus === 'COMPLETED' ? new Date() : undefined,
      status: paymentStatus,
      stripePaymentMethodId: paymentMethodId,
    });

    // Update reservation status if payment is completed
    if (reservationStatus) {
      await reservationRepository.update(payment.reservationId, {
        status: reservationStatus,
      });
    }

    return createResponse(true, 'Payment confirmed successfully', {
      amount: confirmedPaymentIntent.amount / 100,

      clientSecret: confirmedPaymentIntent.client_secret,

      // Convert back to dollars
      currency: confirmedPaymentIntent.currency,

      nextAction: confirmedPaymentIntent.next_action,
      paymentId: updatedPayment.id,
      paymentIntentId: confirmedPaymentIntent.id,
      requiresAction: confirmedPaymentIntent.status === 'requires_action',
      status: confirmedPaymentIntent.status,
    });
  } catch (error) {
    console.error('POST /api/payments/confirm error:', error);
    return createResponse(
      false,
      'Failed to confirm payment',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
