/**
 * Services HTTP API Service
 * Replaces direct Prisma usage in frontend components
 */

import { handleRequest } from '../http/handleRequest';

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  capacity: number;
  venueId: string;
  amenities: string[];
  images: string[];
  isActive: boolean;
  currency: string;
  createdAt: string;
  updatedAt: string;
  venue?: {
    id: string;
    name: string;
    category: string;
    address?: string;
    city?: string;
  };
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  venueId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ServiceCreateData {
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  capacity: number;
  venueId: string;
  amenities?: string[];
  images?: string[];
  isActive?: boolean;
}

export interface ServiceUpdateData extends Partial<ServiceCreateData> {
  id: string;
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
  message?: string;
}

export class ServicesApiService {
  private static readonly baseUrl = '/api/services';

  /**
   * Get services with filters and pagination
   */
  static async getServices(
    params: {
      filters?: ServiceFilters;
      pagination?: PaginationParams;
    } = {}
  ): Promise<ServicesResponse> {
    const { filters = {}, pagination = {} } = params;

    const queryParams = new URLSearchParams();

    // Add pagination
    if (pagination.page) queryParams.set('page', pagination.page.toString());
    if (pagination.limit) queryParams.set('limit', pagination.limit.toString());

    // Add filters
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());
    if (filters.venueId) queryParams.set('venueId', filters.venueId);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return await handleRequest({
      endpoint: url,
      method: 'GET',
    });
  }

  /**
   * Get service by ID
   */
  static async getServiceById(id: string): Promise<ServiceResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });
  }

  /**
   * Create new service
   */
  static async createService(serviceData: ServiceCreateData): Promise<ServiceResponse> {
    return await handleRequest({
      body: serviceData,
      endpoint: this.baseUrl,
      method: 'POST',
    });
  }

  /**
   * Update service
   */
  static async updateService(serviceData: ServiceUpdateData): Promise<ServiceResponse> {
    const { id, ...updateData } = serviceData;
    return await handleRequest({
      body: updateData,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });
  }

  /**
   * Delete service (soft delete)
   */
  static async deleteService(id: string): Promise<ServiceResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  /**
   * Toggle service status
   */
  static async toggleServiceStatus(id: string, isActive: boolean): Promise<ServiceResponse> {
    return await handleRequest({
      body: { isActive },
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });
  }
}

export const servicesApiService = ServicesApiService;
