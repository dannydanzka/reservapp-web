import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const reservation = await reservationRepository.checkIn(id);

    return createResponse(true, 'Check-in processed successfully', reservation);
  } catch (error) {
    console.error(`POST /api/reservations/${id}/checkin error:`, error);
    return createResponse(
      false,
      'Failed to process check-in',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
