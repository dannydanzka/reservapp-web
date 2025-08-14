// Admin Payment Service - Real Implementation with API integration

import { ApiResponse } from '@libs/services/api/types/common.types';

// Types for admin payments
export interface AdminPaymentFilters {
  status?: string;
  venueId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminPaymentStats {
  totalRevenue: number;
  totalNetRevenue: number;
  totalPlatformFees: number;
  averageTransaction: number;
  monthlyGrowth: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  completedAmount: number;
  pendingAmount: number;
  failedAmount: number;
  refundedAmount: number;
  successRate: number;
  failureRate: number;
  refundRate: number;
  platformCommissionRate: number;
}

export interface AdminVenueOption {
  id: string;
  name: string;
  category?: string;
  city?: string;
  businessName?: string;
  businessType?: string;
}

export interface AdminPaymentView {
  id: string;
  stripePaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  transactionDate: Date | null;
  description: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  platformFee: number;
  netAmount: number;
  platformCommissionRate: number;
  user: {
    id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    stripeCustomerId: string | null;
  };
  business: {
    id: string;
    name: string;
    type: string;
    email: string;
    ownerName: string;
  } | null;
  venue: {
    id: string;
    name: string;
    category: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
  };
  reservation: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    guests: number;
    status: string;
  };
  receipt: any;
  stripeData: any;
  stripeCustomer: any;
}

export interface PaginatedAdminPayments {
  data: AdminPaymentView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface ProcessRefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentId: string;
  status: PaymentStatus;
  notes?: string;
  verificationMethod: 'manual' | 'automatic';
}

class AdminPaymentService {
  private readonly baseUrl = '/api/admin/payments';
  private readonly actionsUrl = '/api/admin/payments/actions';

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || 'Operation failed');
    }

    return data.data;
  }

  async getPayments(filters: AdminPaymentFilters): Promise<PaginatedAdminPayments> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.venueId) queryParams.append('venueId', filters.venueId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`, {
        headers: await this.getAuthHeaders(),
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al cargar pagos');
      }

      return {
        data: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getPaymentStats(
    filters?: Omit<AdminPaymentFilters, 'page' | 'limit'>
  ): Promise<AdminPaymentStats> {
    try {
      const response = await fetch(this.baseUrl, {
        body: JSON.stringify({
          action: 'getStats',
          filters: filters || {},
        }),
        headers: await this.getAuthHeaders(),
        method: 'POST',
      });

      return await this.handleResponse<AdminPaymentStats>(response);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  async getVenues(): Promise<AdminVenueOption[]> {
    try {
      const response = await fetch(this.actionsUrl, {
        headers: await this.getAuthHeaders(),
        method: 'GET',
      });

      return await this.handleResponse<AdminVenueOption[]>(response);
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  }

  async processRefund(request: ProcessRefundRequest): Promise<void> {
    try {
      const response = await fetch(this.actionsUrl, {
        body: JSON.stringify({
          action: 'refund',
          ...request,
        }),
        headers: await this.getAuthHeaders(),
        method: 'POST',
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async updatePaymentStatus(request: UpdatePaymentStatusRequest): Promise<void> {
    try {
      const response = await fetch(this.actionsUrl, {
        body: JSON.stringify({
          action: 'updateStatus',
          ...request,
        }),
        headers: await this.getAuthHeaders(),
        method: 'POST',
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async manualVerification(paymentId: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(this.actionsUrl, {
        body: JSON.stringify({
          action: 'manualVerification',
          notes,
          paymentId,
        }),
        headers: await this.getAuthHeaders(),
        method: 'POST',
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Error in manual verification:', error);
      throw error;
    }
  }
}

export const adminPaymentService = new AdminPaymentService();
