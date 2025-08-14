/**
 * Shared Repositories Index
 *
 * Only repositories that are used across multiple modules.
 * Module-specific repositories should be in their respective modules.
 */

// User repository (shared across multiple modules)
export { userRepository } from './UserRepository';
export type {
  CreateUserData,
  UpdateUserData,
  UserFilters,
  PaginationOptions,
  UserWithReservations,
} from './UserRepository';

// UserRole repository (shared across multiple modules)
// export * from './UserRoleRepository'; // Temporarily disabled due to imports

// Reservation repository (shared across multiple modules)
// export { reservationRepository, ReservationStatus } from './ReservationRepository'; // Temporarily disabled due to imports
// export type {
//   CreateReservationData,
//   UpdateReservationData,
//   ReservationFilters,
// } from './ReservationRepository'; // Temporarily disabled due to imports

// Payment repository (shared across multiple modules)
// export { paymentRepository } from './PaymentRepository'; // Temporarily disabled due to imports
// export type {
//   CreatePaymentData,
//   UpdatePaymentData,
//   PaymentFilters,
//   PaymentWithDetails,
//   PaymentStats,
// } from './PaymentRepository'; // Temporarily disabled due to imports

// Venue repository (shared across multiple modules)
export * from './VenueRepository';
