/**
 * Payment Management Hook - Presentation Layer
 * Handles payment operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import {
  AdminPaymentFilters,
  AdminPaymentStats,
  AdminPaymentView,
  AdminVenueOption,
  PaymentStatus,
} from '@shared/types/admin.types';

export interface PaymentFilters {
  status?: PaymentStatus;
  venueId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  userId?: string;
  amount?: {
    min?: number;
    max?: number;
  };
}

export interface UsePaymentManagementReturn {
  payments: AdminPaymentView[];
  loading: boolean;
  error: string | null;
  stats: AdminPaymentStats | null;
  venues: AdminVenueOption[];
  filters: PaymentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };

  // Actions
  fetchPayments: (filters?: PaymentFilters) => Promise<void>;
  fetchPaymentStats: (filters?: PaymentFilters) => Promise<void>;
  fetchVenues: () => Promise<void>;
  processRefund: (paymentId: string, amount?: number, reason?: string) => Promise<void>;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus, notes?: string) => Promise<void>;
  exportPayments: (format: 'csv' | 'xlsx', filters?: PaymentFilters) => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: PaymentFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
  refresh: () => Promise<void>;
}

export const usePaymentManagement = (): UsePaymentManagementReturn => {
  const [payments, setPayments] = useState<AdminPaymentView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminPaymentStats | null>(null);
  const [venues, setVenues] = useState<AdminVenueOption[]>([]);
  const [filters, setFilters] = useState<PaymentFilters>({});
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

  const fetchPayments = useCallback(
    async (newFilters?: PaymentFilters) => {
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

        if (activeFilters.startDate) {
          queryParams.append('startDate', activeFilters.startDate);
        }

        if (activeFilters.endDate) {
          queryParams.append('endDate', activeFilters.endDate);
        }

        if (activeFilters.search) {
          queryParams.append('search', activeFilters.search);
        }

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        const response = await fetch(`/api/admin/payments?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('Payments API response:', data); // Debug log

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch payments');
        }

        setPayments(data.data || []);
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
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, getAuthToken]
  );

  const fetchPaymentStats = useCallback(
    async (statsFilters?: PaymentFilters) => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/payments', {
          body: JSON.stringify({
            action: 'getStats',
            filters: {
              endDate: statsFilters?.endDate,
              startDate: statsFilters?.startDate,
              venue: statsFilters?.venueId,
            },
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch payment stats');
        }

        setStats(data.data);
      } catch (err) {
        console.error('Error fetching payment stats:', err);
      }
    },
    [getAuthToken]
  );

  const fetchVenues = useCallback(async () => {
    try {
      setError(null);

      const token = getAuthToken();

      const response = await fetch('/api/admin/payments/actions', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch venues: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch venues');
      }

      setVenues(data.data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  }, [getAuthToken]);

  const processRefund = useCallback(
    async (paymentId: string, amount?: number, reason?: string) => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/payments/actions', {
          body: JSON.stringify({
            action: 'refund',
            amount,
            paymentId,
            reason,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to process refund: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to process refund');
        }

        // Refresh payments after successful refund
        await fetchPayments();
        await fetchPaymentStats();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process refund');
        throw err;
      }
    },
    [getAuthToken, fetchPayments, fetchPaymentStats]
  );

  const updatePaymentStatus = useCallback(
    async (paymentId: string, status: PaymentStatus, notes?: string) => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/payments/actions', {
          body: JSON.stringify({
            action: 'updateStatus',
            notes,
            paymentId,
            status,
            verificationMethod: 'manual',
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
            errorData.message || `Failed to update payment status: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to update payment status');
        }

        // Refresh payments after successful update
        await fetchPayments();
        await fetchPaymentStats();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update payment status');
        throw err;
      }
    },
    [getAuthToken, fetchPayments, fetchPaymentStats]
  );

  const exportPayments = useCallback(
    async (format: 'csv' | 'xlsx', exportFilters?: PaymentFilters) => {
      try {
        setError(null);

        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        const activeFilters = exportFilters || filters;

        if (activeFilters.status) {
          queryParams.append('status', activeFilters.status);
        }

        if (activeFilters.venueId) {
          queryParams.append('venueId', activeFilters.venueId);
        }

        if (activeFilters.startDate) {
          queryParams.append('startDate', activeFilters.startDate);
        }

        if (activeFilters.endDate) {
          queryParams.append('endDate', activeFilters.endDate);
        }

        if (activeFilters.search) {
          queryParams.append('search', activeFilters.search);
        }

        // Get all payments without pagination for export
        const response = await fetch(`/api/admin/payments?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to export payments: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to export payments');
        }

        // Create and download file
        const filename = `payments_export_${new Date().toISOString().split('T')[0]}.${format}`;

        if (format === 'csv') {
          downloadCSV(data.data, filename);
        } else {
          console.log('XLSX export not implemented yet');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export payments');
      }
    },
    [getAuthToken, filters]
  );

  // CSV download helper
  const downloadCSV = (data: AdminPaymentView[], filename: string) => {
    const headers = [
      'ID',
      'Amount',
      'Currency',
      'Status',
      'User Name',
      'User Email',
      'Venue Name',
      'Service Name',
      'Reservation ID',
      'Created At',
      'Payment Method',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((payment) =>
        [
          payment.id,
          payment.amount,
          payment.currency,
          payment?.status,
          payment.user?.fullName ||
            `${payment.user?.firstName || ''} ${payment.user?.lastName || ''}`,
          payment.user?.email,
          payment.venue?.name,
          payment.service?.name,
          payment.reservation?.id,
          payment.createdAt,
          payment.paymentMethod
            ? `${payment.paymentMethod.brand || payment.paymentMethod.type} ****${payment.paymentMethod.last4 || ''}`
            : '',
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refresh = useCallback(async () => {
    await Promise.all([fetchPayments(), fetchPaymentStats()]);
  }, [fetchPayments, fetchPaymentStats]);

  const setFiltersAndFetch = useCallback(
    (newFilters: PaymentFilters) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
      fetchPayments(newFilters);
      fetchPaymentStats(newFilters);
    },
    [fetchPayments, fetchPaymentStats]
  );

  const setPageAndFetch = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchPayments();
    },
    [fetchPayments]
  );

  const setLimitAndFetch = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page
      fetchPayments();
    },
    [fetchPayments]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPayments({});
    fetchPaymentStats({});
  }, [fetchPayments, fetchPaymentStats]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial payment data...'); // Debug log
      try {
        await fetchPayments({});
        await fetchPaymentStats({});
        await fetchVenues();
        console.log('Initial payment data loaded successfully'); // Debug log
      } catch (error) {
        console.error('Error loading initial payment data:', error);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array to load only once

  return {
    clearFilters,

    error,

    exportPayments,

    fetchPaymentStats,

    // Actions
    fetchPayments,

    fetchVenues,

    filters,

    loading,

    pagination,
    // State
    payments,
    processRefund,
    refresh,

    // Filters & Pagination
    setFilters: setFiltersAndFetch,

    setLimit: setLimitAndFetch,

    setPage: setPageAndFetch,
    stats,
    updatePaymentStatus,
    venues,
  };
};
