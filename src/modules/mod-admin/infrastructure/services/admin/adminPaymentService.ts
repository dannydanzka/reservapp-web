import {
  AdminPaymentFilters,
  AdminPaymentStats,
  AdminPaymentView,
  AdminVenueOption,
  PaginatedAdminPayments,
} from '@shared/types/admin.types';

class AdminPaymentService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  async getPayments(filters: any = {}): Promise<PaginatedAdminPayments> {
    const searchParams = new URLSearchParams();

    // Add filters to search params
    if (filters.venueId) searchParams.append('venue', filters.venueId);
    if (filters?.status) searchParams.append('status', filters?.status);
    if (filters.startDate) searchParams.append('dateFrom', filters.startDate);
    if (filters.endDate) searchParams.append('dateTo', filters.endDate);
    if (filters.userId) searchParams.append('userId', filters.userId);
    if (filters.amount?.min) searchParams.append('minAmount', filters.amount.min.toString());
    if (filters.amount?.max) searchParams.append('maxAmount', filters.amount.max.toString());
    if (filters.page) searchParams.append('page', filters.page.toString());
    if (filters.limit) searchParams.append('limit', filters.limit.toString());

    // Add admin flag for detailed information
    searchParams.append('includeDetails', 'true');
    searchParams.append('admin', 'true');

    const response = await fetch(`${this.baseUrl}/payments?${searchParams.toString()}`, {
      credentials: 'include',
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
    const searchParams = new URLSearchParams();

    if (filters?.venue) searchParams.append('venue', filters.venue);
    if (filters?.dateFrom) searchParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) searchParams.append('dateTo', filters.dateTo);

    const response = await fetch(`${this.baseUrl}/payments/stats?${searchParams.toString()}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
    }

    return response.json();
  }

  async getVenues(): Promise<AdminVenueOption[]> {
    const response = await fetch(`${this.baseUrl}/admin/venues`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }

    const data = await response.json();
    return data.venues || data;
  }

  async processRefund(data: any): Promise<AdminPaymentView> {
    const response = await fetch(`${this.baseUrl}/payments/${data.paymentId}/refund`, {
      body: JSON.stringify({
        amount: data.amount,
        metadata: {
          ...data.metadata,
          adminRefund: true,
          timestamp: new Date().toISOString(),
        },
        reason: data.reason,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to process refund: ${response.statusText}`);
    }

    return response.json();
  }

  async updatePaymentStatus(data: any): Promise<AdminPaymentView> {
    const response = await fetch(`${this.baseUrl}/payments/${data.paymentId}`, {
      body: JSON.stringify({
        metadata: {
          adminUpdate: true,
          notes: data.notes,
          timestamp: new Date().toISOString(),
          verificationMethod: data.verificationMethod || 'manual',
        },
        status: data?.status,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update payment status: ${response.statusText}`);
    }

    return response.json();
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

    const response = await fetch(`${this.baseUrl}/admin/reservations?${searchParams.toString()}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    const response = await fetch(`${this.baseUrl}/reservations/${reservationId}`, {
      body: JSON.stringify({
        adminUpdate: true,
        notes: notes || `Status updated by admin to ${status}`,
        status,
        timestamp: new Date().toISOString(),
      }),
      credentials: 'include',
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
