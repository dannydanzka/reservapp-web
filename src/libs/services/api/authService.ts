/**
 * Authentication service using handleRequest pattern
 */

import { ApiResponse } from '@/libs/types/api.types';
import {
  LoginCredentials,
  LoginSession,
  RegisterData,
} from '@/modules/mod-auth/domain/interfaces/auth.interfaces';

import { API_CONFIG, API_ENDPOINTS } from './config';
import { handleRequest } from '../http';
import { loginErrorMock, loginSuccessMock, registerSuccessMock } from './mocks/authMocks';

// Development flag - set to true for mocked responses
const USE_MOCKED_RESPONSES = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

export const authService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<LoginSession['user']>> => {
    try {
      const response = await handleRequest({
        endpoint: API_ENDPOINTS.AUTH.PROFILE,
        method: 'GET',
        mockedResponse: () => {
          const userData =
            typeof localStorage !== 'undefined' ? localStorage.getItem('user_data') : null;

          if (userData) {
            return {
              data: JSON.parse(userData),
              message: 'Perfil obtenido exitosamente',
              success: true,
            };
          } else {
            throw new Error('No hay sesión activa');
          }
        },
        simulate: USE_MOCKED_RESPONSES,
        timeout: 10000,
        url: API_CONFIG.BASE_URL,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Login user with credentials
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginSession>> => {
    try {
      const response = await handleRequest({
        body: credentials,
        endpoint: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        mockedResponse: () => {
          // Simulate authentication logic
          const validCredentials = [
            { email: 'admin@reservapp.com', password: 'password123' },
            { email: 'manager@reservapp.com', password: 'password123' },
            { email: 'employee@reservapp.com', password: 'password123' },
            { email: 'user@reservapp.com', password: 'password123' },
          ];

          const isValid = validCredentials.some(
            (cred) => cred.email === credentials.email && cred.password === credentials.password
          );

          if (isValid) {
            return loginSuccessMock.response(credentials.email);
          } else {
            throw new Error('Credenciales inválidas');
          }
        },
        simulate: USE_MOCKED_RESPONSES,
        timeout: 10000,
        url: API_CONFIG.BASE_URL,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await handleRequest({
        endpoint: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
        mockedResponse: () => ({
          data: null,
          message: 'Sesión cerrada exitosamente',
          success: true,
        }),
        simulate: USE_MOCKED_RESPONSES,
        timeout: 5000,
        url: API_CONFIG.BASE_URL,
      });

      // Clear token from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<ApiResponse<LoginSession>> => {
    try {
      const response = await handleRequest({
        body: userData,
        endpoint: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        mockedResponse: () =>
          registerSuccessMock.response({
            email: userData.email,
            name: userData.name,
          }),
        simulate: USE_MOCKED_RESPONSES,
        timeout: 10000,
        url: API_CONFIG.BASE_URL,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
};
