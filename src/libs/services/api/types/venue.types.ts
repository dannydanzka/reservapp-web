/**
 * Types for Venue API service
 * These types are independent of Prisma and only used for HTTP communication
 */

export interface Venue {
  id: string;
  name: string;
  description?: string;
  category: VenueCategory;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  checkInTime?: string;
  checkOutTime?: string;
  amenities: string[];
  businessHours?: Record<string, { open: string; close: string } | string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum VenueCategory {
  ACCOMMODATION = 'ACCOMMODATION',
  RESTAURANT = 'RESTAURANT',
  SPA = 'SPA',
  TOUR_OPERATOR = 'TOUR_OPERATOR',
  EVENT_CENTER = 'EVENT_CENTER',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

// For compatibility with Prisma enum
export type VenueType = VenueCategory;

export interface VenueWithServices extends Venue {
  services: VenueService[];
  _count: {
    services: number;
    reservations: number;
  };
}

export interface VenueService {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration?: number;
  capacity: number;
  category: string;
}

export interface CreateVenueData {
  name: string;
  description?: string;
  category: VenueCategory;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[];
  businessHours?: Record<string, { open: string; close: string } | string>;
  isActive?: boolean;
}

export interface UpdateVenueData extends Partial<CreateVenueData> {
  id: string;
}

export interface VenueFilters {
  category?: VenueCategory;
  city?: string;
  isActive?: boolean;
  search?: string;
  hasServices?: boolean;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface VenueStats {
  totalVenues: number;
  activeVenues: number;
  totalReservations: number;
  totalRevenue: number;
  averageRating: number;
  venuesByCategory: Record<VenueCategory, number>;
  topCategories: Array<{
    category: VenueCategory;
    count: number;
  }>;
  topVenues: Array<{
    id: string;
    name: string;
    reservations: number;
    revenue: number;
    rating: number;
  }>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
