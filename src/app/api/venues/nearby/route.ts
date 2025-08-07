import { NextRequest, NextResponse } from 'next/server';

import { venueRepository } from '@/libs/data/repositories/VenueRepository';

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
 * GET /api/venues/nearby
 * Get venues near a specific location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const limit = searchParams.get('limit');

    // Validate required parameters
    if (!lat || !lng) {
      return createResponse(
        false,
        'Los parámetros lat (latitud) y lng (longitud) son requeridos',
        null,
        'MISSING_COORDINATES'
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = radius ? parseFloat(radius) : 10; // Default 10km
    const resultLimit = limit ? parseInt(limit) : 10; // Default 10 results

    // Validate coordinate ranges
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return createResponse(
        false,
        'La latitud debe ser un número entre -90 y 90',
        null,
        'INVALID_LATITUDE'
      );
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return createResponse(
        false,
        'La longitud debe ser un número entre -180 y 180',
        null,
        'INVALID_LONGITUDE'
      );
    }

    if (isNaN(searchRadius) || searchRadius <= 0 || searchRadius > 500) {
      return createResponse(
        false,
        'El radio debe ser un número entre 1 y 500 km',
        null,
        'INVALID_RADIUS'
      );
    }

    if (isNaN(resultLimit) || resultLimit <= 0 || resultLimit > 100) {
      return createResponse(
        false,
        'El límite debe ser un número entre 1 y 100',
        null,
        'INVALID_LIMIT'
      );
    }

    // Find nearby venues using repository method
    const allNearbyVenues = await venueRepository.findNearby(latitude, longitude, searchRadius);

    // Apply result limit manually since the repository method doesn't support it
    const nearbyVenues = allNearbyVenues.slice(0, resultLimit);

    return createResponse(
      true,
      `Se encontraron ${nearbyVenues.length} venues cerca de las coordenadas proporcionadas`,
      nearbyVenues
    );
  } catch (error: unknown) {
    console.error('Error finding nearby venues:', error);
    return createResponse(
      false,
      'Error al buscar venues cercanos',
      null,
      error instanceof Error ? error.message : 'NEARBY_VENUES_ERROR'
    );
  }
}
