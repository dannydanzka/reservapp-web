/**
 * API Services Index
 * Centralized exports for all API services following HTTP-only pattern
 */

// Base service
export { ApiService } from './base/ApiService';

// Service implementations
export { authService } from './authService';
export { venueApiService } from './VenueApiService';
export { userApiService } from './UserApiService';
export { reservationApiService } from './ReservationApiService';

// Type definitions
export * from './types/venue.types';
export type {
  User,
  UserWithStats,
  CreateUserData,
  UpdateUserData,
  ChangePasswordData,
  UserFilters,
  UserStats,
  UserRole,
} from './types/user.types';
export type {
  Reservation,
  ReservationWithDetails,
  CreateReservationData,
  UpdateReservationData,
  ReservationFilters,
  ReservationStats,
  TimeSlotAvailability,
  ReservationAvailability,
  ReservationStatus,
} from './types/reservation.types';

// Configuration
export * from './config';

// Utilities
export * from './utils/handleApiRequest';
