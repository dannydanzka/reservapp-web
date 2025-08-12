/**
 * Reservations Hook using HTTP API instead of Prisma direct
 * For reservation management in admin interface
 */

import { useCallback, useState } from 'react';

import {
  Reservation,
  ReservationCreateData,
  ReservationFilters,
  reservationsApiService,
  ReservationUpdateData,
} from '@services/core/api/reservationsApiService';

export interface UseReservationsReturn {
  // State
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  totalReservations: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hasReservations: boolean;
  hasActiveFilters: boolean;

  // Actions
  loadReservations: (filters?: ReservationFilters, page?: number, limit?: number) => Promise<void>;
  createReservation: (reservationData: ReservationCreateData) => Promise<Reservation | null>;
  updateReservation: (reservationData: ReservationUpdateData) => Promise<Reservation | null>;
  deleteReservation: (id: string) => Promise<boolean>;
  updateReservationStatus: (id: string, status: string) => Promise<boolean>;
  clearError: () => void;
  clearFilters: () => void;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  setFilters: (filters: ReservationFilters) => void;

  // Computed values
  currentPageInfo: {
    current: number;
    total: number;
  };
  filters: ReservationFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useReservations(): UseReservationsReturn {
  // State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ReservationFilters>({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    pages: 0,
    total: 0,
  });

  // Computed values
  const totalReservations = pagination.total;
  const currentPage = pagination.page;
  const totalPages = pagination.pages;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const hasReservations = reservations.length > 0;
  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof ReservationFilters] !== undefined &&
      filters[key as keyof ReservationFilters] !== null &&
      filters[key as keyof ReservationFilters] !== ''
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
  const setFilters = useCallback((newFilters: ReservationFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Load reservations
  const loadReservations = useCallback(
    async (reservationFilters?: ReservationFilters, page = 1, limit = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reservationsApiService.getReservations({
          filters: reservationFilters || filters,
          pagination: { limit, page },
        });

        if (response.success) {
          setReservations(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || 'Error al cargar reservaciones');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Create reservation
  const createReservation = useCallback(
    async (reservationData: ReservationCreateData): Promise<Reservation | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reservationsApiService.createReservation(reservationData);

        if (response.success) {
          // Reload reservations to get updated list
          await loadReservations();
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear reservación');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadReservations]
  );

  // Update reservation
  const updateReservation = useCallback(
    async (reservationData: ReservationUpdateData): Promise<Reservation | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reservationsApiService.updateReservation(reservationData);

        if (response.success) {
          // Update local state
          setReservations((prev) =>
            prev.map((reservation) =>
              reservation.id === reservationData.id ? response.data : reservation
            )
          );
          return response.data;
        } else {
          throw new Error(response.message || 'Error al actualizar reservación');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete reservation
  const deleteReservation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await reservationsApiService.deleteReservation(id);

      if (response.success) {
        // Update local state
        setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Error al eliminar reservación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update reservation status
  const updateReservationStatus = useCallback(
    async (id: string, status: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reservationsApiService.updateReservationStatus(id, status);

        if (response.success) {
          // Update local state
          setReservations((prev) =>
            prev.map((reservation) =>
              reservation.id === id ? { ...reservation, status } : reservation
            )
          );
          return true;
        } else {
          throw new Error(response.message || 'Error al cambiar estado de la reservación');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Go to next page
  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      await loadReservations(filters, currentPage + 1, pagination.limit);
    }
  }, [hasNextPage, loadReservations, filters, currentPage, pagination.limit]);

  // Go to previous page
  const goToPreviousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await loadReservations(filters, currentPage - 1, pagination.limit);
    }
  }, [hasPreviousPage, loadReservations, filters, currentPage, pagination.limit]);

  return {
    clearError,

    clearFilters,

    createReservation,

    currentPage,

    // Computed values
    currentPageInfo,

    deleteReservation,

    error,

    goToNextPage,

    filters,

    hasActiveFilters,

    goToPreviousPage,
    hasNextPage,

    hasPreviousPage,

    hasReservations,

    isLoading,

    // Actions
    loadReservations,

    pagination,

    // State
    reservations,

    setFilters,

    totalPages,

    totalReservations,
    updateReservation,
    updateReservationStatus,
  };
}
