import { handleRequest } from '@libs/services/http/handleRequest';
import { ServiceType } from '@prisma/client';

export interface Service {
  id: string;
  name: string;
  category: ServiceType;
  description?: string;
  price: number;
  currency: string;
  duration?: number;
  capacity: number;
  amenities: string[];
  policies: Record<string, any>;
  metadata: Record<string, any>;
  active: boolean;
  venueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWithVenue extends Service {
  venue: {
    id: string;
    name: string;
    category: string;
    address: string;
    rating: number | null;
  };
  _count: {
    reservations: number;
  };
}

export interface ServiceFilters {
  category?: ServiceType;
  venueId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  available?: boolean;
  duration?: number;
}

export interface ServiceStats {
  totalReservations: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  capacity: number;
  bookingRate: number;
}

export interface CreateServiceData {
  name: string;
  category: ServiceType;
  description?: string;
  price: number;
  currency?: string;
  duration?: number;
  capacity?: number;
  amenities?: string[];
  policies?: Record<string, any>;
  metadata?: Record<string, any>;
  active?: boolean;
  venueId: string;
}

export interface UpdateServiceData extends Partial<Omit<CreateServiceData, 'venueId'>> {}

export interface AvailabilityRequest {
  checkIn: string;
  checkOut: string;
  capacity?: number;
  category?: ServiceType;
  venueId?: string;
  minPrice?: number;
  maxPrice?: number;
}

class ServiceService {
  private baseUrl = '/api/services';

  async getAll(filters: ServiceFilters = {}): Promise<ServiceWithVenue[]> {
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

  async getById(id: string): Promise<ServiceWithVenue> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });

    return response.data;
  }

  async create(data: CreateServiceData): Promise<Service> {
    const response = await handleRequest({
      body: data,
      endpoint: this.baseUrl,
      method: 'POST',
    });

    return response.data;
  }

  async update(id: string, data: UpdateServiceData): Promise<Service> {
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

  async getByVenue(venueId: string): Promise<ServiceWithVenue[]> {
    return this.getAll({ venueId });
  }

  async getByCategory(category: ServiceType): Promise<ServiceWithVenue[]> {
    return this.getAll({ category });
  }

  async getAvailable(params: AvailabilityRequest): Promise<ServiceWithVenue[]> {
    const queryParams = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        },
        {} as Record<string, string>
      )
    );

    const response = await handleRequest({
      endpoint: `${this.baseUrl}/available?${queryParams.toString()}`,
      method: 'GET',
    });

    return response.data;
  }

  async checkAvailability(
    serviceId: string,
    checkIn: Date,
    checkOut: Date,
    capacity: number = 1
  ): Promise<boolean> {
    try {
      const service = await this.getById(serviceId);

      // Check if service is active
      if (!service.active) return false;

      // Check capacity
      if (service.capacity < capacity) return false;

      // For detailed availability, we would need to check against reservations
      // For now, we'll do a basic check via the available endpoint
      const availableServices = await this.getAvailable({
        capacity,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });

      return availableServices.some((s) => s.id === serviceId);
    } catch {
      return false;
    }
  }

  async getStats(id: string): Promise<ServiceStats> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/${id}/stats`,
      method: 'GET',
    });

    return response.data;
  }

  async getPopular(limit: number = 10): Promise<ServiceWithVenue[]> {
    const response = await handleRequest({
      endpoint: `${this.baseUrl}/popular?limit=${limit}`,
      method: 'GET',
    });

    return response.data;
  }

  async updatePricing(id: string, newPrice: number): Promise<Service> {
    return this.update(id, { price: newPrice });
  }

  async toggleAvailability(id: string): Promise<Service> {
    const service = await this.getById(id);
    return this.update(id, { active: !service.active });
  }

  async searchServices(query: string, filters: ServiceFilters = {}): Promise<ServiceWithVenue[]> {
    return this.getAll({
      ...filters,
      search: query,
    });
  }

  async getServicesByPriceRange(
    minPrice: number,
    maxPrice: number,
    category?: ServiceType
  ): Promise<ServiceWithVenue[]> {
    return this.getAll({
      category,
      maxPrice,
      minPrice,
    });
  }

  async getBudgetServices(maxPrice: number = 1000): Promise<ServiceWithVenue[]> {
    return this.getServicesByPriceRange(0, maxPrice);
  }

  async getPremiumServices(minPrice: number = 5000): Promise<ServiceWithVenue[]> {
    return this.getServicesByPriceRange(minPrice, 999999);
  }
}

export const serviceService = new ServiceService();
