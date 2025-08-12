/**
 * Reservations HTTP API Service
 * Replaces direct Prisma usage for reservation management
 */

import { handleRequest } from '../http/handleRequest';

export interface Reservation {
  id: string;
  venueId: string;
  serviceId: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  venue?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface ReservationFilters {
  status?: string;
  userId?: string;
  venueId?: string;
  serviceId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ReservationCreateData {
  venueId: string;
  serviceId: string;
  checkInDate: string;
  checkOutDate: string;
  guests?: number;
  totalAmount?: number;
  notes?: string;
}

export interface ReservationUpdateData
  extends Partial<Omit<ReservationCreateData, 'venueId' | 'serviceId'>> {
  id: string;
  status?: string;
}

export interface ReservationsResponse {
  success: boolean;
  data: Reservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ReservationResponse {
  success: boolean;
  data: Reservation;
  message?: string;
}

export class ReservationsApiService {
  private static readonly baseUrl = '/api/reservations';

  /**
   * Get reservations with filters and pagination
   */
  static async getReservations(
    params: {
      filters?: ReservationFilters;
      pagination?: PaginationParams;
    } = {}
  ): Promise<ReservationsResponse> {
    const { filters = {}, pagination = {} } = params;

    const queryParams = new URLSearchParams();

    // Add pagination
    if (pagination.page) queryParams.set('page', pagination.page.toString());
    if (pagination.limit) queryParams.set('limit', pagination.limit.toString());

    // Add filters
    if (filters.status) queryParams.set('status', filters.status);
    if (filters.userId) queryParams.set('userId', filters.userId);
    if (filters.venueId) queryParams.set('venueId', filters.venueId);
    if (filters.serviceId) queryParams.set('serviceId', filters.serviceId);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return await handleRequest({
      endpoint: url,
      method: 'GET',
    });
  }

  /**
   * Get reservation by ID
   */
  static async getReservationById(id: string): Promise<ReservationResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });
  }

  /**
   * Create new reservation
   */
  static async createReservation(
    reservationData: ReservationCreateData
  ): Promise<ReservationResponse> {
    return await handleRequest({
      body: reservationData,
      endpoint: this.baseUrl,
      method: 'POST',
    });
  }

  /**
   * Update reservation
   */
  static async updateReservation(
    reservationData: ReservationUpdateData
  ): Promise<ReservationResponse> {
    const { id, ...updateData } = reservationData;
    return await handleRequest({
      body: updateData,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PATCH',
    });
  }

  /**
   * Delete reservation
   */
  static async deleteReservation(id: string): Promise<ReservationResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  /**
   * Update reservation status
   */
  static async updateReservationStatus(id: string, status: string): Promise<ReservationResponse> {
    return await handleRequest({
      body: { status },
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PATCH',
    });
  }

  /**
   * Get reservation statistics (Admin only)
   */
  static async getReservationStats(): Promise<{
    success: boolean;
    data: {
      total: number;
      confirmed: number;
      pending: number;
      cancelled: number;
      completed: number;
      byStatus: Record<string, number>;
    };
  }> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/stats`,
      method: 'GET',
    });
  }
}

export const reservationsApiService = ReservationsApiService;
