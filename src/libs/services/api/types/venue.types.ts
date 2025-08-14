/**
 * Venue types for admin management (not public)
 */

export type VenueCategory =
  | 'ACCOMMODATION'
  | 'RESTAURANT'
  | 'SPA'
  | 'TOUR_OPERATOR'
  | 'EVENT_CENTER'
  | 'ENTERTAINMENT';

export interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessAccount?: {
    businessName: string;
    businessType: string;
  };
}

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  description?: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: BusinessOwner; // Only included for SUPER_ADMIN users
  _count: {
    reservations: number;
    services: number;
  };
}

export interface VenueWithServices extends Venue {
  services: {
    id: string;
    name: string;
    category: string;
    price: number;
    isActive: boolean;
  }[];
}

export interface CreateVenueData {
  name: string;
  category: VenueCategory;
  description?: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateVenueData extends Partial<CreateVenueData> {
  isActive?: boolean;
}

export interface VenueStats {
  total: number;
  active: number;
  totalReservations: number;
  totalRevenue?: number;
  averageRating?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
