/**
 * Reservation Management Hook - Presentation Layer
 * Handles reservation operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import { Reservation, ReservationStatus } from '../../../domain/reservations/entities/Reservation';

export interface ReservationFilters {
  status?: ReservationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  businessId?: string;
  serviceId?: string;
  userId?: string;
  venueId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ReservationStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  completedReservations: number;
  totalRevenue: number;
  averageReservationValue: number;
}

export interface UseReservationManagementReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  stats: ReservationStats | null;
  filters: ReservationFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };

  // Actions
  fetchReservations: (filters?: ReservationFilters) => Promise<void>;
  fetchReservationById: (id: string) => Promise<Reservation | null>;
  fetchReservationStats: (filters?: ReservationFilters) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<boolean>;
  updateReservationStatus: (id: string, status: ReservationStatus) => Promise<boolean>;
  cancelReservation: (id: string, reason?: string) => Promise<boolean>;
  confirmReservation: (id: string) => Promise<boolean>;

  // Filters & Pagination
  setFilters: (filters: ReservationFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
  refresh: () => Promise<void>;
}

export const useReservationManagement = (): UseReservationManagementReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [pagination, setPagination] = useState({
    hasMore: false,
    limit: 20,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  /**
   * Get auth token from localStorage (same pattern as other modules)
   */
  const getAuthToken = useCallback((): string => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Remove quotes if present (localStorage sometimes stores with quotes)
    return token.replace(/^"(.*)"$/, '$1');
  }, []);

  const fetchReservations = useCallback(
    async (newFilters?: ReservationFilters) => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());

        const activeFilters = newFilters || filters;

        if (activeFilters.status) {
          queryParams.append('status', activeFilters.status);
        }

        if (activeFilters.venueId) {
          queryParams.append('venueId', activeFilters.venueId);
        }

        if (activeFilters.serviceId) {
          queryParams.append('serviceId', activeFilters.serviceId);
        }

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        if (activeFilters.businessId) {
          queryParams.append('businessId', activeFilters.businessId);
        }

        if (activeFilters.startDate || activeFilters.dateFrom) {
          const startDate = activeFilters.startDate || activeFilters.dateFrom?.toISOString();
          if (startDate) queryParams.append('startDate', startDate);
        }

        if (activeFilters.endDate || activeFilters.dateTo) {
          const endDate = activeFilters.endDate || activeFilters.dateTo?.toISOString();
          if (endDate) queryParams.append('endDate', endDate);
        }

        if (activeFilters.search) {
          queryParams.append('search', activeFilters.search);
        }

        const response = await fetch(`/api/reservations?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reservations: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('Reservations API response:', data); // Debug log

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch reservations');
        }

        setReservations(data.data || data.reservations || []);
        setPagination(
          data.pagination || {
            hasMore: false,
            limit: 20,
            page: 1,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, getAuthToken]
  );

  const fetchReservationStats = useCallback(
    async (statsFilters?: ReservationFilters) => {
      try {
        setError(null);

        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        queryParams.append('stats', 'true');

        const activeFilters = statsFilters || filters;

        if (activeFilters.status) {
          queryParams.append('status', activeFilters.status);
        }

        if (activeFilters.venueId) {
          queryParams.append('venueId', activeFilters.venueId);
        }

        if (activeFilters.startDate || activeFilters.dateFrom) {
          const startDate = activeFilters.startDate || activeFilters.dateFrom?.toISOString();
          if (startDate) queryParams.append('startDate', startDate);
        }

        if (activeFilters.endDate || activeFilters.dateTo) {
          const endDate = activeFilters.endDate || activeFilters.dateTo?.toISOString();
          if (endDate) queryParams.append('endDate', endDate);
        }

        const response = await fetch(`/api/reservations?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reservation stats: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching reservation stats:', err);
      }
    },
    [getAuthToken]
  );

  const fetchReservationById = useCallback(
    async (id: string): Promise<Reservation | null> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/reservations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reservation: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch reservation');
        }

        return data.data || data.reservation;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reservation');
        return null;
      }
    },
    [getAuthToken]
  );

  const updateReservationStatus = useCallback(
    async (id: string, status: ReservationStatus): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/reservations/${id}`, {
          body: JSON.stringify({
            adminUpdate: true,
            status,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to update reservation status: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to update reservation status');
        }

        // Refresh reservations after successful update
        await fetchReservations();
        await fetchReservationStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reservation status');
        return false;
      }
    },
    [getAuthToken, fetchReservations, fetchReservationStats]
  );

  const cancelReservation = useCallback(
    async (id: string, reason?: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/reservations/${id}/cancel`, {
          body: JSON.stringify({
            adminCancel: true,
            reason: reason || 'Cancelación administrativa',
            timestamp: new Date().toISOString(),
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to cancel reservation: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to cancel reservation');
        }

        // Refresh reservations after successful cancellation
        await fetchReservations();
        await fetchReservationStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
        return false;
      }
    },
    [getAuthToken, fetchReservations, fetchReservationStats]
  );

  const confirmReservation = useCallback(
    async (id: string): Promise<boolean> => {
      return updateReservationStatus(id, ReservationStatus.CONFIRMED);
    },
    [updateReservationStatus]
  );

  const updateReservation = useCallback(
    async (id: string, updates: Partial<Reservation>): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/reservations/${id}`, {
          body: JSON.stringify({
            ...updates,
            adminUpdate: true,
            timestamp: new Date().toISOString(),
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to update reservation: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to update reservation');
        }

        // Refresh reservations after successful update
        await fetchReservations();
        await fetchReservationStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reservation');
        return false;
      }
    },
    [getAuthToken, fetchReservations, fetchReservationStats]
  );

  const refresh = useCallback(async () => {
    await Promise.all([fetchReservations(), fetchReservationStats()]);
  }, [fetchReservations, fetchReservationStats]);

  const setFiltersAndFetch = useCallback(
    (newFilters: ReservationFilters) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
      fetchReservations(newFilters);
      fetchReservationStats(newFilters);
    },
    [fetchReservations, fetchReservationStats]
  );

  const setPageAndFetch = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchReservations();
    },
    [fetchReservations]
  );

  const setLimitAndFetch = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page
      fetchReservations();
    },
    [fetchReservations]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReservations({});
    fetchReservationStats({});
  }, [fetchReservations, fetchReservationStats]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial reservation data...'); // Debug log
      try {
        await fetchReservations({});
        await fetchReservationStats({});
        console.log('Initial reservation data loaded successfully'); // Debug log
      } catch (error) {
        console.error('Error loading initial reservation data:', error);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array to load only once

  return {
    error,

    fetchReservationById,

    fetchReservationStats,

    // Actions
    fetchReservations,

    cancelReservation,

    filters,

    confirmReservation,

    loading,

    pagination,

    clearFilters,
    // State
    reservations,

    refresh,

    // Filters & Pagination
    setFilters: setFiltersAndFetch,

    stats,
    setLimit: setLimitAndFetch,
    setPage: setPageAndFetch,
    updateReservation,
    updateReservationStatus,
  };
};
