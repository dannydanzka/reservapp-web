/**
 * Reservation Domain Entity
 * Represents reservation data in the admin domain layer
 */

export interface Reservation {
  id: string;
  confirmationId: string;
  status: ReservationStatus;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  specialRequests?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  userId: string;
  venueId: string;
  serviceId: string;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface ReservationWithDetails extends Reservation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  venue: {
    id: string;
    name: string;
    category: string;
    city: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
}

export interface ReservationFilters {
  status?: ReservationStatus;
  dateRange?: { start: string; end: string };
  venueId?: string;
  serviceId?: string;
  userId?: string;
}

export interface ReservationSummary {
  totalReservations: number;
  statusBreakdown: Record<ReservationStatus, number>;
  revenueTotal: number;
  averageReservationValue: number;
}
