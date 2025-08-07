/**
 * Types for User API service
 * These types are independent of Prisma and only used for HTTP communication
 */

import { BusinessPlan, SubscriptionStatus } from '@/libs/types/api.types';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  subscriptionStatus: SubscriptionStatus;
  businessPlan?: BusinessPlan;
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  maxFavorites: number;
  canMakeReservations: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}

export interface UserWithStats extends User {
  _count: {
    reservations: number;
  };
  stats?: {
    totalSpent: number;
    totalReservations: number;
    averageRating: number;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  businessPlan?: BusinessPlan;
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Array<{
    role: UserRole;
    count: number;
  }>;
  recentSignups: number;
  averageReservationsPerUser: number;
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

export interface UserSubscription {
  subscriptionStatus: SubscriptionStatus;
  businessPlan?: BusinessPlan;
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  maxFavorites: number;
  canMakeReservations: boolean;
  planFeatures: string[];
}

export interface UpgradeUserData {
  businessPlan: BusinessPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt?: string;
}
