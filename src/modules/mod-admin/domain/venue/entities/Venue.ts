/**
 * Venue Entity - Domain Layer
 * Core business entity for venue management
 */

export interface Venue {
  id: string;
  name: string;
  description: string;
  category: VenueCategory;
  status: VenueStatus;
  location: VenueLocation;
  contact: VenueContact;
  amenities: VenueAmenity[];
  pricing: VenuePricing;
  availability: VenueAvailability;
  images: VenueImage[];
  rating: VenueRating;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export enum VenueCategory {
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  SPA = 'SPA',
  EVENT_SPACE = 'EVENT_SPACE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TOURS = 'TOURS',
}

export enum VenueStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
}

export interface VenueLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
}

export interface VenueContact {
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface VenueAmenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface VenuePricing {
  basePrice: number;
  currency: string;
  pricePerHour?: number;
  minimumBooking?: number;
  cancellationPolicy: CancellationPolicy;
}

export enum CancellationPolicy {
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT',
  NO_REFUND = 'NO_REFUND',
}

export interface VenueAvailability {
  workingHours: WorkingHours[];
  specialHours?: SpecialHours[];
  blackoutDates?: Date[];
  advanceBookingDays: number;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  isOpen: boolean;
}

export interface SpecialHours {
  date: Date;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  reason?: string;
}

export interface VenueImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface VenueRating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
