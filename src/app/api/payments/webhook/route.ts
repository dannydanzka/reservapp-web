import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { paymentRepository } from '@/libs/data/repositories/PaymentRepository';
import { ResendService } from '@/libs/services/email/resendService';
import {
  reservationRepository,
  ReservationStatus,
} from '@/libs/data/repositories/ReservationRepository';
import { STRIPE_WEBHOOK_EVENTS } from '@/libs/services/stripe/constants';
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

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment record in database
    const payment = await paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    // Update payment status
    const updatedPayment = await paymentRepository.update(payment.id, {
      metadata: {
        ...((payment.metadata as object) ?? {}),
        stripeStatus: paymentIntent.status,
        webhookProcessed: new Date().toISOString(),
      },
      paidAt: new Date(),
      status: 'COMPLETED',
    });

    // Update reservation status
    await reservationRepository.update(payment.reservationId, {
      status: ReservationStatus.CONFIRMED,
    });

    // Send email notifications
    try {
      // Get payment details for email
      const paymentWithDetails = await paymentRepository.findByIdWithDetails(updatedPayment.id);
      if (paymentWithDetails) {
        // Send payment confirmation email
        const paymentEmailData = {
          currency: paymentWithDetails.currency ?? 'usd',
          guestEmail: paymentWithDetails.reservation.user.email,
          guestName:
            `${paymentWithDetails.reservation.user.firstName ?? ''} ${paymentWithDetails.reservation.user.lastName ?? ''}`.trim() ??
            'Usuario',
          paymentAmount: Number(paymentWithDetails.amount),
          paymentDate: new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            month: 'long',
            weekday: 'long',
            year: 'numeric',
          }),
          paymentMethod: 'Tarjeta de Crédito',
          reservationId: paymentWithDetails.reservation.id,
          transactionId: paymentIntent.id,
        };

        await ResendService.sendPaymentConfirmation(paymentEmailData);

        // Send reservation confirmation email
        const reservationEmailData = {
          checkInDate:
            paymentWithDetails.reservation.checkInDate?.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
              year: 'numeric',
            }) ||
            new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
              year: 'numeric',
            }),
          checkOutDate:
            paymentWithDetails.reservation.checkOutDate?.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
              year: 'numeric',
            }) ||
            new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
              year: 'numeric',
            }),
          confirmationCode: paymentWithDetails.reservation.id.slice(-8).toUpperCase(),
          currency: 'usd',
          guestEmail: paymentWithDetails.reservation.user.email,
          guestName:
            `${paymentWithDetails.reservation.user.firstName || ''} ${paymentWithDetails.reservation.user.lastName || ''}`.trim() ||
            'Usuario',
          reservationId: paymentWithDetails.reservation.id,
          // No service number in current schema
          serviceName: paymentWithDetails.reservation.service?.name ?? 'Servicio desconocido',

          serviceNumber: 'N/A',
          specialRequests: undefined,
          // Notes field doesn't exist in current schema
          totalAmount: Number(
            paymentWithDetails.reservation.totalAmount || paymentWithDetails.amount
          ),
          venueName: paymentWithDetails.reservation.service?.venue?.name ?? 'Venue desconocido',
        };

        await ResendService.sendReservationConfirmation(reservationEmailData);
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Continue processing even if email fails
    }

    console.log(`Payment completed successfully: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment record in database
    const payment = await paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    // Update payment status
    await paymentRepository.update(payment.id, {
      metadata: {
        ...((payment.metadata as object) || {}),
        lastPaymentError: paymentIntent.last_payment_error?.message ?? 'Unknown error',
        stripeStatus: paymentIntent.status,
        webhookProcessed: new Date().toISOString(),
      },
      status: 'FAILED',
    });

    // Update reservation status
    await reservationRepository.update(payment.reservationId, {
      status: ReservationStatus.CANCELLED,
    });

    console.log(`Payment failed: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
    throw error;
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment record in database
    const payment = await paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    // Update payment status
    await paymentRepository.update(payment.id, {
      metadata: {
        ...((payment.metadata as object) || {}),
        stripeStatus: paymentIntent.status,
        webhookProcessed: new Date().toISOString(),
      },
      status: 'FAILED',
    });

    // Update reservation status
    await reservationRepository.update(payment.reservationId, {
      status: ReservationStatus.CANCELLED,
    });

    console.log(`Payment canceled: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment_intent.canceled:', error);
    throw error;
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    if (!charge.payment_intent) {
      console.error('Charge refunded event missing payment_intent');
      return;
    }

    // Find payment record in database
    const payment = await paymentRepository.findByStripePaymentIntentId(
      charge.payment_intent as string
    );
    if (!payment) {
      console.error(`Payment not found for Charge: ${charge.id}`);
      return;
    }

    // Update payment status if fully refunded
    if (charge.amount_refunded === charge.amount) {
      await paymentRepository.update(payment.id, {
        metadata: {
          ...((payment.metadata as object) || {}),
          refundAmount: charge.amount_refunded / 100, // Convert to dollars
          webhookProcessed: new Date().toISOString(),
        },
        refundedAt: new Date(),
        status: 'REFUNDED',
      });

      // Update reservation status
      await reservationRepository.update(payment.reservationId, {
        status: ReservationStatus.CANCELLED,
      });
    } else {
      // Partial refund - update metadata but keep status as COMPLETED
      await paymentRepository.update(payment.id, {
        metadata: {
          ...((payment.metadata as object) || {}),
          partialRefundAmount: charge.amount_refunded / 100, // Convert to dollars
          webhookProcessed: new Date().toISOString(),
        },
      });
    }

    console.log(`Charge refunded: ${charge.id}, Amount: ${charge.amount_refunded / 100}`);
  } catch (error) {
    console.error('Error handling charge.refunded:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return createResponse(
        false,
        'Missing Stripe signature',
        undefined,
        'Webhook signature is required'
      );
    }

    const payload = await request.text();

    // Construct and verify webhook event
    const event = await StripeService.constructWebhookEvent(payload, signature);

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED:
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_PAYMENT_FAILED:
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_CANCELED:
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case STRIPE_WEBHOOK_EVENTS.CHARGE_REFUNDED:
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case STRIPE_WEBHOOK_EVENTS.SETUP_INTENT_SUCCEEDED:
        console.log('Setup intent succeeded:', event.data.object.id);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_CREATED:
        console.log('Customer created:', event.data.object.id);
        break;

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_UPDATED:
        console.log('Customer updated:', event.data.object.id);
        break;

      case STRIPE_WEBHOOK_EVENTS.PAYMENT_METHOD_ATTACHED:
        console.log('Payment method attached:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return createResponse(true, 'Webhook processed successfully', { eventType: event.type });
  } catch (error) {
    console.error('POST /api/payments/webhook error:', error);
    return createResponse(
      false,
      'Failed to process webhook',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
