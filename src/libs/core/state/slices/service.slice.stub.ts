/**
 * Stub types for service slice - temporarily disabled for MVP build
 */

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: 'SPA' | 'RESTAURANT' | 'ACCOMMODATION' | 'TOUR' | 'EVENT' | 'ENTERTAINMENT' | 'OTHER';
  venueId: string;
  venue?: {
    id: string;
    name: string;
    category: string;
  };
  price: number;
  currency: string;
  duration?: number;
  capacity: number;
  isActive: boolean;
  images?: string[];
  amenities?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  search?: string;
  category?: Service['category'];
  venueId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  capacity?: number;
  isActive?: boolean;
}
