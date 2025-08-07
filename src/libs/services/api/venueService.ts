import { handleRequest } from '@libs/services/http/handleRequest';
import { VenueType } from '@prisma/client';

export interface Venue {
  id: string;
  name: string;
  category: VenueType;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  amenities: string[];
  policies: Record<string, any>;
  businessHours: Record<string, any>;
  metadata: Record<string, any>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VenueWithServices extends Venue {
  services: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    capacity: number;
  }>;
  _count: {
    services: number;
    reservations: number;
  };
}

export interface VenueFilters {
  category?: VenueType;
  search?: string;
  city?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface VenueStats {
  totalServices: number;
  totalReservations: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
}

export interface CreateVenueData {
  name: string;
  category: VenueType;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  amenities?: string[];
  policies?: Record<string, any>;
  businessHours?: Record<string, any>;
  metadata?: Record<string, any>;
  active?: boolean;
}

export interface UpdateVenueData extends Partial<CreateVenueData> {}

class VenueService {
  private baseUrl = '/api/venues';

  async getAll(filters: VenueFilters = {}): Promise<VenueWithServices[]> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;

    const response = await handleRequest({
      endpoint: url,
      method: 'GET',
    });

    return response.data;
  }

  async getById(id: string): Promise<VenueWithServices> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });

    return response.data;
  }

  async create(data: CreateVenueData): Promise<Venue> {
    const response = await handleRequest({
      body: data,
      endpoint: this.baseUrl,
      method: 'POST',
    });

    return response.data;
  }

  async update(id: string, data: UpdateVenueData): Promise<Venue> {
    const response = await handleRequest({
      body: data,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });

    return response.data;
  }

  async delete(id: string): Promise<void> {
    await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  async getStats(id: string): Promise<VenueStats> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}/stats`,
      method: 'GET',
    });

    return response.data;
  }

  async getByCategory(category: VenueType): Promise<VenueWithServices[]> {
    return this.getAll({ category });
  }

  async searchNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    filters: VenueFilters = {}
  ): Promise<VenueWithServices[]> {
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radiusKm.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined)),
    });

    const response = await handleRequest({
      endpoint: `${this.baseUrl}/nearby?${queryParams.toString()}`,
      method: 'GET',
    });

    return response.data;
  }

  async searchByAddress(address: string): Promise<VenueWithServices[]> {
    return this.getAll({ search: address });
  }

  async getPopularVenues(limit: number = 10): Promise<VenueWithServices[]> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/popular?limit=${limit}`,
      method: 'GET',
    });

    return response.data;
  }

  async toggleStatus(id: string): Promise<Venue> {
    const venue = await this.getById(id);
    return this.update(id, { active: !venue.active });
  }
}

export const venueService = new VenueService();
