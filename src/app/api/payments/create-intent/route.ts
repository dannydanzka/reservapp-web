import { NextRequest, NextResponse } from 'next/server';

import { PaymentMethod, paymentRepository } from '@/libs/data/repositories/PaymentRepository';
import { reservationRepository } from '@/libs/data/repositories/ReservationRepository';
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

interface CreatePaymentIntentRequest {
  reservationId: string;
  amount: number;
  currency?: string;
  description?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json();
    const { amount, currency, customerId, description, metadata, reservationId } = body;

    if (!reservationId || !amount) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'reservationId and amount are required'
      );
    }

    if (amount <= 0) {
      return createResponse(false, 'Invalid amount', undefined, 'Amount must be greater than 0');
    }

    // Verify reservation exists
    const reservation = await reservationRepository.findByIdWithDetails(reservationId);
    if (!reservation) {
      return createResponse(
        false,
        'Reservation not found',
        undefined,
        'Reservation with the specified ID does not exist'
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await StripeService.createPaymentIntent({
      amount,
      currency: currency ?? 'usd',
      customerId,
      description: description ?? `Payment for reservation ${reservationId}`,
      metadata: {
        checkInDate: reservation.checkInDate.toISOString(),
        checkOutDate: reservation.checkOutDate.toISOString(),
        guestCount: reservation.guests.toString(),
        reservationId,
        serviceId: reservation.serviceId,
        userId: reservation.userId,
        venueId: reservation.service.venue.id,
        ...metadata,
      },
      reservationId,
    });

    // Create payment record in database
    const payment = await paymentRepository.create({
      amount,
      currency: currency ?? 'usd',
      metadata: paymentIntent.metadata,
      method: PaymentMethod.STRIPE,
      reservationId,
      stripePaymentIntentId: paymentIntent.id,
      userId: reservation.userId,
    });

    return createResponse(true, 'Payment intent created successfully', {
      amount: paymentIntent.amount / 100,
      clientSecret: paymentIntent.client_secret,
      // Convert back to dollars
      currency: paymentIntent.currency,

      metadata: paymentIntent.metadata,
      paymentId: payment.id,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('POST /api/payments/create-intent error:', error);
    return createResponse(
      false,
      'Failed to create payment intent',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
