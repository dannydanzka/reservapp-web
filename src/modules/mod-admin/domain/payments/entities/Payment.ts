/**
 * Payment Domain Entity
 * Represents payment data in the admin domain layer
 */

export interface Payment {
  id: string;
  stripePaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionDate?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  userId: string;
  reservationId?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentFilters {
  status?: PaymentStatus;
  dateRange?: { start: string; end: string };
  userId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentSummary {
  totalAmount: number;
  totalCount: number;
  statusBreakdown: Record<PaymentStatus, number>;
}
