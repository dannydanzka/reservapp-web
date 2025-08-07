import { NextRequest, NextResponse } from 'next/server';

import { ResendService, ReservationEmailData } from '@/libs/services/email/resendService';
import { reservationRepository } from '@/libs/data/repositories/ReservationRepository';

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

interface ReservationCancellationRequest {
  reservationId: string;
  guestEmail?: string; // Optional override
}

export async function POST(request: NextRequest) {
  try {
    const body: ReservationCancellationRequest = await request.json();
    const { guestEmail, reservationId } = body;

    if (!reservationId) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'reservationId is required'
      );
    }

    // Get reservation details
    const reservation = await reservationRepository.findByIdWithDetails(reservationId);
    if (!reservation) {
      return createResponse(
        false,
        'Reservation not found',
        undefined,
        'Reservation with the specified ID does not exist'
      );
    }

    // Prepare email data
    const emailData: ReservationEmailData = {
      checkInDate: reservation.checkInDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      }),
      checkOutDate: reservation.checkOutDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      }),
      currency: 'usd',
      guestEmail: guestEmail ?? reservation.user.email,
      guestName: reservation.user.name,
      reservationId: reservation.id,
      // No service number in current schema
      serviceName: reservation.service.name,

      serviceNumber: 'N/A',
      totalAmount: Number(reservation.totalAmount),
      venueName: reservation.service.venue.name,
    };

    // Send cancellation email
    const result = await ResendService.sendReservationCancellation(emailData);

    if (!result.success) {
      return createResponse(false, 'Failed to send cancellation email', undefined, result.error);
    }

    return createResponse(true, 'Reservation cancellation email sent successfully', {
      emailId: result.id,
      enabledStatus: ResendService.isEmailEnabled(),
      recipient: emailData.guestEmail,
      reservationId,
    });
  } catch (error) {
    console.error('POST /api/emails/reservation-cancellation error:', error);
    return createResponse(
      false,
      'Failed to send cancellation email',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
