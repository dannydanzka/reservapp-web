import { NextRequest, NextResponse } from 'next/server';

import { venueRepository, VenueFilters } from '@/libs/data/repositories/VenueRepository';
import { VenueType } from '@prisma/client';

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

/**
 * GET /api/venues/popular
 * Get most popular venues based on reservations and ratings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minRating = searchParams.get('minRating');

    const resultLimit = limit ? parseInt(limit) : 6; // Default 6 results
    const minimumRating = minRating ? parseFloat(minRating) : 0; // Default no minimum rating

    // Validate parameters
    if (isNaN(resultLimit) || resultLimit <= 0 || resultLimit > 50) {
      return createResponse(
        false,
        'El límite debe ser un número entre 1 y 50',
        null,
        'INVALID_LIMIT'
      );
    }

    if (minRating && (isNaN(minimumRating) || minimumRating < 0 || minimumRating > 5)) {
      return createResponse(
        false,
        'El rating mínimo debe ser un número entre 0 y 5',
        null,
        'INVALID_MIN_RATING'
      );
    }

    // Build filters for popular venues
    const filters: VenueFilters = {};

    if (category) {
      // Validate category enum
      const validCategories = [
        'ACCOMMODATION',
        'RESTAURANT',
        'SPA',
        'TOUR_OPERATOR',
        'EVENT_CENTER',
        'ENTERTAINMENT',
      ];
      if (!validCategories.includes(category.toUpperCase())) {
        return createResponse(
          false,
          'Categoría no válida. Debe ser una de: ' + validCategories.join(', '),
          null,
          'INVALID_CATEGORY'
        );
      }
      filters.category = category.toUpperCase() as VenueType;
    }

    if (city) {
      filters.city = city;
    }

    if (minimumRating > 0) {
      filters.rating = minimumRating;
    }

    // Get all venues with filters
    const allVenues = await venueRepository.findAll(filters);

    // Sort by popularity (combination of reservations count and rating)
    // Priority: number of reservations (70%) + rating (30%)
    const popularVenues = allVenues
      .filter((venue) => venue.isActive) // Only active venues
      .map((venue) => {
        const rating = venue.rating ? parseFloat(venue.rating.toString()) : 0;
        return {
          ...venue,
          popularityScore: venue._count.reservations * 0.7 + rating * 0.3,
        };
      })
      .sort((a, b) => {
        // Primary sort: popularity score (descending)
        if (b.popularityScore !== a.popularityScore) {
          return b.popularityScore - a.popularityScore;
        }
        // Secondary sort: rating (descending)
        const aRating = a.rating ? parseFloat(a.rating.toString()) : 0;
        const bRating = b.rating ? parseFloat(b.rating.toString()) : 0;
        if (bRating !== aRating) {
          return bRating - aRating;
        }
        // Tertiary sort: reservation count (descending)
        return b._count.reservations - a._count.reservations;
      })
      .slice(0, resultLimit)
      .map(({ popularityScore: _popularityScore, ...venue }) => venue); // Remove popularity score from response

    return createResponse(
      true,
      `Se encontraron ${popularVenues.length} venues populares`,
      popularVenues
    );
  } catch (error: unknown) {
    console.error('Error fetching popular venues:', error);
    return createResponse(
      false,
      'Error al obtener venues populares',
      null,
      error instanceof Error ? error.message : 'POPULAR_VENUES_ERROR'
    );
  }
}
