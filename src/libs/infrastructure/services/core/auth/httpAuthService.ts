/**
 * HTTP Authentication Service for Client-Side Use
 * Makes HTTP requests to API endpoints instead of direct database access
 */

import { authFetch } from '@libs/infrastructure/services/core/http/authInterceptor';

// UserRole imported as string type for compatibility

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
  phone?: string;
  address?: string;
  subscriptionPlan?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  businessName?: string;
  phone?: string;
  address?: string;
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  permissions?: string[];
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

interface LoginSession {
  user: User;
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

export class HttpAuthService {
  private static readonly BASE_URL = '/api';

  static async login(credentials: LoginCredentials): Promise<ApiResponse<LoginSession>> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        success: false,
      };
    }
  }

  static async register(data: RegisterData): Promise<ApiResponse<LoginSession>> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/register`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        success: false,
      };
    }
  }

  static async logout(): Promise<ApiResponse<void>> {
    try {
      // Use authFetch for automatic token handling
      const response = await authFetch(`${this.BASE_URL}/auth/logout`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data = await response.json();

      // Clear local storage on logout (authInterceptor also does this)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

      return data;
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

      return {
        message: 'Error cerrando sesión',
        success: false,
      };
    }
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return {
          message: 'No hay token de autenticación',
          success: false,
        };
      }

      // Use authFetch for automatic token handling
      const response = await authFetch(`${this.BASE_URL}/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        message: 'Error obteniendo perfil de usuario',
        success: false,
      };
    }
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return {
          message: 'No hay token de refresco',
          success: false,
        };
      }

      const response = await fetch(`${this.BASE_URL}/auth/refresh`, {
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data = await response.json();

      // Update token in localStorage if successful
      if (data.success && data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
      }

      return data;
    } catch (error) {
      return {
        message: 'Error refrescando token',
        success: false,
      };
    }
  }
}

// Export as httpAuthService for client-side use
export const httpAuthService = HttpAuthService;
