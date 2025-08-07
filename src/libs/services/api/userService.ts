/**
 * User management service using handleRequest pattern
 */

import { ApiResponse } from '@/libs/types/api.types';
import { User, UserRole } from '@prisma/client';

import { handleRequest } from '../http';

// Types
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFilters {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserWithReservations extends User {
  reservations: Array<{
    id: string;
    status: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    service: {
      name: string;
      venue: {
        name: string;
      };
    };
  }>;
  _count: {
    reservations: number;
  };
}

export const userService = {
  /**
   * Change password (current user)
   */
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return handleRequest({
      body: passwordData,
      endpoint: '/api/auth/change-password',
      method: 'POST',
    });
  },
  /**
   * Create new user
   */
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    return handleRequest({
      body: userData,
      endpoint: '/api/users',
      method: 'POST',
    });
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<ApiResponse<{ id: string }>> => {
    return handleRequest({
      endpoint: `/api/users/${userId}`,
      method: 'DELETE',
    });
  },

  /**
   * Get user profile (current user)
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    return handleRequest({
      endpoint: '/api/auth/profile',
      method: 'GET',
    });
  },

  /**
   * Get user by ID
   */
  getUserById: async (
    id: string,
    includeReservations = false
  ): Promise<ApiResponse<User | UserWithReservations>> => {
    const endpoint = `/api/users/${id}${includeReservations ? '?include=reservations' : ''}`;

    return handleRequest({
      endpoint,
      method: 'GET',
    });
  },

  /**
   * Get all users with filters and pagination
   */
  getUsers: async (filters?: UserFilters): Promise<ApiResponse<PaginatedUsersResponse>> => {
    const searchParams = new URLSearchParams();

    if (filters?.search) searchParams.append('search', filters.search);
    if (filters?.role) searchParams.append('role', filters.role);
    if (filters?.isActive !== undefined)
      searchParams.append('isActive', filters.isActive.toString());
    if (filters?.page) searchParams.append('page', filters.page.toString());
    if (filters?.limit) searchParams.append('limit', filters.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;

    return handleRequest({
      endpoint,
      method: 'GET',
    });
  },

  /**
   * Filter users by role
   */
  getUsersByRole: async (
    role: UserRole,
    filters?: Omit<UserFilters, 'role'>
  ): Promise<ApiResponse<PaginatedUsersResponse>> => {
    return userService.getUsers({ ...filters, role });
  },

  /**
   * Filter users by status
   */
  getUsersByStatus: async (
    isActive: boolean,
    filters?: Omit<UserFilters, 'isActive'>
  ): Promise<ApiResponse<PaginatedUsersResponse>> => {
    return userService.getUsers({ ...filters, isActive });
  },

  /**
   * Search users by term
   */
  searchUsers: async (
    searchTerm: string,
    filters?: Omit<UserFilters, 'search'>
  ): Promise<ApiResponse<PaginatedUsersResponse>> => {
    return userService.getUsers({ ...filters, search: searchTerm });
  },

  /**
   * Toggle user status (activate/deactivate)
   */
  toggleUserStatus: async (userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
    return handleRequest({
      body: { isActive },
      endpoint: `/api/users/${userId}`,
      method: 'PUT',
    });
  },

  /**
   * Update user profile (current user)
   */
  updateProfile: async (profileData: Partial<UpdateUserRequest>): Promise<ApiResponse<User>> => {
    return handleRequest({
      body: profileData,
      endpoint: '/api/auth/profile',
      method: 'PUT',
    });
  },

  /**
   * Update user
   */
  updateUser: async (userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return handleRequest({
      body: userData,
      endpoint: `/api/users/${userData.id}`,
      method: 'PUT',
    });
  },
};
