/**
 * Custom venue management hook using Redux selectors.
 * Based on Jafra's domain hook patterns with selector integration.
 */

import { useCallback } from 'react';

import {
  clearError,
  clearNearbyVenues,
  clearPopularVenues,
  clearSelectedVenue,
  createVenueAsync,
  CreateVenueData,
  deleteVenueAsync,
  fetchNearbyVenuesAsync,
  fetchPopularVenuesAsync,
  fetchVenueByIdAsync,
  fetchVenuesAsync,
  fetchVenueStatsAsync,
  resetVenueState,
  setFilters,
  setPagination,
  updateVenueAsync,
  UpdateVenueData,
  VenueFilters,
} from '@infrastructure/state/slices/venue.slice';
import {
  selectActiveVenues,
  selectAverageVenueRating,
  selectFilteredVenuesCount,
  selectHasVenues,
  selectIsLoadingVenues,
  selectNearbyVenues,
  selectPopularVenues,
  selectSelectedVenue,
  // selectTopVenuesByRating, // Temporarily disabled
  // selectTopVenuesByReservations, // Temporarily disabled
  // selectTopVenuesByRevenue, // Temporarily disabled
  selectTotalVenues,
  selectVenueById,
  selectVenueError,
  selectVenueErrorMessage,
  selectVenueFilters,
  selectVenueHasActiveFilters,
  selectVenueHasNextPage,
  selectVenueHasPreviousPage,
  selectVenuePagination,
  selectVenues,
  selectVenuesByCategory,
  selectVenuesByCity,
  selectVenuesByRating,
  // selectVenueStatsOverview, // Temporarily disabled
  selectVenuesWithCoordinates,
  selectVenuesWithMostServices,
  selectVenuesWithoutServices,
  selectVenuesWithServices,
} from '@infrastructure/state/selectors/venue.selector';
import { VenueCategory } from '@services/api/types/venue.types';

import { useAppDispatch, useAppSelector } from './useRedux';

/**
 * Custom hook for venue management state and actions.
 * Provides both state selectors and action dispatchers for venue management.
 */
export const useVenue = () => {
  const dispatch = useAppDispatch();

  // Basic state selectors
  const venues = useAppSelector(selectVenues);
  const selectedVenue = useAppSelector(selectSelectedVenue);
  const popularVenues = useAppSelector(selectPopularVenues);
  const nearbyVenues = useAppSelector(selectNearbyVenues);
  const filters = useAppSelector(selectVenueFilters);
  const pagination = useAppSelector(selectVenuePagination);
  const isLoading = useAppSelector(selectIsLoadingVenues);
  const error = useAppSelector(selectVenueError);
  const errorMessage = useAppSelector(selectVenueErrorMessage);

  // Computed selectors
  const hasVenues = useAppSelector(selectHasVenues);
  const totalVenues = useAppSelector(selectTotalVenues);
  const filteredVenuesCount = useAppSelector(selectFilteredVenuesCount);
  const hasActiveFilters = useAppSelector(selectVenueHasActiveFilters);
  const hasNextPage = useAppSelector(selectVenueHasNextPage);
  const hasPreviousPage = useAppSelector(selectVenueHasPreviousPage);

  // Category and grouping selectors
  const venuesByCategory = useAppSelector(selectVenuesByCategory);
  const venuesByCity = useAppSelector(selectVenuesByCity);
  const venuesByRating = useAppSelector(selectVenuesByRating);
  const activeVenues = useAppSelector(selectActiveVenues);
  const venuesWithServices = useAppSelector(selectVenuesWithServices);
  const venuesWithoutServices = useAppSelector(selectVenuesWithoutServices);
  const venuesWithCoordinates = useAppSelector(selectVenuesWithCoordinates);
  const venuesWithMostServices = useAppSelector(selectVenuesWithMostServices);

  // Statistics selectors
  const averageVenueRating = useAppSelector(selectAverageVenueRating);
  // const venueStatsOverview = useAppSelector(selectVenueStatsOverview); // Temporarily disabled
  // const topVenuesByReservations = useAppSelector(selectTopVenuesByReservations); // Temporarily disabled
  // const topVenuesByRevenue = useAppSelector(selectTopVenuesByRevenue); // Temporarily disabled
  // const topVenuesByRating = useAppSelector(selectTopVenuesByRating); // Temporarily disabled

  // Action dispatchers
  const fetchVenues = useCallback(
    async (params?: { filters?: VenueFilters; pagination?: { page?: number; limit?: number } }) => {
      return dispatch(fetchVenuesAsync(params || {})).unwrap();
    },
    [dispatch]
  );

  const fetchVenueById = useCallback(
    async (id: string, includeServices: boolean = true) => {
      return dispatch(fetchVenueByIdAsync({ id, includeServices })).unwrap();
    },
    [dispatch]
  );

  const createVenue = useCallback(
    async (venueData: CreateVenueData) => {
      return dispatch(createVenueAsync(venueData)).unwrap();
    },
    [dispatch]
  );

  const updateVenue = useCallback(
    async (venueData: UpdateVenueData) => {
      return dispatch(updateVenueAsync(venueData)).unwrap();
    },
    [dispatch]
  );

  const deleteVenue = useCallback(
    async (venueId: string) => {
      return dispatch(deleteVenueAsync(venueId)).unwrap();
    },
    [dispatch]
  );

  const fetchPopularVenues = useCallback(
    async (limit: number = 6) => {
      return dispatch(fetchPopularVenuesAsync(limit)).unwrap();
    },
    [dispatch]
  );

  const fetchNearbyVenues = useCallback(
    async (params: { latitude: number; longitude: number; radius?: number; limit?: number }) => {
      return dispatch(fetchNearbyVenuesAsync(params)).unwrap();
    },
    [dispatch]
  );

  const fetchVenueStats = useCallback(async () => {
    return dispatch(fetchVenueStatsAsync()).unwrap();
  }, [dispatch]);

  // Filter and pagination actions
  const updateFilters = useCallback(
    (newFilters: VenueFilters) => {
      dispatch(setFilters(newFilters));
      // Reset to first page when filters change
      dispatch(setPagination({ page: 1 }));
    },
    [dispatch]
  );

  const updatePagination = useCallback(
    (newPagination: Partial<typeof pagination>) => {
      dispatch(setPagination(newPagination));
    },
    [dispatch]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      dispatch(setPagination({ page: pagination.page + 1 }));
    }
  }, [dispatch, hasNextPage, pagination.page]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      dispatch(setPagination({ page: pagination.page - 1 }));
    }
  }, [dispatch, hasPreviousPage, pagination.page]);

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setPagination({ page }));
    },
    [dispatch]
  );

  // Utility actions
  const clearVenueError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSelectedVenueData = useCallback(() => {
    dispatch(clearSelectedVenue());
  }, [dispatch]);

  const resetVenues = useCallback(() => {
    dispatch(resetVenueState());
  }, [dispatch]);

  const clearPopular = useCallback(() => {
    dispatch(clearPopularVenues());
  }, [dispatch]);

  const clearNearby = useCallback(() => {
    dispatch(clearNearbyVenues());
  }, [dispatch]);

  // Refresh current data
  const refreshVenues = useCallback(async () => {
    await fetchVenues({ filters, pagination: { limit: pagination.limit, page: pagination.page } });
  }, [fetchVenues, filters, pagination]);

  const refreshSelectedVenue = useCallback(async () => {
    if (selectedVenue) {
      await fetchVenueById(selectedVenue.id, true);
    }
  }, [fetchVenueById, selectedVenue]);

  // Search and filter helpers
  const searchVenues = useCallback(
    async (searchTerm: string) => {
      const newFilters = { ...filters, search: searchTerm };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchVenues({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchVenues]
  );

  const filterByCategory = useCallback(
    async (category: VenueCategory | undefined) => {
      const newFilters = { ...filters, category };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchVenues({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchVenues]
  );

  const filterByCity = useCallback(
    async (city: string | undefined) => {
      const newFilters = { ...filters, city };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchVenues({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchVenues]
  );

  const filterByRating = useCallback(
    async (rating: number | undefined) => {
      const newFilters = { ...filters, rating };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchVenues({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchVenues]
  );

  const filterByPriceRange = useCallback(
    async (priceRange: { min: number; max: number } | undefined) => {
      const newFilters = { ...filters, priceRange };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchVenues({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchVenues]
  );

  const clearFilters = useCallback(async () => {
    dispatch(setFilters({}));
    dispatch(setPagination({ page: 1 }));
    await fetchVenues({ filters: {}, pagination: { limit: pagination.limit, page: 1 } });
  }, [dispatch, pagination.limit, fetchVenues]);

  // Geolocation helpers
  const searchNearbyVenues = useCallback(
    async (latitude: number, longitude: number, radius: number = 10, limit: number = 10) => {
      return fetchNearbyVenues({ latitude, limit, longitude, radius });
    },
    [fetchNearbyVenues]
  );

  // Venue finder helpers
  const findVenueById = useCallback(
    (venueId: string) => {
      return venues.find((venue) => venue.id === venueId);
    },
    [venues]
  );

  const getVenuesByCategory = useCallback(
    (category: VenueCategory) => {
      return venues.filter((venue) => venue.category === category);
    },
    [venues]
  );

  // Validation helpers
  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateVenueData = useCallback(
    (venueData: CreateVenueData): string[] => {
      const errors: string[] = [];

      if (!venueData.name?.trim()) errors.push('Nombre del venue es requerido');
      if (!venueData.category) errors.push('Categoría es requerida');
      if (!venueData.address?.trim()) errors.push('Dirección es requerida');

      if (venueData.email && !isValidEmail(venueData.email)) {
        errors.push('Email no es válido');
      }

      if (venueData.latitude && (venueData.latitude < -90 || venueData.latitude > 90)) {
        errors.push('Latitud debe estar entre -90 y 90');
      }

      if (venueData.longitude && (venueData.longitude < -180 || venueData.longitude > 180)) {
        errors.push('Longitud debe estar entre -180 y 180');
      }

      return errors;
    },
    [isValidEmail]
  );

  // Business logic helpers
  const isVenueActive = useCallback(
    (venueId: string): boolean => {
      const venue = findVenueById(venueId);
      return venue?.isActive || false;
    },
    [findVenueById]
  );

  const hasVenueServices = useCallback(
    (venueId: string): boolean => {
      const venue = findVenueById(venueId);
      return (venue?._count?.services || 0) > 0;
    },
    [findVenueById]
  );

  const getVenueServiceCount = useCallback(
    (venueId: string): number => {
      const venue = findVenueById(venueId);
      return venue?._count?.services || 0;
    },
    [findVenueById]
  );

  const getVenueReservationCount = useCallback(
    (venueId: string): number => {
      const venue = findVenueById(venueId);
      return venue?._count?.reservations || 0;
    },
    [findVenueById]
  );

  return {
    activeVenues,
    averageVenueRating,
    clearFilters,
    clearNearby,
    clearPopular,
    clearSelectedVenueData,
    clearVenueError,
    createVenue,
    deleteVenue,
    error,
    errorMessage,
    fetchNearbyVenues,
    fetchPopularVenues,
    fetchVenueById,
    fetchVenueStats,
    fetchVenues,
    filterByCategory,
    filterByCity,
    filterByPriceRange,
    filterByRating,
    filteredVenuesCount,
    filters,
    findVenueById,
    getVenueReservationCount,
    getVenueServiceCount,
    getVenuesByCategory,
    goToPage,
    hasActiveFilters,
    hasNextPage,
    hasPreviousPage,
    hasVenueServices,
    hasVenues,
    isLoading,
    isValidEmail,
    isVenueActive,
    nearbyVenues,
    nextPage,
    pagination,
    popularVenues,
    previousPage,
    refreshSelectedVenue,
    refreshVenues,
    resetVenues,
    searchNearbyVenues,
    searchVenues,
    selectedVenue,
    // topVenuesByRating, // Temporarily disabled
    // topVenuesByReservations, // Temporarily disabled
    // topVenuesByRevenue, // Temporarily disabled
    totalVenues,
    updateFilters,
    updatePagination,
    updateVenue,
    validateVenueData,
    // venueStatsOverview, // Temporarily disabled
    venues,
    venuesByCategory,
    venuesByCity,
    venuesByRating,
    venuesWithCoordinates,
    venuesWithMostServices,
    venuesWithServices,
    venuesWithoutServices,
  };
};
