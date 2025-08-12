/**
 * HTTP Public API Service for Client-Side Use
 * Makes HTTP requests to API endpoints instead of direct database access
 */

export interface PublicVenue {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  rating: number;
  category: string;
  latitude: number | null;
  longitude: number | null;
  phone?: string;
  services: {
    id: string;
    name: string;
    price: number;
    type: string;
  }[];
  _count: {
    services: number;
  };
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface ServiceFilters {
  category?: string;
  venueId?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

interface VenueFilters {
  category?: string;
  city?: string;
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class HttpPublicApiService {
  private static readonly BASE_URL = '/api/public';

  static async getPublicVenues(): Promise<PublicVenue[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/venues`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching public venues:', error);
      return [];
    }
  }

  static async getServices(filters: ServiceFilters = {}, pagination: PaginationOptions = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (pagination.page) queryParams.append('page', pagination.page.toString());
      if (pagination.limit) queryParams.append('limit', pagination.limit.toString());
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.venueId) queryParams.append('venueId', filters.venueId);
      if (filters.priceMin !== undefined)
        queryParams.append('priceMin', filters.priceMin.toString());
      if (filters.priceMax !== undefined)
        queryParams.append('priceMax', filters.priceMax.toString());
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/services?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();
      return data.data || { data: [], pagination: { limit: 10, page: 1, pages: 0, total: 0 } };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { data: [], pagination: { limit: 10, page: 1, pages: 0, total: 0 } };
    }
  }

  static async getVenues(filters: VenueFilters = {}, pagination: PaginationOptions = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (pagination.page) queryParams.append('page', pagination.page.toString());
      if (pagination.limit) queryParams.append('limit', pagination.limit.toString());
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/venues?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();
      return data.data || { data: [], pagination: { limit: 10, page: 1, pages: 0, total: 0 } };
    } catch (error) {
      console.error('Error fetching venues:', error);
      return { data: [], pagination: { limit: 10, page: 1, pages: 0, total: 0 } };
    }
  }

  static async getPopularVenues(limit = 6): Promise<PublicVenue[]> {
    try {
      const response = await fetch(`/api/venues/popular?limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching popular venues:', error);
      return [];
    }
  }

  static async getServiceById(serviceId: string) {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }

  static async getVenueById(venueId: string) {
    try {
      const response = await fetch(`/api/venues/${venueId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching venue:', error);
      return null;
    }
  }
}

export const httpPublicApiService = HttpPublicApiService;
