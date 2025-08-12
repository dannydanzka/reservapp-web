import { VenueType } from '@prisma/client';

import { VenueImage } from '../entities/Venue';

export interface VenueSearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  type?: VenueType;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
}

export interface VenuePaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'price' | 'rating' | 'name' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface VenueListResponse {
  venues: VenueWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

export interface VenueWithDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  type: VenueType;
  capacity: number;
  basePrice: number;
  images: VenueImage[];
  amenities: string[];
  services: VenueService[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  userId: string;
  contactPhone?: string;
  contactEmail?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VenueService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  capacity: number;
  isActive: boolean;
}

export interface CreateVenueData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  type: VenueType;
  capacity: number;
  basePrice: number;
  images?: CreateVenueImage[];
  amenities?: string[];
  contactPhone?: string;
  contactEmail?: string;
  businessName?: string;
}

export interface CreateVenueImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface UpdateVenueData extends Partial<CreateVenueData> {
  isActive?: boolean;
}

export interface VenueRepository {
  findMany(
    filters?: VenueSearchFilters,
    pagination?: VenuePaginationOptions
  ): Promise<VenueListResponse>;
  findById(id: string): Promise<VenueWithDetails | null>;
  findByUserId(userId: string, pagination?: VenuePaginationOptions): Promise<VenueListResponse>;
  findNearby(latitude: number, longitude: number, radius: number): Promise<VenueWithDetails[]>;
  findPopular(limit?: number): Promise<VenueWithDetails[]>;
  create(data: CreateVenueData): Promise<VenueWithDetails>;
  update(id: string, data: UpdateVenueData): Promise<VenueWithDetails>;
  delete(id: string): Promise<void>;
  checkAvailability(
    venueId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number
  ): Promise<boolean>;
  getStats(venueId: string): Promise<VenueStats>;
}

export interface VenueStats {
  totalReservations: number;
  totalRevenue: number;
  averageRating: number;
  occupancyRate: number;
  monthlyRevenue: Record<string, number>;
  popularServices: Array<{
    serviceId: string;
    serviceName: string;
    reservationCount: number;
  }>;
}
