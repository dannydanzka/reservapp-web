/**
 * Simple Auth hook using Context instead of Redux
 * Temporary solution to make the app work
 */

import { useCallback, useContext } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  role: string;
  permissions?: string[];
  isActive?: boolean;
  businessName?: string;
  phone?: string;
  address?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Simple implementation that returns defaults for now
export const useAuth = (): AuthContextType => {
  const login = useCallback(async (credentials: LoginCredentials) => {
    // Temporary mock implementation
    console.log('Login attempt:', credentials.email);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    // Temporary mock implementation
    console.log('Register attempt:', data.email);
  }, []);

  const logout = useCallback(async () => {
    // Temporary mock implementation
    console.log('Logout');
  }, []);

  return {
    error: null,
    isAuthenticated: false,
    loading: false,
    login,
    logout,
    register,
    user: null,
  };
};
