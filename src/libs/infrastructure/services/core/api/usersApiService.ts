/**
 * Users HTTP API Service
 * Replaces direct Prisma usage for user management
 */

import { handleRequest } from '../http/handleRequest';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  // Business account information (only included for SUPER_ADMIN users)
  businessAccount?: {
    businessName: string;
    businessType: string;
    isVerified: boolean;
    contactEmail: string;
    contactPhone: string;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserUpdateData extends Partial<Omit<UserCreateData, 'password'>> {
  id: string;
  password?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export class UsersApiService {
  private static readonly baseUrl = '/api/users';

  /**
   * Get users with filters and pagination (Admin only)
   */
  static async getUsers(
    params: {
      filters?: UserFilters;
      pagination?: PaginationParams;
    } = {}
  ): Promise<UsersResponse> {
    const { filters = {}, pagination = {} } = params;

    const queryParams = new URLSearchParams();

    // Add pagination
    if (pagination.page) queryParams.set('page', pagination.page.toString());
    if (pagination.limit) queryParams.set('limit', pagination.limit.toString());

    // Add filters
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.role) queryParams.set('role', filters.role);
    if (filters.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return await handleRequest({
      endpoint: url,
      method: 'GET',
    });
  }

  /**
   * Get user by ID (Admin only)
   */
  static async getUserById(id: string): Promise<UserResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'GET',
    });
  }

  /**
   * Create new user (Admin only)
   */
  static async createUser(userData: UserCreateData): Promise<UserResponse> {
    return await handleRequest({
      body: userData,
      endpoint: this.baseUrl,
      method: 'POST',
    });
  }

  /**
   * Update user (Admin only)
   */
  static async updateUser(userData: UserUpdateData): Promise<UserResponse> {
    const { id, ...updateData } = userData;
    return await handleRequest({
      body: updateData,
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });
  }

  /**
   * Delete user (soft delete - Admin only)
   */
  static async deleteUser(id: string): Promise<UserResponse> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }

  /**
   * Toggle user status (Admin only)
   */
  static async toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    return await handleRequest({
      body: { isActive },
      endpoint: `${this.baseUrl}/${id}`,
      method: 'PUT',
    });
  }

  /**
   * Get user statistics (Admin only)
   */
  static async getUserStats(): Promise<{
    success: boolean;
    data: {
      total: number;
      active: number;
      inactive: number;
      byRole: Record<string, number>;
    };
  }> {
    return await handleRequest({
      endpoint: `${this.baseUrl}/stats`,
      method: 'GET',
    });
  }
}

export const usersApiService = UsersApiService;
