/**
 * Temporary Venue Types stub
 * Provides basic type definitions to avoid compilation errors
 */

export interface Venue {
  id: string;
  name: string;
  description?: string;
  category: VenueCategory;
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    services: number;
    reservations: number;
  };
}

export interface VenueWithServices extends Venue {
  services: {
    id: string;
    name: string;
    price: number;
    type: string;
  }[];
}

export interface CreateVenueData {
  name: string;
  category: VenueCategory;
  address: string;
  city: string;
  state: string;
  description?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateVenueData extends Partial<CreateVenueData> {
  id: string;
  isActive?: boolean;
}

export interface VenueFilters {
  category?: VenueCategory;
  city?: string;
  search?: string;
  rating?: number;
  priceRange?: { min: number; max: number };
}

export interface VenueStats {
  total: number;
  active: number;
  averageRating: number;
  totalReservations: number;
  byCategory: Record<VenueCategory, number>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export enum VenueCategory {
  RESTAURANT = 'RESTAURANT',
  SPA = 'SPA',
  ACCOMMODATION = 'ACCOMMODATION',
  TOUR_OPERATOR = 'TOUR_OPERATOR',
  EVENT_CENTER = 'EVENT_CENTER',
  ENTERTAINMENT = 'ENTERTAINMENT',
}
