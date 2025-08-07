import { NextRequest, NextResponse } from 'next/server';

import { VenueFilters, VenueRepository } from '@/libs/data/repositories/VenueRepository';
import { VenueType } from '@prisma/client';

const venueRepository = new VenueRepository();

/**
 * Public endpoint for venues - no authentication required
 * Returns basic venue information for public viewing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: VenueFilters = {
      // Only show active venues for public API
      isActive: true,
    };

    if (searchParams.get('category')) {
      filters.category = searchParams.get('category') as VenueType;
    }

    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }

    if (searchParams.get('city')) {
      filters.city = searchParams.get('city')!;
    }

    if (searchParams.get('rating')) {
      filters.rating = parseFloat(searchParams.get('rating')!);
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      filters.priceRange = {
        max: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : 999999,
        min: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0,
      };
    }

    const venues = await venueRepository.findAll(filters);

    // Transform venues to ensure proper data types for JSON serialization
    // Only return public data - remove sensitive information
    const publicVenues = venues.map((venue) => ({
      _count: venue._count,
      address: venue.address,
      category: venue.category,
      city: venue.city,
      description: venue.description,
      id: venue.id,
      latitude: venue.latitude ? Number(venue.latitude) : undefined,
      longitude: venue.longitude ? Number(venue.longitude) : undefined,
      name: venue.name,
      phone: venue.phone,

      rating: venue.rating ? Number(venue.rating) : undefined,

      // Only include basic service information
      services: venue.services.map((service) => ({
        capacity: service.capacity,
        category: service.category,
        currency: service.currency,
        id: service.id,
        name: service.name,
        price: Number(service.price),
      })),
      website: venue.website,
      // Remove sensitive fields like createdAt, updatedAt, email, etc.
    }));

    return NextResponse.json({
      data: publicVenues,
      message: 'Public venues retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching public venues:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching venues',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
