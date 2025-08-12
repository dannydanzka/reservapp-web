/**
 * User Domain Entity
 * Represents user data in the admin domain layer
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  role: UserRole;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface UserWithStats extends User {
  _count: {
    reservations: number;
    payments: number;
    reviews: number;
  };
  totalSpent: number;
  lastReservation?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  registrationDateRange?: { start: string; end: string };
}

export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  roleBreakdown: Record<UserRole, number>;
  newUsersThisMonth: number;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
  isActive?: boolean;
}
