import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@/libs/services/auth/authMiddleware';
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
 * GET /api/venues/stats
 * Get overall venues statistics (admin only)
 */
export const GET = AuthMiddleware.withRole(
  ['ADMIN', 'MANAGER'],
  async (_request: NextRequest, _user) => {
    try {
      // Get all venues with their services and reservations
      const allVenues = await venueRepository.findAll({});

      // Calculate statistics
      const totalVenues = allVenues.length;
      const activeVenues = allVenues.filter((venue) => venue.isActive);
      const inactiveVenues = allVenues.filter((venue) => !venue.isActive);

      // Category breakdown
      const venuesByCategory: Record<string, number> = {};
      allVenues.forEach((venue) => {
        venuesByCategory[venue.category] = (venuesByCategory[venue.category] || 0) + 1;
      });

      // Rating statistics
      const venuesWithRating = allVenues.filter(
        (venue) =>
          venue.rating !== undefined &&
          venue.rating !== null &&
          parseFloat(venue.rating.toString()) > 0
      );
      const averageRating =
        venuesWithRating.length > 0
          ? venuesWithRating.reduce((sum, venue) => {
              const rating = venue.rating ? parseFloat(venue.rating.toString()) : 0;
              return sum + rating;
            }, 0) / venuesWithRating.length
          : 0;

      // Service statistics
      const totalServices = allVenues.reduce((sum, venue) => sum + venue._count.services, 0);
      const venuesWithServices = allVenues.filter((venue) => venue._count.services > 0);
      const venuesWithoutServices = allVenues.filter((venue) => venue._count.services === 0);

      // Reservation statistics
      const totalReservations = allVenues.reduce(
        (sum, venue) => sum + venue._count.reservations,
        0
      );

      // Calculate revenue (this would be more accurate with actual payment data)
      // For now, we'll estimate based on reservations and services
      const estimatedTotalRevenue = allVenues.reduce((sum, venue) => {
        const avgServicePrice = 1500; // Average service price in MXN (estimate)
        return sum + venue._count.reservations * avgServicePrice;
      }, 0);

      // Top venues by different metrics
      const topVenuesByReservations = [...allVenues]
        .sort((a, b) => b._count.reservations - a._count.reservations)
        .slice(0, 10)
        .map((venue) => ({
          category: venue.category,
          id: venue.id,
          name: venue.name,
          rating: venue.rating ? parseFloat(venue.rating.toString()) : 0,
          reservations: venue._count.reservations,
          revenue: venue._count.reservations * 1500,
          services: venue._count.services, // Estimated
        }));

      const topVenuesByRating = [...venuesWithRating]
        .sort((a, b) => {
          const aRating = a.rating ? parseFloat(a.rating.toString()) : 0;
          const bRating = b.rating ? parseFloat(b.rating.toString()) : 0;
          return bRating - aRating;
        })
        .slice(0, 10)
        .map((venue) => ({
          category: venue.category,
          id: venue.id,
          name: venue.name,
          rating: venue.rating ? parseFloat(venue.rating.toString()) : 0,
          reservations: venue._count.reservations,
          revenue: venue._count.reservations * 1500,
          services: venue._count.services, // Estimated
        }));

      const topVenuesByServices = [...allVenues]
        .sort((a, b) => b._count.services - a._count.services)
        .slice(0, 10)
        .map((venue) => ({
          category: venue.category,
          id: venue.id,
          name: venue.name,
          rating: venue.rating ? parseFloat(venue.rating.toString()) : 0,
          reservations: venue._count.reservations,
          revenue: venue._count.reservations * 1500,
          services: venue._count.services, // Estimated
        }));

      // City statistics
      const venuesByCity: Record<string, number> = {};
      allVenues.forEach((venue) => {
        const city = venue.city || 'Unknown';
        venuesByCity[city] = (venuesByCity[city] || 0) + 1;
      });

      const stats = {
        breakdown: {
          ratingsDistribution: {
            averageRating: Math.round(averageRating * 100) / 100,
            withRating: venuesWithRating.length,
            withoutRating: totalVenues - venuesWithRating.length,
          },
          servicesDistribution: {
            averageServicesPerVenue:
              totalVenues > 0 ? Math.round((totalServices / totalVenues) * 100) / 100 : 0,
            withServices: venuesWithServices.length,
            withoutServices: venuesWithoutServices.length,
          },
          venuesByCategory,
          venuesByCity,
        },
        overview: {
          activeVenues: activeVenues.length,
          averageRating: Math.round(averageRating * 100) / 100,
          estimatedTotalRevenue: Math.round(estimatedTotalRevenue),
          inactiveVenues: inactiveVenues.length,
          totalReservations,
          totalServices,
          totalVenues,
        },
        topVenues: {
          byRating: topVenuesByRating,
          byReservations: topVenuesByReservations,
          byServices: topVenuesByServices,
        },
        trends: {
          averageReservationsPerVenue:
            totalVenues > 0 ? Math.round((totalReservations / totalVenues) * 100) / 100 : 0,
          mostPopularCategory:
            Object.entries(venuesByCategory).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A',
          mostPopularCity:
            Object.entries(venuesByCity).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A',
        },
      };

      return createResponse(true, 'Estadísticas de venues obtenidas exitosamente', stats);
    } catch (error: unknown) {
      console.error('Error fetching venues stats:', error);
      return createResponse(
        false,
        'Error al obtener estadísticas de venues',
        null,
        error instanceof Error ? error.message : 'VENUES_STATS_ERROR'
      );
    }
  }
);
