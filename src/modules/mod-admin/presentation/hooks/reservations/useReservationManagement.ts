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
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchReservations: (filters?: ReservationFilters) => Promise<void>;
  fetchReservationById: (id: string) => Promise<Reservation | null>;
  createReservation: (reservationData: Partial<Reservation>) => Promise<Reservation | null>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<boolean>;
  updateReservationStatus: (id: string, status: ReservationStatus) => Promise<boolean>;
  cancelReservation: (id: string, reason?: string) => Promise<boolean>;
  confirmReservation: (id: string) => Promise<boolean>;
  rescheduleReservation: (id: string, newDateTime: Date) => Promise<boolean>;

  // Filters & Pagination
  setFilters: (filters: ReservationFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
}

export const useReservationManagement = (): UseReservationManagementReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
  });

  const fetchReservations = useCallback(
    async (newFilters?: ReservationFilters) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());

        const activeFilters = newFilters || filters;

        if (activeFilters?.status) {
          queryParams.append('status', activeFilters?.status);
        }

        if (activeFilters.dateFrom) {
          queryParams.append('dateFrom', activeFilters.dateFrom.toISOString());
        }

        if (activeFilters.dateTo) {
          queryParams.append('dateTo', activeFilters.dateTo.toISOString());
        }

        if (activeFilters.businessId) {
          queryParams.append('businessId', activeFilters.businessId);
        }

        if (activeFilters.serviceId) {
          queryParams.append('serviceId', activeFilters.serviceId);
        }

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        if (activeFilters.venueId) {
          queryParams.append('venueId', activeFilters.venueId);
        }

        const response = await fetch(`/api/admin/reservations?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();

        setReservations(data.reservations);
        setPagination(data.pagination);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchReservationById = useCallback(async (id: string): Promise<Reservation | null> => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/reservations/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reservation');
      }

      const data = await response.json();
      return data.reservation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservation');
      return null;
    }
  }, []);

  const createReservation = useCallback(
    async (reservationData: Partial<Reservation>): Promise<Reservation | null> => {
      try {
        setError(null);

        const response = await fetch('/api/admin/reservations', {
          body: JSON.stringify(reservationData),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to create reservation');
        }

        const data = await response.json();
        const newReservation = data.reservation;

        // Add to local state
        setReservations((prev) => [newReservation, ...prev]);

        return newReservation;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create reservation');
        return null;
      }
    },
    []
  );

  const updateReservation = useCallback(
    async (id: string, updates: Partial<Reservation>): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/admin/reservations/${id}`, {
          body: JSON.stringify(updates),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update reservation');
        }

        const data = await response.json();
        const updatedReservation = data.reservation;

        // Update local state
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id ? updatedReservation : reservation
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reservation');
        return false;
      }
    },
    []
  );

  const updateReservationStatus = useCallback(
    async (id: string, status: ReservationStatus): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/admin/reservations/${id}/status`, {
          body: JSON.stringify({ status }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update reservation status');
        }

        // Update local state
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id ? { ...reservation, status } : reservation
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reservation status');
        return false;
      }
    },
    []
  );

  const cancelReservation = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/reservations/${id}/cancel`, {
        body: JSON.stringify({ reason }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      // Update local state
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: ReservationStatus.CANCELLED }
            : reservation
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
      return false;
    }
  }, []);

  const confirmReservation = useCallback(
    async (id: string): Promise<boolean> => {
      return updateReservationStatus(id, ReservationStatus.CONFIRMED);
    },
    [updateReservationStatus]
  );

  const rescheduleReservation = useCallback(
    async (id: string, newDateTime: Date): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/admin/reservations/${id}/reschedule`, {
          body: JSON.stringify({
            dateTime: newDateTime.toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to reschedule reservation');
        }

        const data = await response.json();
        const updatedReservation = data.reservation;

        // Update local state
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id ? updatedReservation : reservation
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reschedule reservation');
        return false;
      }
    },
    []
  );

  const handleSetFilters = useCallback((newFilters: ReservationFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSetPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleSetLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Load reservations on mount and when filters/pagination change
  useEffect(() => {
    fetchReservations();
  }, [filters, pagination.page, pagination.limit]);

  return {
    cancelReservation,
    clearFilters,
    confirmReservation,
    createReservation,
    error,
    fetchReservationById,
    fetchReservations,
    filters,
    loading,
    pagination,
    rescheduleReservation,
    reservations,
    setFilters: handleSetFilters,
    setLimit: handleSetLimit,
    setPage: handleSetPage,
    stats,
    updateReservation,
    updateReservationStatus,
  };
};
