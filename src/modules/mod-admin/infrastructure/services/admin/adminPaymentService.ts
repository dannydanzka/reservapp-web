import {
  AdminPaymentFilters,
  AdminPaymentStats,
  AdminPaymentView,
  AdminVenueOption,
  PaginatedAdminPayments,
} from '@shared/types/admin.types';
import { authFetch } from '@libs/infrastructure/services/core/http/authInterceptor';

class AdminPaymentService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  async getPayments(filters: any = {}): Promise<PaginatedAdminPayments> {
    const searchParams = new URLSearchParams();

    // Add filters to search params
    if (filters.venueId) searchParams.append('venueId', filters.venueId);
    if (filters?.status) searchParams.append('status', filters?.status);
    if (filters.startDate) searchParams.append('startDate', filters.startDate);
    if (filters.endDate) searchParams.append('endDate', filters.endDate);
    if (filters.userId) searchParams.append('userId', filters.userId);
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.page) searchParams.append('page', filters.page.toString());
    if (filters.limit) searchParams.append('limit', filters.limit.toString());

    const response = await authFetch(`${this.baseUrl}/admin/payments?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }

    return response.json();
  }

  async getPaymentStats(filters?: any): Promise<AdminPaymentStats> {
    const response = await authFetch(`${this.baseUrl}/admin/payments`, {
      body: JSON.stringify({
        action: 'getStats',
        filters: {
          endDate: filters?.endDate || filters?.dateTo,
          startDate: filters?.startDate || filters?.dateFrom,
          venue: filters?.venue || filters?.venueId,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getVenues(): Promise<AdminVenueOption[]> {
    const response = await authFetch(`${this.baseUrl}/admin/payments/actions`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data.venues || data;
  }

  async processRefund(data: any): Promise<AdminPaymentView> {
    const response = await authFetch(`${this.baseUrl}/admin/payments/actions`, {
      body: JSON.stringify({
        action: 'refund',
        amount: data.amount,
        paymentId: data.paymentId,
        reason: data.reason,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to process refund: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async updatePaymentStatus(data: any): Promise<AdminPaymentView> {
    const response = await authFetch(`${this.baseUrl}/admin/payments/actions`, {
      body: JSON.stringify({
        action: 'updateStatus',
        notes: data.notes,
        paymentId: data.paymentId,
        status: data?.status,
        verificationMethod: data.verificationMethod || 'manual',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update payment status: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getReservationsByPaymentStatus(
    paymentStatus: string,
    filters: AdminPaymentFilters = {}
  ): Promise<any[]> {
    const searchParams = new URLSearchParams();

    searchParams.append('paymentStatus', paymentStatus);
    if (filters.venueId) searchParams.append('venue', filters.venueId);
    if (filters.startDate) searchParams.append('dateFrom', filters.startDate);
    if (filters.endDate) searchParams.append('dateTo', filters.endDate);

    const response = await authFetch(
      `${this.baseUrl}/admin/reservations?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reservations || data.data || data;
  }

  async updateReservationStatus(
    reservationId: string,
    status: string,
    notes?: string
  ): Promise<any> {
    const response = await authFetch(`${this.baseUrl}/reservations/${reservationId}`, {
      body: JSON.stringify({
        adminUpdate: true,
        notes: notes || `Status updated by admin to ${status}`,
        status,
        timestamp: new Date().toISOString(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to update reservation status: ${response.statusText}`
      );
    }

    return response.json();
  }
}

export const adminPaymentService = new AdminPaymentService();
export default adminPaymentService;
