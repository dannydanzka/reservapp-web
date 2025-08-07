/**
 * Venue HTTP API Service
 * Handles all venue-related API communications
 * Uses only HTTP calls - NO direct Prisma usage
 */

import { ApiService } from './base/ApiService';
import {
  CreateVenueData,
  PaginatedResponse,
  PaginationParams,
  UpdateVenueData,
  Venue,
  VenueFilters,
  VenueStats,
  VenueWithServices,
} from './types/venue.types';

export class VenueApiService extends ApiService {
  constructor() {
    super('/api/venues');
  }

  /**
   * Get all venues with optional filters and pagination
   */
  async getVenues(
    filters?: VenueFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<VenueWithServices>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await this.get<PaginatedResponse<VenueWithServices>>('', params);
    return this.handleResponse(response);
  }

  /**
   * Get a single venue by ID
   */
  async getVenueById(id: string): Promise<VenueWithServices | null> {
    const response = await this.get<VenueWithServices>(`/${id}`);
    return this.handleOptionalResponse(response);
  }

  /**
   * Create a new venue
   */
  async createVenue(data: CreateVenueData): Promise<Venue> {
    const response = await this.post<Venue>('', data);
    return this.handleResponse(response);
  }

  /**
   * Update an existing venue
   */
  async updateVenue(id: string, data: Partial<UpdateVenueData>): Promise<Venue> {
    const response = await this.put<Venue>(`/${id}`, data);
    return this.handleResponse(response);
  }

  /**
   * Delete a venue
   */
  async deleteVenue(id: string): Promise<void> {
    const response = await this.delete<void>(`/${id}`);
    this.handleResponse(response);
  }

  /**
   * Toggle venue active status
   */
  async toggleVenueStatus(id: string): Promise<Venue> {
    const response = await this.patch<Venue>(`/${id}/toggle-status`);
    return this.handleResponse(response);
  }

  /**
   * Get venue statistics
   */
  async getVenueStats(): Promise<VenueStats> {
    const response = await this.get<VenueStats>('/stats');
    return this.handleResponse(response);
  }

  /**
   * Search venues by location
   */
  async searchVenuesByLocation(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<VenueWithServices[]> {
    const params = {
      lat: latitude,
      lng: longitude,
      radius,
    };

    const response = await this.get<VenueWithServices[]>('/search/location', params);
    return this.handleResponse(response);
  }

  /**
   * Get popular venues
   */
  async getPopularVenues(limit: number = 10): Promise<VenueWithServices[]> {
    const response = await this.get<VenueWithServices[]>('/popular', { limit });
    return this.handleResponse(response);
  }

  /**
   * Get venues by category
   */
  async getVenuesByCategory(category: string): Promise<VenueWithServices[]> {
    const response = await this.get<VenueWithServices[]>(`/category/${category}`);
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const venueApiService = new VenueApiService();
