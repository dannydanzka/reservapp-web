import { useCallback, useState } from 'react';

import { handleApiRequest } from '@shared/utils/handleApiRequest';
import { Reservation, ReservationStatus } from '@prisma/client';

interface ReservationFilters {
  userId?: string;
  serviceId?: string;
  venueId?: string;
  status?: ReservationStatus;
  checkInDate?: string;
  checkOutDate?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface CreateReservationData {
  userId: string;
  serviceId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  notes?: string;
}

interface UpdateReservationData {
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  totalAmount?: number;
  status?: ReservationStatus;
  notes?: string;
}

interface UseReservationServiceReturn {
  getReservations: (
    filters?: ReservationFilters,
    pagination?: PaginationOptions,
    includeDetails?: boolean
  ) => Promise<{
    reservations: Reservation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>;
  getReservationById: (id: string, includeDetails?: boolean) => Promise<Reservation | null>;
  createReservation: (reservationData: CreateReservationData) => Promise<Reservation | null>;
  updateReservation: (
    id: string,
    reservationData: UpdateReservationData
  ) => Promise<Reservation | null>;
  deleteReservation: (id: string) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<Reservation | null>;
  checkInReservation: (id: string) => Promise<Reservation | null>;
  checkOutReservation: (id: string) => Promise<Reservation | null>;
  isLoading: boolean;
  error: string | null;
}

const useReservationService = (): UseReservationServiceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReservations = useCallback(
    async (
      filters: ReservationFilters = {},
      pagination: PaginationOptions = {},
      includeDetails: boolean = false
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.userId) params.append('userId', filters.userId);
        if (filters.serviceId) params.append('serviceId', filters.serviceId);
        if (filters.venueId) params.append('venueId', filters.venueId);
        if (filters.status) params.append('status', filters.status);
        if (filters.checkInDate) params.append('checkInDate', filters.checkInDate);
        if (filters.checkOutDate) params.append('checkOutDate', filters.checkOutDate);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.search) params.append('search', filters.search);
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());
        if (includeDetails) params.append('includeDetails', 'true');

        const response = await handleApiRequest(`/api/reservations?${params.toString()}`, {
          method: 'GET',
        });

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || 'Failed to fetch reservations');
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reservations';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getReservationById = useCallback(async (id: string, includeDetails: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = includeDetails ? '?includeDetails=true' : '';

      const response = await handleApiRequest(`/api/reservations/${id}${params}`, {
        method: 'GET',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch reservation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reservation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (reservationData: CreateReservationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest('/api/reservations', {
        body: JSON.stringify(reservationData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to create reservation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservation = useCallback(
    async (id: string, reservationData: UpdateReservationData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest(`/api/reservations/${id}`, {
          body: JSON.stringify(reservationData),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        });

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || 'Failed to update reservation');
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update reservation';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest(`/api/reservations/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Failed to delete reservation');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reservation';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest(`/api/reservations/${id}/cancel`, {
        method: 'POST',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to cancel reservation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel reservation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkInReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest(`/api/reservations/${id}/checkin`, {
        method: 'POST',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to check in reservation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check in reservation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkOutReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest(`/api/reservations/${id}/checkout`, {
        method: 'POST',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to check out reservation');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check out reservation';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    createReservation,
    deleteReservation,
    error,
    getReservationById,
    getReservations,
    isLoading,
    updateReservation,
  };
};

export { useReservationService };
