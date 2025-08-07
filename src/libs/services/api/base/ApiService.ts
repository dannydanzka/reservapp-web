/**
 * Base API service class that provides standardized HTTP methods
 * All API services should extend this base class
 */

import { ApiResponse } from '@/libs/types/api.types';

import { handleRequest } from '../../http';

export abstract class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic GET request
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return await handleRequest({
      endpoint: `${this.baseUrl}${endpoint}`,
      method: 'GET',
      params,
    });
  }

  /**
   * Generic POST request
   */
  protected async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return await handleRequest({
      body,
      endpoint: `${this.baseUrl}${endpoint}`,
      method: 'POST',
    });
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return await handleRequest({
      body,
      endpoint: `${this.baseUrl}${endpoint}`,
      method: 'PUT',
    });
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return await handleRequest({
      endpoint: `${this.baseUrl}${endpoint}`,
      method: 'DELETE',
    });
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return await handleRequest({
      body,
      endpoint: `${this.baseUrl}${endpoint}`,
      method: 'PATCH',
    });
  }

  /**
   * Helper method to handle API responses
   */
  protected handleResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message || 'API request failed');
    }
    return response.data as T;
  }

  /**
   * Helper method to handle API responses that might be null/undefined
   */
  protected handleOptionalResponse<T>(response: ApiResponse<T>): T | null {
    if (!response.success) {
      throw new Error(response.message || 'API request failed');
    }
    return response.data || null;
  }
}
