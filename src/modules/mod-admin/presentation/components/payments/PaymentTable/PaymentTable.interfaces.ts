import { AdminPaymentAction, AdminPaymentView, PaymentStatus } from '@shared/types/admin.types';

export interface PaymentTableProps {
  payments: AdminPaymentView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void;
  onRefund: (paymentId: string, amount?: number, reason?: string) => Promise<void>;
  onStatusUpdate: (paymentId: string, status: PaymentStatus, notes?: string) => Promise<void>;
  isRefreshing: boolean;
}

export interface PaymentTableState {
  selectedPayment: AdminPaymentView | null;
  actionType: 'refund' | 'status' | null;
  showActionModal: boolean;
  showMenu: string | null;
}

export interface PaymentTableHandlers {
  handleActionClick: (payment: AdminPaymentView, actionType: string) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleCloseModal: () => void;
}

export interface StatusConfig {
  label: string;
  color: 'primary' | 'secondary' | 'error';
  icon: React.ComponentType<{ className?: string }>;
}

export interface FormatFunctions {
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (dateString: string) => string;
}

export interface PaymentActionsFunctions {
  getPaymentActions: (payment: AdminPaymentView) => AdminPaymentAction[];
}
