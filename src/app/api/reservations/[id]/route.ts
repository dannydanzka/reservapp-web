import { NextRequest, NextResponse } from 'next/server';

import {
  reservationRepository,
  ReservationStatus,
} from '@/libs/data/repositories/ReservationRepository';

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    if (includeDetails) {
      const reservation = await reservationRepository.findByIdWithDetails(id);
      if (!reservation) {
        return createResponse(
          false,
          'Reservation not found',
          undefined,
          'Reservation with the specified ID does not exist'
        );
      }
      return createResponse(true, 'Reservation retrieved successfully', reservation);
    } else {
      const reservation = await reservationRepository.findById(id);
      if (!reservation) {
        return createResponse(
          false,
          'Reservation not found',
          undefined,
          'Reservation with the specified ID does not exist'
        );
      }
      return createResponse(true, 'Reservation retrieved successfully', reservation);
    }
  } catch (error) {
    console.error(`GET /api/reservations/${id} error:`, error);
    return createResponse(
      false,
      'Failed to retrieve reservation',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();

    const { checkInDate, checkOutDate, guests, notes, status, totalAmount } = body;

    const updateData = {
      checkInDate: checkInDate ? new Date(checkInDate) : undefined,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
      guests: guests ? parseInt(guests) : undefined,
      notes,
      status: status as ReservationStatus,
      totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
    };

    const reservation = await reservationRepository.update(id, updateData);

    return createResponse(true, 'Reservation updated successfully', reservation);
  } catch (error) {
    console.error(`PUT /api/reservations/${id} error:`, error);
    return createResponse(
      false,
      'Failed to update reservation',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await reservationRepository.delete(id);

    return createResponse(true, 'Reservation deleted successfully');
  } catch (error) {
    console.error(`DELETE /api/reservations/${id} error:`, error);
    return createResponse(
      false,
      'Failed to delete reservation',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
