/**
 * Authentication service tests
 */

import { LoginCredentials } from '@/modules/mod-auth/domain/interfaces/auth.interfaces';

import { authService } from '../authService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthService', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@reservapp.com',
        password: 'password123',
      };

      const response = await authService.login(credentials);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.user.email).toBe(credentials.email);
      expect(response.data?.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'invalid@test.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow();
    });

    it('should fail with missing password', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@reservapp.com',
        password: '',
      };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set some tokens first
      localStorageMock.setItem('auth_token', 'test_token');
      localStorageMock.setItem('refresh_token', 'test_refresh');

      const response = await authService.logout();

      expect(response.success).toBe(true);
      expect(localStorageMock.getItem('auth_token')).toBeNull();
      expect(localStorageMock.getItem('refresh_token')).toBeNull();
    });
  });
});
