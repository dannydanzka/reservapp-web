/**
 * Public API service for unauthenticated endpoints
 * These endpoints don't require authentication and are used for public content
 */

import { ApiResponse } from '@/libs/types/api.types';
import { handleRequest } from '@/libs/services/http';

import { VenueWithServices } from './types/venue.types';

export interface PublicVenue {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string;
  city: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  services: Array<{
    id: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    currency: string;
    duration: number;
    capacity: number;
  }>;
  _count: {
    services: number;
  };
}

export interface PublicService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  currency: string;
  duration: number;
  capacity: number;
  amenities: string[];
  venue?: {
    id: string;
    name: string;
    category: string;
    address: string;
    city: string | null;
    rating: number | null;
  };
}

export interface PublicVenueFilters {
  category?: string;
  search?: string;
  city?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PublicServiceFilters {
  category?: string;
  venueId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  duration?: number;
}

/**
 * Public API service class for non-authenticated endpoints
 */
export class PublicApiService {
  /**
   * Get public venues without authentication
   */
  async getPublicVenues(filters?: PublicVenueFilters): Promise<ApiResponse<PublicVenue[]>> {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const endpoint = `/api/public/venues${params.toString() ? `?${params.toString()}` : ''}`;

    return await handleRequest({
      endpoint,
      method: 'GET',
      // No authentication headers needed for public API
    });
  }

  /**
   * Get public services without authentication
   */
  async getPublicServices(filters?: PublicServiceFilters): Promise<ApiResponse<PublicService[]>> {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.venueId) params.append('venueId', filters.venueId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.capacity) params.append('capacity', filters.capacity.toString());
    if (filters?.duration) params.append('duration', filters.duration.toString());

    const endpoint = `/api/public/services${params.toString() ? `?${params.toString()}` : ''}`;

    return await handleRequest({
      endpoint,
      method: 'GET',
      // No authentication headers needed for public API
    });
  }
}

// Export singleton instance
export const publicApiService = new PublicApiService();
