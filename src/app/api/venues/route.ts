import { NextRequest, NextResponse } from 'next/server';

import { Prisma, VenueType } from '@prisma/client';
import { VenueFilters, VenueRepository } from '@/libs/data/repositories/VenueRepository';

const venueRepository = new VenueRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: VenueFilters = {};

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

    if (searchParams.get('isActive')) {
      filters.isActive = searchParams.get('isActive') === 'true';
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      filters.priceRange = {
        max: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : 999999,
        min: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0,
      };
    }

    const venues = await venueRepository.findAll(filters);

    // Transform venues to ensure proper data types for JSON serialization
    const transformedVenues = venues.map((venue) => ({
      ...venue,
      latitude: venue.latitude ? Number(venue.latitude) : undefined,
      longitude: venue.longitude ? Number(venue.longitude) : undefined,
      rating: venue.rating ? Number(venue.rating) : undefined,
      services: venue.services.map((service) => ({
        ...service,
        price: Number(service.price),
      })),
    }));

    return NextResponse.json({
      data: transformedVenues,
      message: 'Venues retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const venueData: Prisma.VenueCreateInput = {
      address: body.address,
      category: body.category,
      city: body.city || '',
      description: body.description,
      email: body.email,
      isActive: body.isActive ?? true,
      latitude: body.latitude ? new Prisma.Decimal(body.latitude) : undefined,
      longitude: body.longitude ? new Prisma.Decimal(body.longitude) : undefined,
      name: body.name,
      phone: body.phone,
      rating: body.rating ? new Prisma.Decimal(body.rating) : undefined,
      website: body.website,
    };

    const venue = await venueRepository.create(venueData);

    return NextResponse.json(
      {
        data: venue,
        message: 'Venue created successfully',
        success: true,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error creating venue',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
