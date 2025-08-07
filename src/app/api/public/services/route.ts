import { NextRequest, NextResponse } from 'next/server';

import { ServiceFilters, ServiceRepository } from '@libs/data/repositories/ServiceRepository';
import { ServiceType } from '@prisma/client';

const serviceRepository = new ServiceRepository();

/**
 * Public endpoint for services - no authentication required
 * Returns basic service information for public viewing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: ServiceFilters = {
      // Only show available services for public API
      available: true,
    };

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

    const services = await serviceRepository.findAll(filters);

    // Transform services to ensure proper data types for JSON serialization
    // Only return public data - remove sensitive information
    const publicServices = services.map((service) => ({
      amenities: service.amenities || [],
      capacity: service.capacity,
      category: service.category,
      currency: service.currency,
      description: service.description,
      duration: service.duration,
      id: service.id,
      name: service.name,
      price: Number(service.price),
      // Include basic venue information for context
      venue: service.venue
        ? {
            address: service.venue.address,
            category: service.venue.category,
            id: service.venue.id,
            name: service.venue.name,
            rating: service.venue.rating ? Number(service.venue.rating) : undefined,
          }
        : undefined,
      // Remove sensitive fields like createdAt, updatedAt, metadata, etc.
    }));

    return NextResponse.json({
      data: publicServices,
      message: 'Public services retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching public services:', error);
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
