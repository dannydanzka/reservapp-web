/**
 * Client-side API request handler
 */

import { ApiResponse } from '@/libs/types/api.types';

interface ApiRequestOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
  timeout?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiRequest<T = any>(
  options: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const { body, endpoint, headers = {}, isFormData = false, method, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const requestHeaders: HeadersInit = {
      ...headers,
    };

    // Don't set Content-Type for FormData, let the browser set it
    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const requestInit: RequestInit = {
      headers: requestHeaders,
      method,
      signal: controller.signal,
    };

    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      if (isFormData) {
        requestInit.body = body; // FormData
      } else {
        requestInit.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, requestInit);
    clearTimeout(timeoutId);

    let responseData: ApiResponse<T>;

    try {
      responseData = await response.json();
    } catch (parseError) {
      throw new ApiError(response.status, 'Invalid JSON response from server', 'PARSE_ERROR');
    }

    // Check if the response indicates success
    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.message || `HTTP ${response.status}`,
        responseData.error
      );
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      return {
        error: error.code || 'API_ERROR',
        message: error.message,
        success: false,
        timestamp: new Date().toISOString(),
      };
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        error: 'TIMEOUT',
        message: 'Request timeout',
        success: false,
        timestamp: new Date().toISOString(),
      };
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        error: 'NETWORK_ERROR',
        message: 'Network error - please check your connection',
        success: false,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      error: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
}
