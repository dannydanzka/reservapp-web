import { handleRequest } from '@libs/services/http/handleRequest';
import { ReservationStatus } from '@prisma/client';

export interface Reservation {
  id: string;
  userId: string;
  serviceId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalAmount: number;
  status: ReservationStatus;
  specialRequests?: string;
  rating?: number;
  review?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationWithDetails extends Reservation {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    venue: {
      id: string;
      name: string;
      category: string;
      address: string;
    };
  };
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ReservationFilters {
  userId?: string;
  serviceId?: string;
  venueId?: string;
  status?: ReservationStatus;
  checkIn?: string;
  checkOut?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  checkedIn: number;
  checkedOut: number;
  cancelled: number;
  totalRevenue: number;
  averageStay: number;
}

export interface CreateReservationData {
  userId: string;
  serviceId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  specialRequests?: string;
  metadata?: Record<string, any>;
}

export interface UpdateReservationData {
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  status?: ReservationStatus;
  specialRequests?: string;
  rating?: number;
  review?: string;
  metadata?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  reservations: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ReservationService {
  private baseUrl = '/api/reservations';

  async getAll(
    filters: ReservationFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<Reservation>> {
    const queryParams = new URLSearchParams();

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    // Add pagination
    if (pagination.page) queryParams.append('page', pagination.page.toString());
    if (pagination.limit) queryParams.append('limit', pagination.limit.toString());

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;

    const response = await handleRequest({
      endpoint: url,
      method: 'GET',
    });

    return response.data;
  }

  async getAllWithDetails(
    filters: ReservationFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    const queryParams = new URLSearchParams();

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    // Add pagination
    if (pagination.page) queryParams.append('page', pagination.page.toString());
    if (pagination.limit) queryParams.append('limit', pagination.limit.toString());

    // Request details
    queryParams.append('includeDetails', 'true');

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await handleRequest({
      endpoint: url,
      method: 'GET',
    });

    return response.data;
  }

  async getById(id: string): Promise<Reservation> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });

    return response.data;
  }

  async getByIdWithDetails(id: string): Promise<ReservationWithDetails> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}?includeDetails=true`,
      method: 'GET',
    });

    return response.data;
  }

  async create(data: CreateReservationData): Promise<Reservation> {
    const response = await handleRequest({
      body: data,
      endpoint: this.baseUrl,
      method: 'POST',
    });

    return response.data;
  }

  async update(id: string, data: UpdateReservationData): Promise<Reservation> {
    const response = await handleRequest({
      body: data,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });

    return response.data;
  }

  async cancel(id: string): Promise<Reservation> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}/cancel`,
      method: 'PATCH',
    });

    return response.data;
  }

  async checkIn(id: string): Promise<Reservation> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}/check-in`,
      method: 'PATCH',
    });

    return response.data;
  }

  async checkOut(id: string): Promise<Reservation> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}/check-out`,
      method: 'PATCH',
    });

    return response.data;
  }

  async delete(id: string): Promise<void> {
    await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  async getStats(venueId?: string, dateFrom?: string, dateTo?: string): Promise<ReservationStats> {
    const queryParams = new URLSearchParams();

    if (venueId) queryParams.append('venueId', venueId);
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    const url = queryParams.toString()
      ? `${this.baseUrl}/stats?${queryParams.toString()}`
      : `${this.baseUrl}/stats`;

    const response = await handleRequest({
      endpoint: url,
      method: 'GET',
    });

    return response.data;
  }

  async getUpcomingCheckIns(venueId?: string, days: number = 7): Promise<ReservationWithDetails[]> {
    const queryParams = new URLSearchParams();

    if (venueId) queryParams.append('venueId', venueId);
    queryParams.append('days', days.toString());

    const response = await handleRequest({
      endpoint: `${this.baseUrl}/upcoming-checkins?${queryParams.toString()}`,
      method: 'GET',
    });

    return response.data;
  }

  async getUpcomingCheckOuts(
    venueId?: string,
    days: number = 7
  ): Promise<ReservationWithDetails[]> {
    const queryParams = new URLSearchParams();

    if (venueId) queryParams.append('venueId', venueId);
    queryParams.append('days', days.toString());

    const response = await handleRequest({
      endpoint: `${this.baseUrl}/upcoming-checkouts?${queryParams.toString()}`,
      method: 'GET',
    });

    return response.data;
  }

  async getUserReservations(
    userId: string,
    filters: Omit<ReservationFilters, 'userId'> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, userId }, pagination);
  }

  async getVenueReservations(
    venueId: string,
    filters: Omit<ReservationFilters, 'venueId'> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, venueId }, pagination);
  }

  async getServiceReservations(
    serviceId: string,
    filters: Omit<ReservationFilters, 'serviceId'> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, serviceId }, pagination);
  }

  async searchReservations(
    query: string,
    filters: ReservationFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, search: query }, pagination);
  }

  async getReservationsByStatus(
    status: ReservationStatus,
    filters: Omit<ReservationFilters, 'status'> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, status }, pagination);
  }

  async getReservationsByDateRange(
    dateFrom: string,
    dateTo: string,
    filters: Omit<ReservationFilters, 'dateFrom' | 'dateTo'> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    return this.getAllWithDetails({ ...filters, dateFrom, dateTo }, pagination);
  }

  async addReview(id: string, rating: number, review: string): Promise<Reservation> {
    return this.update(id, { rating, review });
  }
}

export const reservationService = new ReservationService();
