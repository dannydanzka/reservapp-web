/**
 * User HTTP API Service
 * Handles all user-related API communications
 * Uses only HTTP calls - NO direct Prisma usage
 */

import { ApiService } from './base/ApiService';
import {
  ChangePasswordData,
  CreateUserData,
  PaginatedResponse,
  PaginationParams,
  UpdateUserData,
  User,
  UserFilters,
  UserStats,
  UserWithStats,
} from './types/user.types';

export class UserApiService extends ApiService {
  constructor() {
    super('/api/users');
  }

  /**
   * Get all users with optional filters and pagination
   */
  async getUsers(
    filters?: UserFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<UserWithStats>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await this.get<PaginatedResponse<UserWithStats>>('', params);
    return this.handleResponse(response);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<UserWithStats | null> {
    const response = await this.get<UserWithStats>(`/${id}`);
    return this.handleOptionalResponse(response);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.get<User>('/profile');
    return this.handleResponse(response);
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await this.post<User>('', data);
    return this.handleResponse(response);
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: Partial<UpdateUserData>): Promise<User> {
    const response = await this.put<User>(`/${id}`, data);
    return this.handleResponse(response);
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<UpdateUserData>): Promise<User> {
    const response = await this.put<User>('/profile', data);
    return this.handleResponse(response);
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await this.post<void>('/change-password', data);
    this.handleResponse(response);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const response = await this.delete<void>(`/${id}`);
    this.handleResponse(response);
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: string): Promise<User> {
    const response = await this.patch<User>(`/${id}/toggle-status`);
    return this.handleResponse(response);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await this.get<UserStats>('/stats');
    return this.handleResponse(response);
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const params = { limit, q: query };
    const response = await this.get<User[]>('/search', params);
    return this.handleResponse(response);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const response = await this.get<User[]>(`/role/${role}`);
    return this.handleResponse(response);
  }

  /**
   * Get recently registered users
   */
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    const response = await this.get<User[]>('/recent', { limit });
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
