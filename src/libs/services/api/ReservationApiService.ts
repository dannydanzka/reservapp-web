/**
 * Reservation HTTP API Service
 * Handles all reservation-related API communications
 * Uses only HTTP calls - NO direct Prisma usage
 */

import { ApiService } from './base/ApiService';
import {
  CreateReservationData,
  PaginatedResponse,
  PaginationParams,
  Reservation,
  ReservationAvailability,
  ReservationFilters,
  ReservationStats,
  ReservationWithDetails,
  TimeSlotAvailability,
  UpdateReservationData,
} from './types/reservation.types';

export class ReservationApiService extends ApiService {
  constructor() {
    super('/api/reservations');
  }

  /**
   * Get all reservations with optional filters and pagination
   */
  async getReservations(
    filters?: ReservationFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await this.get<PaginatedResponse<ReservationWithDetails>>('', params);
    return this.handleResponse(response);
  }

  /**
   * Get a single reservation by ID
   */
  async getReservationById(id: string): Promise<ReservationWithDetails | null> {
    const response = await this.get<ReservationWithDetails>(`/${id}`);
    return this.handleOptionalResponse(response);
  }

  /**
   * Get current user's reservations
   */
  async getMyReservations(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ReservationWithDetails>> {
    const response = await this.get<PaginatedResponse<ReservationWithDetails>>(
      '/my-reservations',
      pagination
    );
    return this.handleResponse(response);
  }

  /**
   * Create a new reservation
   */
  async createReservation(data: CreateReservationData): Promise<Reservation> {
    const response = await this.post<Reservation>('', data);
    return this.handleResponse(response);
  }

  /**
   * Update an existing reservation
   */
  async updateReservation(id: string, data: Partial<UpdateReservationData>): Promise<Reservation> {
    const response = await this.put<Reservation>(`/${id}`, data);
    return this.handleResponse(response);
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(id: string, reason?: string): Promise<Reservation> {
    const response = await this.patch<Reservation>(`/${id}/cancel`, { reason });
    return this.handleResponse(response);
  }

  /**
   * Confirm a reservation
   */
  async confirmReservation(id: string): Promise<Reservation> {
    const response = await this.patch<Reservation>(`/${id}/confirm`);
    return this.handleResponse(response);
  }

  /**
   * Mark reservation as completed
   */
  async completeReservation(id: string): Promise<Reservation> {
    const response = await this.patch<Reservation>(`/${id}/complete`);
    return this.handleResponse(response);
  }

  /**
   * Mark reservation as no-show
   */
  async markAsNoShow(id: string): Promise<Reservation> {
    const response = await this.patch<Reservation>(`/${id}/no-show`);
    return this.handleResponse(response);
  }

  /**
   * Delete a reservation
   */
  async deleteReservation(id: string): Promise<void> {
    const response = await this.delete<void>(`/${id}`);
    this.handleResponse(response);
  }

  /**
   * Get reservation statistics
   */
  async getReservationStats(startDate?: string, endDate?: string): Promise<ReservationStats> {
    const params = { endDate, startDate };
    const response = await this.get<ReservationStats>('/stats', params);
    return this.handleResponse(response);
  }

  /**
   * Check availability for a service
   */
  async checkAvailability(
    serviceId: string,
    startDate: string,
    endDate: string,
    guests?: number
  ): Promise<ReservationAvailability> {
    const params = { endDate, guests, serviceId, startDate };
    const response = await this.get<ReservationAvailability>('/availability', params);
    return this.handleResponse(response);
  }

  /**
   * Get available time slots for a service on a specific date
   */
  async getAvailableTimeSlots(serviceId: string, date: string): Promise<TimeSlotAvailability> {
    const params = { date, serviceId };
    const response = await this.get<TimeSlotAvailability>('/time-slots', params);
    return this.handleResponse(response);
  }

  /**
   * Get reservations by date range
   */
  async getReservationsByDateRange(
    startDate: string,
    endDate: string,
    venueId?: string
  ): Promise<ReservationWithDetails[]> {
    const params = { endDate, startDate, venueId };
    const response = await this.get<ReservationWithDetails[]>('/by-date-range', params);
    return this.handleResponse(response);
  }

  /**
   * Get upcoming reservations
   */
  async getUpcomingReservations(limit: number = 10): Promise<ReservationWithDetails[]> {
    const response = await this.get<ReservationWithDetails[]>('/upcoming', { limit });
    return this.handleResponse(response);
  }

  /**
   * Get reservations requiring attention (pending, etc.)
   */
  async getReservationsRequiringAttention(): Promise<ReservationWithDetails[]> {
    const response = await this.get<ReservationWithDetails[]>('/requiring-attention');
    return this.handleResponse(response);
  }

  /**
   * Search reservations by guest name or reservation ID
   */
  async searchReservations(query: string, limit: number = 10): Promise<ReservationWithDetails[]> {
    const params = { limit, q: query };
    const response = await this.get<ReservationWithDetails[]>('/search', params);
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const reservationApiService = new ReservationApiService();
