/**
 * Venues HTTP API Service
 * Replaces direct Prisma usage for venue management
 */

import { handleRequest } from '../http/handleRequest';

export interface Venue {
  id: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface VenueFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface VenueCreateData {
  name: string;
  description?: string;
  category: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface VenueUpdateData extends Partial<VenueCreateData> {
  id: string;
}

export interface VenuesResponse {
  success: boolean;
  data: Venue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface VenueResponse {
  success: boolean;
  data: Venue;
  message?: string;
}

export class VenuesApiService {
  private static readonly baseUrl = '/api/venues';

  /**
   * Get venues with filters and pagination
   */
  static async getVenues(
    params: {
      filters?: VenueFilters;
      pagination?: PaginationParams;
    } = {}
  ): Promise<VenuesResponse> {
    const { filters = {}, pagination = {} } = params;

    const queryParams = new URLSearchParams();

    // Add pagination
    if (pagination.page) queryParams.set('page', pagination.page.toString());
    if (pagination.limit) queryParams.set('limit', pagination.limit.toString());

    // Add filters
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return await handleRequest({
      endpoint: url,
      method: 'GET',
    });
  }

  /**
   * Get venue by ID
   */
  static async getVenueById(id: string): Promise<VenueResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });
  }

  /**
   * Create new venue (Admin only)
   */
  static async createVenue(venueData: VenueCreateData): Promise<VenueResponse> {
    return await handleRequest({
      body: venueData,
      endpoint: this.baseUrl,
      method: 'POST',
    });
  }

  /**
   * Update venue (Admin only)
   */
  static async updateVenue(venueData: VenueUpdateData): Promise<VenueResponse> {
    const { id, ...updateData } = venueData;
    return await handleRequest({
      body: updateData,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PATCH',
    });
  }

  /**
   * Delete venue (Admin only)
   */
  static async deleteVenue(id: string): Promise<VenueResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  /**
   * Toggle venue status (Admin only)
   */
  static async toggleVenueStatus(id: string, isActive: boolean): Promise<VenueResponse> {
    return await handleRequest({
      body: { isActive },
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PATCH',
    });
  }

  /**
   * Get venue statistics (Admin only)
   */
  static async getVenueStats(): Promise<{
    success: boolean;
    data: {
      total: number;
      active: number;
      inactive: number;
      byCategory: Record<string, number>;
    };
  }> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/stats`,
      method: 'GET',
    });
  }
}

export const venuesApiService = VenuesApiService;
