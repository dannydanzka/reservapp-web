/**
 * Venue selectors with optimized memoization.
 * Following .selector.ts naming convention from Jafra project.
 */

import { createSelector } from '@reduxjs/toolkit';
import { VenueCategory } from '@services/api/types/venue.types';

import { RootState } from '../store';

// Base selectors
const selectVenueState = (state: RootState) => state.venues;

// Basic selectors
export const selectVenues = createSelector([selectVenueState], (venueState) => venueState.venues);

export const selectSelectedVenue = createSelector(
  [selectVenueState],
  (venueState) => venueState.selectedVenue
);

export const selectPopularVenues = createSelector(
  [selectVenueState],
  (venueState) => venueState.popularVenues
);

export const selectNearbyVenues = createSelector(
  [selectVenueState],
  (venueState) => venueState.nearbyVenues
);

export const selectVenueFilters = createSelector(
  [selectVenueState],
  (venueState) => venueState.filters
);

export const selectVenuePagination = createSelector(
  [selectVenueState],
  (venueState) => venueState.pagination
);

export const selectVenueStats = createSelector(
  [selectVenueState],
  (venueState) => venueState.stats
);

// Loading and error selectors
export const selectIsLoadingVenues = createSelector(
  [selectVenueState],
  (venueState) => venueState.isLoading
);

export const selectVenueError = createSelector(
  [selectVenueState],
  (venueState) => venueState.error
);

export const selectVenueErrorMessage = createSelector([selectVenueState], (venueState) =>
  venueState.isError ? venueState.error : null
);

// Computed selectors
export const selectHasVenues = createSelector([selectVenues], (venues) => venues.length > 0);

export const selectTotalVenues = createSelector(
  [selectVenuePagination],
  (pagination) => pagination.total
);

export const selectVenueHasNextPage = createSelector(
  [selectVenuePagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectVenueHasPreviousPage = createSelector(
  [selectVenuePagination],
  (pagination) => pagination.page > 1
);

// Filter selectors
export const selectVenueHasActiveFilters = createSelector([selectVenueFilters], (filters) => {
  return Boolean(
    filters.category ||
      filters.search ||
      filters.city ||
      filters.rating ||
      filters.priceRange ||
      filters.nearby
  );
});

export const selectFilteredVenuesCount = createSelector([selectVenues], (venues) => venues.length);

// Category selectors
export const selectVenuesByCategory = createSelector([selectVenues], (venues) => {
  const categorizedVenues: Partial<Record<VenueCategory, typeof venues>> = {};

  venues.forEach((venue) => {
    const { category } = venue;
    if (!categorizedVenues[category]) {
      categorizedVenues[category] = [];
    }
    categorizedVenues[category].push(venue);
  });

  return categorizedVenues;
});

export const selectVenueCategoryCounts = createSelector([selectVenues], (venues) => {
  const counts: Partial<Record<VenueCategory, number>> = {};

  venues.forEach((venue) => {
    const { category } = venue;
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
});

export const selectVenuesByCity = createSelector([selectVenues], (venues) => {
  const venuesByCity: Record<string, typeof venues> = {};

  venues.forEach((venue) => {
    const city = venue.city || 'Unknown';
    if (!venuesByCity[city]) {
      venuesByCity[city] = [];
    }
    venuesByCity[city].push(venue);
  });

  return venuesByCity;
});

// Rating selectors
export const selectVenuesByRating = createSelector([selectVenues], (venues) => {
  return venues
    .filter((venue) => venue.rating !== undefined && venue.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
});

export const selectAverageVenueRating = createSelector([selectVenues], (venues) => {
  const venuesWithRating = venues.filter(
    (venue) => venue.rating !== undefined && venue.rating !== null && venue.rating > 0
  );

  if (venuesWithRating.length === 0) return 0;

  const totalRating = venuesWithRating.reduce((sum, venue) => sum + (venue.rating || 0), 0);
  return totalRating / venuesWithRating.length;
});

// Service count selectors
export const selectVenuesWithMostServices = createSelector([selectVenues], (venues) => {
  return [...venues].sort((a, b) => b._count.services - a._count.services);
});

export const selectVenuesWithServices = createSelector([selectVenues], (venues) => {
  return venues.filter((venue) => venue._count.services > 0);
});

export const selectVenuesWithoutServices = createSelector([selectVenues], (venues) => {
  return venues.filter((venue) => venue._count.services === 0);
});

// Activity selectors
export const selectActiveVenues = createSelector([selectVenues], (venues) => {
  return venues.filter((venue) => venue.isActive);
});

export const selectInactiveVenues = createSelector([selectVenues], (venues) => {
  return venues.filter((venue) => !venue.isActive);
});

// Search selectors
export const selectVenuesBySearchTerm = createSelector(
  [selectVenues, (_, searchTerm: string) => searchTerm],
  (venues, searchTerm) => {
    if (!searchTerm.trim()) return venues;

    const term = searchTerm.toLowerCase().trim();
    return venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(term) ||
        venue.address.toLowerCase().includes(term) ||
        venue.city.toLowerCase().includes(term) ||
        venue.description?.toLowerCase().includes(term)
    );
  }
);

// Geographic selectors
export const selectVenuesWithCoordinates = createSelector([selectVenues], (venues) => {
  return venues.filter((venue) => venue.latitude && venue.longitude);
});

// Statistics selectors (temporarily disabled due to missing dependencies)
// export const selectVenueStatsOverview = createSelector([selectVenueStats], (stats) => {
//   if (!stats) return null;
//
//   return {
//     averageRating: stats.averageRating,
//     categoriesCount: Object.keys(stats.venuesByCategory).length,
//     totalReservations: stats.totalReservations,
//     totalRevenue: stats.totalRevenue,
//     totalVenues: stats.totalVenues,
//   };
// });

// export const selectTopVenuesByReservations = createSelector([selectVenueStats], (stats) => {
//   if (!stats?.topVenues) return [];
//
//   return [...stats.topVenues].sort((a, b) => b.reservations - a.reservations);
// });
//
// export const selectTopVenuesByRevenue = createSelector([selectVenueStats], (stats) => {
//   if (!stats?.topVenues) return [];
//
//   return [...stats.topVenues].sort((a, b) => b.revenue - a.revenue);
// });
//
// export const selectTopVenuesByRating = createSelector([selectVenueStats], (stats) => {
//   if (!stats?.topVenues) return [];
//
//   return [...stats.topVenues].sort((a, b) => b.rating - a.rating);
// });

// Specific venue finder
export const selectVenueById = createSelector(
  [selectVenues, (_, venueId: string) => venueId],
  (venues, venueId) => venues.find((venue) => venue.id === venueId)
);

// Business hours selectors (temporarily disabled - businessHours field doesn't exist in Venue model)
// export const selectVenuesOpenNow = createSelector([selectVenues], (venues) => {
//   const now = new Date();
//   const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//   const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
//
//   return venues.filter((venue) => {
//     if (!venue.businessHours?.[currentDay]) return false;
//
//     const dayHours = venue.businessHours[currentDay];
//     if (typeof dayHours === 'object' && dayHours.open && dayHours.close) {
//       return currentTime >= dayHours.open && currentTime <= dayHours.close;
//     }
//
//     return false;
//   });
// });

// Amenity selectors (temporarily disabled - amenities field doesn't exist in Venue model)
// export const selectVenuesWithAmenity = createSelector(
//   [selectVenues, (_, amenity: string) => amenity],
//   (venues, amenity) => {
//     return venues.filter((venue) =>
//       venue.amenities.some((venueAmenity: string) =>
//         venueAmenity.toLowerCase().includes(amenity.toLowerCase())
//       )
//     );
//   }
// );

// export const selectAllAmenities = createSelector([selectVenues], (venues) => {
//   const allAmenities = new Set<string>();
//
//   venues.forEach((venue) => {
//     venue.amenities.forEach((amenity: string) => {
//       allAmenities.add(amenity);
//     });
//   });
//
//   return Array.from(allAmenities).sort();
// });

// Pagination helpers
export const selectCurrentPageVenues = createSelector(
  [selectVenues, selectVenuePagination],
  (venues, pagination) => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return venues.slice(startIndex, endIndex);
  }
);

export const selectPaginationInfo = createSelector([selectVenuePagination], (pagination) => ({
  currentPage: pagination.page,
  hasNext: pagination.page < pagination.totalPages,
  hasPrevious: pagination.page > 1,
  itemsPerPage: pagination.limit,
  totalItems: pagination.total,
  totalPages: pagination.totalPages,
}));
