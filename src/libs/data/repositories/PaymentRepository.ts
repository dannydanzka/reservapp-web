/**
 * Stub PaymentRepository for MVP build
 * Temporarily disabled due to Prisma model field mismatches
 */

import { Decimal } from '@prisma/client/runtime/library';

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Payment {
  id: string;
  amount: Decimal;
  currency: string;
  status: string;
  metadata?: any;
  stripePaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  reservationId: string;
  userId: string;
}

export interface PaymentWithDetails extends Payment {
  method?: string;
  metadata?: any;
  stripePaymentId?: string;
  reservation: {
    id: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    totalAmount?: number;
    service?: {
      name?: string;
      venue?: {
        name?: string;
      };
    };
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface CreatePaymentData {
  reservationId: string;
  userId: string;
  amount: number;
  currency?: string;
  method?: PaymentMethod;
  metadata?: any;
  stripePaymentIntentId?: string;
}

export interface UpdatePaymentData {
  amount?: number;
  status?: string;
  metadata?: any;
  paidAt?: Date;
  refundedAt?: Date;
  stripePaymentMethodId?: string;
}

export interface PaymentFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  totalAmount: number;
}

class PaymentRepository {
  async create(data: CreatePaymentData): Promise<Payment> {
    // Stub implementation
    return {
      amount: new Decimal(data.amount || 0),
      createdAt: new Date(),
      currency: data.currency || 'USD',
      id: 'stub-payment-id',
      reservationId: data.reservationId,
      status: 'PENDING',
      updatedAt: new Date(),
      userId: data.userId,
    };
  }

  async findById(id: string): Promise<Payment | null> {
    return null; // Stub implementation
  }

  async findByIdWithDetails(id: string): Promise<PaymentWithDetails | null> {
    return null; // Stub implementation
  }

  async findMany(
    filters: PaymentFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ payments: PaymentWithDetails[]; total: number }> {
    return { payments: [], total: 0 }; // Stub implementation
  }

  async findByReservation(reservationId: string): Promise<Payment[]> {
    return []; // Stub implementation
  }

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    return null; // Stub implementation
  }

  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    throw new Error('Payment update not implemented in stub version');
  }

  async markAsCompleted(id: string, transactionId?: string): Promise<Payment> {
    throw new Error('Payment completion not implemented in stub version');
  }

  async markAsRefunded(id: string): Promise<Payment> {
    throw new Error('Payment refund not implemented in stub version');
  }

  async getStats(filters: PaymentFilters = {}): Promise<PaymentStats> {
    return {
      completed: 0,
      pending: 0,
      total: 0,
      totalAmount: 0,
    };
  }

  async delete(id: string): Promise<Payment> {
    throw new Error('Payment deletion not implemented in stub version');
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null> {
    return null; // Stub implementation
  }
}

export const paymentRepository = new PaymentRepository();
