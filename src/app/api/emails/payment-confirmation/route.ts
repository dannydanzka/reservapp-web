import { NextRequest, NextResponse } from 'next/server';

import { PaymentEmailData, ResendService } from '@/libs/services/email/resendService';
import { paymentRepository } from '@/libs/data/repositories/PaymentRepository';

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

interface PaymentConfirmationRequest {
  paymentId: string;
  guestEmail?: string; // Optional override
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentConfirmationRequest = await request.json();
    const { guestEmail, paymentId } = body;

    if (!paymentId) {
      return createResponse(false, 'Missing required fields', undefined, 'paymentId is required');
    }

    // Get payment details with reservation info
    const payment = await paymentRepository.findByIdWithDetails(paymentId);
    if (!payment) {
      return createResponse(
        false,
        'Payment not found',
        undefined,
        'Payment with the specified ID does not exist'
      );
    }

    // Check if payment is completed
    if (payment.status !== 'COMPLETED') {
      return createResponse(
        false,
        'Payment not completed',
        undefined,
        'Payment confirmation emails can only be sent for completed payments'
      );
    }

    // Prepare email data
    const emailData: PaymentEmailData = {
      currency: payment.currency ?? 'usd',
      guestEmail: guestEmail ?? payment.reservation.user.email,
      guestName:
        `${payment.reservation.user.firstName ?? ''} ${payment.reservation.user.lastName ?? ''}`.trim() ||
        'Usuario',
      paymentAmount: Number(payment.amount),
      paymentDate: payment.createdAt.toLocaleDateString('es-ES', {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      }),
      paymentMethod: 'Tarjeta de Crédito', // Default method
      reservationId: payment.reservation.id,
      transactionId: payment.stripePaymentId ?? payment.id,
    };

    // Send payment confirmation email
    const result = await ResendService.sendPaymentConfirmation(emailData);

    if (!result.success) {
      return createResponse(
        false,
        'Failed to send payment confirmation email',
        undefined,
        result.error
      );
    }

    return createResponse(true, 'Payment confirmation email sent successfully', {
      emailId: result.id,
      enabledStatus: ResendService.isEmailEnabled(),
      paymentId,
      recipient: emailData.guestEmail,
      reservationId: payment.reservation.id,
    });
  } catch (error) {
    console.error('POST /api/emails/payment-confirmation error:', error);
    return createResponse(
      false,
      'Failed to send payment confirmation email',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
