/**
 * Types for Reservation API service
 * These types are independent of Prisma and only used for HTTP communication
 */

export interface Reservation {
  id: string;
  userId: string;
  serviceId: string;
  status: ReservationStatus;
  startDate: string;
  endDate: string;
  guests: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface ReservationWithDetails extends Reservation {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    venue: {
      id: string;
      name: string;
      address: string;
      phone?: string;
    };
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  };
}

export interface CreateReservationData {
  serviceId: string;
  startDate: string;
  endDate: string;
  guests: number;
  specialRequests?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface UpdateReservationData extends Partial<CreateReservationData> {
  id: string;
  status?: ReservationStatus;
}

export interface ReservationFilters {
  userId?: string;
  serviceId?: string;
  venueId?: string;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ReservationStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  averageReservationValue: number;
  occupancyRate: number;
  statusDistribution: Array<{
    status: ReservationStatus;
    count: number;
    percentage: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

export interface TimeSlotAvailability {
  date: string;
  slots: Array<{
    time: string;
    available: boolean;
    price?: number;
  }>;
}

export interface ReservationAvailability {
  serviceId: string;
  startDate: string;
  endDate: string;
  available: boolean;
  conflictingReservations?: Array<{
    id: string;
    startDate: string;
    endDate: string;
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
