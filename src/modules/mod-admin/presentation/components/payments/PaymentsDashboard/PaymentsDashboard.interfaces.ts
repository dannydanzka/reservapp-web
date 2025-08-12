import { AdminPaymentStats, AdminPaymentView, PaymentStatus } from '@shared/types/admin.types';

import { AdminPaymentFilters, AdminVenueOption } from '../PaymentFilters/PaymentFilters.interfaces';

export interface PaymentsDashboardProps {
  className?: string;
}

export interface PaymentsDashboardState {
  payments: AdminPaymentView[];
  stats: AdminPaymentStats | null;
  venues: AdminVenueOption[];
  filters: AdminPaymentFilters;
  pagination: {
    hasMore: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export interface PaymentsDashboardHandlers {
  handleFiltersChange: (newFilters: AdminPaymentFilters) => void;
  handlePageChange: (page: number) => void;
  handleRefresh: () => Promise<void>;
  handleRefund: (paymentId: string, amount?: number, reason?: string) => Promise<void>;
  handleStatusUpdate: (paymentId: string, status: PaymentStatus, notes?: string) => Promise<void>;
  handleExport: (format: 'csv' | 'xlsx') => Promise<void>;
}

export interface CSVExportData {
  data: AdminPaymentView[];
  filename: string;
}

export interface ExportFilters extends Omit<AdminPaymentFilters, 'page' | 'limit'> {}
