/**
 * Venues Hook using HTTP API instead of Prisma direct
 * For venue management in admin interface
 */

import { useCallback, useState } from 'react';

import {
  Venue,
  VenueCreateData,
  VenueFilters,
  venuesApiService,
  VenueUpdateData,
} from '@services/core/api/venuesApiService';

export interface UseVenuesReturn {
  // State
  venues: Venue[];
  isLoading: boolean;
  error: string | null;
  totalVenues: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hasVenues: boolean;
  hasActiveFilters: boolean;

  // Actions
  loadVenues: (filters?: VenueFilters, page?: number, limit?: number) => Promise<void>;
  createVenue: (venueData: VenueCreateData) => Promise<Venue | null>;
  updateVenue: (venueData: VenueUpdateData) => Promise<Venue | null>;
  deleteVenue: (id: string) => Promise<boolean>;
  toggleVenueStatus: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearFilters: () => void;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  setFilters: (filters: VenueFilters) => void;

  // Computed values
  currentPageInfo: {
    current: number;
    total: number;
  };
  filters: VenueFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useVenues(): UseVenuesReturn {
  // State
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<VenueFilters>({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    pages: 0,
    total: 0,
  });

  // Computed values
  const totalVenues = pagination.total;
  const currentPage = pagination.page;
  const totalPages = pagination.pages;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const hasVenues = venues.length > 0;
  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof VenueFilters] !== undefined &&
      filters[key as keyof VenueFilters] !== null &&
      filters[key as keyof VenueFilters] !== ''
  );

  const currentPageInfo = {
    current: currentPage,
    total: totalPages,
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: VenueFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Load venues
  const loadVenues = useCallback(
    async (venueFilters?: VenueFilters, page = 1, limit = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await venuesApiService.getVenues({
          filters: venueFilters || filters,
          pagination: { limit, page },
        });

        if (response.success) {
          setVenues(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || 'Error al cargar venues');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Create venue
  const createVenue = useCallback(
    async (venueData: VenueCreateData): Promise<Venue | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await venuesApiService.createVenue(venueData);

        if (response.success) {
          // Reload venues to get updated list
          await loadVenues();
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear venue');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadVenues]
  );

  // Update venue
  const updateVenue = useCallback(async (venueData: VenueUpdateData): Promise<Venue | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await venuesApiService.updateVenue(venueData);

      if (response.success) {
        // Update local state
        setVenues((prev) =>
          prev.map((venue) => (venue.id === venueData.id ? response.data : venue))
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar venue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete venue
  const deleteVenue = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await venuesApiService.deleteVenue(id);

      if (response.success) {
        // Update local state
        setVenues((prev) => prev.filter((venue) => venue.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Error al eliminar venue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle venue status
  const toggleVenueStatus = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Find current venue to toggle its status
        const currentVenue = venues.find((v) => v.id === id);
        if (!currentVenue) {
          throw new Error('Venue no encontrado');
        }

        const response = await venuesApiService.toggleVenueStatus(id, !currentVenue.isActive);

        if (response.success) {
          // Update local state
          setVenues((prev) =>
            prev.map((venue) => (venue.id === id ? { ...venue, isActive: !venue.isActive } : venue))
          );
          return true;
        } else {
          throw new Error(response.message || 'Error al cambiar estado del venue');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [venues]
  );

  // Go to next page
  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      await loadVenues(filters, currentPage + 1, pagination.limit);
    }
  }, [hasNextPage, loadVenues, filters, currentPage, pagination.limit]);

  // Go to previous page
  const goToPreviousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await loadVenues(filters, currentPage - 1, pagination.limit);
    }
  }, [hasPreviousPage, loadVenues, filters, currentPage, pagination.limit]);

  return {
    clearError,

    clearFilters,

    createVenue,

    currentPage,

    // Computed values
    currentPageInfo,

    deleteVenue,

    error,

    filters,

    goToNextPage,

    goToPreviousPage,

    hasActiveFilters,
    hasNextPage,

    hasPreviousPage,

    hasVenues,

    isLoading,

    // Actions
    loadVenues,

    pagination,

    setFilters,

    toggleVenueStatus,

    totalPages,

    totalVenues,

    updateVenue,
    // State
    venues,
  };
}
