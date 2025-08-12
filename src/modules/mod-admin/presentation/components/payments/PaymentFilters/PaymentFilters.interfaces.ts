// Import PaymentStatus from shared types
import type { PaymentStatus } from '@shared/types/admin.types';

// Local interface that extends shared AdminPaymentFilters with additional properties needed by the filters component
export interface AdminPaymentFilters {
  status?: PaymentStatus;
  venue?: string;
  venueId?: string;
  dateRange?: { start: string; end: string };
  dateFrom?: string;
  dateTo?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  amount?: { min?: number; max?: number };
  limit?: number;
  page?: number;
  search?: string;
  searchTerm?: string;
  userId?: string;
}

export interface AdminVenueOption {
  value: string;
  label: string;
}

export interface PaymentFiltersProps {
  filters: AdminPaymentFilters;
  venues: AdminVenueOption[];
  onFiltersChange: (filters: AdminPaymentFilters) => void;
}

export interface PaymentFiltersState {
  isExpanded: boolean;
  localFilters: AdminPaymentFilters;
}

export interface PaymentFiltersHandlers {
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  updateFilter: <K extends keyof AdminPaymentFilters>(
    key: K,
    value: AdminPaymentFilters[K]
  ) => void;
  toggleExpanded: () => void;
}

export interface FilterField {
  key: keyof AdminPaymentFilters;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StatusLabels {
  pending: string;
  processing: string;
  completed: string;
  failed: string;
  cancelled: string;
  refunded: string;
  partially_refunded: string;
}

export interface FilterValidation {
  hasActiveFilters: boolean;
  isValidDateRange: boolean;
  isValidAmountRange: boolean;
}

export const PAYMENT_STATUSES: PaymentStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded',
];

export const STATUS_LABELS: StatusLabels = {
  cancelled: 'Cancelado',
  completed: 'Completado',
  failed: 'Fallido',
  partially_refunded: 'Parcialmente Reembolsado',
  pending: 'Pendiente',
  processing: 'Procesando',
  refunded: 'Reembolsado',
};
