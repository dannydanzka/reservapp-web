/**
 * Payment Management Hook - Presentation Layer
 * Handles payment operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import type { PaymentStatus } from '@shared/types/admin.types';

// Temporary Payment interface until domain entities are properly defined
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  businessId?: string;
  userId?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  refundedAmount: number;
}

export interface UsePaymentManagementReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  stats: PaymentStats | null;
  filters: PaymentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchPayments: (filters?: PaymentFilters) => Promise<void>;
  fetchPaymentById: (id: string) => Promise<Payment | null>;
  processRefund: (paymentId: string, amount?: number, reason?: string) => Promise<boolean>;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus) => Promise<boolean>;
  exportPayments: (format: 'csv' | 'excel', filters?: PaymentFilters) => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: PaymentFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
}

export const usePaymentManagement = (): UsePaymentManagementReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
  });

  const fetchPayments = useCallback(
    async (newFilters?: PaymentFilters) => {
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

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        const response = await fetch(`/api/admin/payments?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();

        setPayments(data.payments);
        setPagination(data.pagination);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchPaymentById = useCallback(async (id: string): Promise<Payment | null> => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/payments/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payment');
      }

      const data = await response.json();
      return data.payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment');
      return null;
    }
  }, []);

  const processRefund = useCallback(
    async (paymentId: string, amount?: number, reason?: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
          body: JSON.stringify({
            amount,
            reason,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to process refund');
        }

        // Refresh payments list
        await fetchPayments();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process refund');
        return false;
      }
    },
    [fetchPayments]
  );

  const updatePaymentStatus = useCallback(
    async (paymentId: string, status: PaymentStatus): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/admin/payments/${paymentId}/status`, {
          body: JSON.stringify({ status }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update payment status');
        }

        // Update local state
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === paymentId ? { ...payment, status } : payment
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update payment status');
        return false;
      }
    },
    []
  );

  const exportPayments = useCallback(
    async (format: 'csv' | 'excel', exportFilters?: PaymentFilters) => {
      try {
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('format', format);

        const activeFilters = exportFilters || filters;

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

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        const response = await fetch(`/api/admin/payments/export?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to export payments');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export payments');
      }
    },
    [filters]
  );

  const handleSetFilters = useCallback((newFilters: PaymentFilters) => {
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

  // Load payments on mount and when filters/pagination change
  useEffect(() => {
    fetchPayments();
  }, [filters, pagination.page, pagination.limit]);

  return {
    clearFilters,
    error,
    exportPayments,
    fetchPaymentById,
    fetchPayments,
    filters,
    loading,
    pagination,
    payments,
    processRefund,
    setFilters: handleSetFilters,
    setLimit: handleSetLimit,
    setPage: handleSetPage,
    stats,
    updatePaymentStatus,
  };
};
