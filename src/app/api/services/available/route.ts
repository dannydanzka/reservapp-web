import { NextRequest, NextResponse } from 'next/server';

import { ServiceFilters, ServiceRepository } from '@libs/data/repositories/ServiceRepository';
import { ServiceType } from '@prisma/client';

const serviceRepository = new ServiceRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const capacityParam = searchParams.get('capacity');

    if (!checkInParam || !checkOutParam) {
      return NextResponse.json(
        {
          error: 'checkIn and checkOut dates are required',
          message: 'Missing required parameters',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInParam);
    const checkOut = new Date(checkOutParam);
    const capacity = capacityParam ? parseInt(capacityParam) : 1;

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        {
          error: 'Please provide valid ISO date strings',
          message: 'Invalid date format',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (checkIn >= checkOut) {
      return NextResponse.json(
        {
          error: 'Check-in date must be before check-out date',
          message: 'Invalid date range',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const filters: ServiceFilters = {};

    if (searchParams.get('category')) {
      filters.category = searchParams.get('category') as ServiceType;
    }

    if (searchParams.get('venueId')) {
      filters.venueId = searchParams.get('venueId')!;
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      filters.priceRange = {
        max: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : 999999,
        min: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0,
      };
    }

    const availableServices = await serviceRepository.getAvailableServices(
      checkIn,
      checkOut,
      capacity,
      filters
    );

    return NextResponse.json({
      data: availableServices,
      message: `Found ${availableServices.length} available services`,
      metadata: {
        capacity,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        filters,
      },
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching available services:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching available services',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
