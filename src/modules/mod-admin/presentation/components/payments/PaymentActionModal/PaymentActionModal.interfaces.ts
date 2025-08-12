import { AdminPaymentView, PaymentStatus } from '@shared/types/admin.types';

export interface PaymentActionModalProps {
  payment: AdminPaymentView;
  actionType: 'refund' | 'status';
  onRefund: (paymentId: string, amount?: number, reason?: string) => Promise<void>;
  onStatusUpdate: (paymentId: string, status: PaymentStatus, notes?: string) => Promise<void>;
  onClose: () => void;
}

export interface RefundFormData {
  amount: string;
  reason: string;
}

export interface StatusFormData {
  notes: string;
}
