import { NextRequest, NextResponse } from 'next/server';

import { Prisma, ServiceType } from '@prisma/client';
import { ServiceFilters, ServiceRepository } from '@libs/data/repositories/ServiceRepository';

const serviceRepository = new ServiceRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: ServiceFilters = {};

    if (searchParams.get('category')) {
      filters.category = searchParams.get('category') as ServiceType;
    }

    if (searchParams.get('venueId')) {
      filters.venueId = searchParams.get('venueId')!;
    }

    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      filters.priceRange = {
        max: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : 999999,
        min: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0,
      };
    }

    if (searchParams.get('capacity')) {
      filters.capacity = parseInt(searchParams.get('capacity')!);
    }

    if (searchParams.get('duration')) {
      filters.duration = parseInt(searchParams.get('duration')!);
    }

    if (searchParams.get('available')) {
      filters.available = searchParams.get('available') === 'true';
    }

    const services = await serviceRepository.findAll(filters);

    return NextResponse.json({
      data: services,
      message: 'Services retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching services',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const serviceData: Prisma.ServiceCreateInput = {
      amenities: body.amenities || [],
      capacity: body.capacity || 1,
      category: body.category,
      currency: body.currency || 'MXN',
      description: body.description,
      duration: body.duration,
      isActive: body.isActive ?? true,
      metadata: body.metadata || {},
      name: body.name,
      price: new Prisma.Decimal(body.price),
      venue: {
        connect: { id: body.venueId },
      },
    };

    const service = await serviceRepository.create(serviceData);

    return NextResponse.json(
      {
        data: service,
        message: 'Service created successfully',
        success: true,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error creating service',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
