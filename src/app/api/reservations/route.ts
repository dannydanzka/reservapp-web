import { NextRequest, NextResponse } from 'next/server';

import {
  reservationRepository,
  ReservationStatus,
} from '@libs/data/repositories/ReservationRepository';
import { ServiceRepository } from '@libs/data/repositories/ServiceRepository';

const serviceRepository = new ServiceRepository();

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
      checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
      search: searchParams.get('search') || undefined,
      serviceId: searchParams.get('serviceId') || undefined,
      status: (searchParams.get('status') as ReservationStatus) || undefined,
      userId: searchParams.get('userId') || undefined,
      venueId: searchParams.get('venueId') || undefined,
    };

    const pagination = {
      limit: parseInt(searchParams.get('limit') || '10'),
      page: parseInt(searchParams.get('page') || '1'),
    };

    const includeDetails = searchParams.get('includeDetails') === 'true';

    let result;
    if (includeDetails) {
      result = await reservationRepository.findManyWithDetails(filters, pagination);
    } else {
      result = await reservationRepository.findMany(filters, pagination);
    }

    const totalPages = Math.ceil(result.total / pagination.limit);

    return createResponse(true, 'Reservations retrieved successfully', {
      ...result,
      limit: pagination.limit,
      page: pagination.page,
      totalPages,
    });
  } catch (error) {
    console.error('GET /api/reservations error:', error);
    return createResponse(
      false,
      'Failed to retrieve reservations',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { checkIn, checkOut, guestCount, metadata, serviceId, specialRequests, userId } = body;

    if (!userId || !serviceId || !checkIn || !checkOut || !guestCount) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'userId, serviceId, checkIn, checkOut, and guestCount are required'
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return createResponse(
        false,
        'Invalid date range',
        undefined,
        'Check-in date must be before check-out date'
      );
    }

    if (checkInDate < new Date()) {
      return createResponse(
        false,
        'Invalid check-in date',
        undefined,
        'Check-in date cannot be in the past'
      );
    }

    // Check service availability
    const serviceAvailable = await serviceRepository.checkAvailability(
      serviceId,
      checkInDate,
      checkOutDate,
      guestCount
    );

    if (!serviceAvailable) {
      return createResponse(
        false,
        'Service not available',
        undefined,
        'The selected service is not available for the specified dates and capacity'
      );
    }

    // Get service details to calculate total amount
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      return createResponse(
        false,
        'Service not found',
        undefined,
        'The specified service does not exist'
      );
    }

    // Calculate total amount based on service duration or nights
    let totalAmount;
    if (service.duration) {
      // For timed services (spa, tours, etc.), price is per service
      totalAmount = Number(service.price) * guestCount;
    } else {
      // For overnight services (accommodations), calculate by nights
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalAmount = Number(service.price) * nights;
    }

    const reservationData = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount: parseInt(guestCount),
      metadata,
      serviceId,
      specialRequests,
      totalAmount,
      userId,
    };

    const reservation = await reservationRepository.create(reservationData);

    return createResponse(true, 'Reservation created successfully', reservation);
  } catch (error) {
    console.error('POST /api/reservations error:', error);
    return createResponse(
      false,
      'Failed to create reservation',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
