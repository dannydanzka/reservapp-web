'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { AuthRepository } from '@mod-auth/data/repositories/AuthRepository';
import {
  AuthState,
  AuthStatus,
  BusinessRegistrationData,
  User,
} from '@mod-auth/domain/auth/auth.interfaces';
import { useLocalStorage } from '@hooks/index';

interface AuthContextValue extends AuthState {
  // Mapped properties for compatibility
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    businessData?: BusinessRegistrationData
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider that manages global auth state.
 * Based on Jafra's stable auth architecture with localStorage integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    error: null,
    isLoading: true,
    status: 'idle',
    token: null,
    user: null,
  });

  const [sessionToken, setSessionToken] = useLocalStorage('auth_token', '');
  const authRepository = new AuthRepository();

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Setup auth interceptor when component mounts
  useEffect(() => {
    // Import and setup interceptor
    const setupInterceptor = async () => {
      const { authInterceptor } = await import(
        '@libs/infrastructure/services/core/http/authInterceptor'
      );

      authInterceptor.configure({
        onTokenExpired: () => {
          console.log('Token expired in AuthProvider context');
          // The logout function will be called automatically
          logout().catch(console.error);
        },
        onUnauthorized: () => {
          console.log('Unauthorized in AuthProvider context');
          logout().catch(console.error);
        },
      });
    };

    setupInterceptor().catch(console.error);
  }, []);

  /**
   * Checks for existing authentication session with improved error handling.
   */
  const checkExistingSession = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (sessionToken) {
        // Try to validate the existing token
        const user = await authRepository.validateToken();
        setAuthState({
          error: null,
          isLoading: false,
          status: 'authenticated',
          token: sessionToken,
          user,
        });
      } else {
        setAuthState({
          error: null,
          isLoading: false,
          status: 'unauthenticated',
          token: null,
          user: null,
        });
      }
    } catch (error: any) {
      console.error('Session validation failed:', error);

      // Clear invalid/expired token
      setSessionToken('');

      // Check if it's a token expiration error
      const isTokenExpired =
        error.message?.includes('Token expirado') || error.message?.includes('TokenExpiredError');

      // Set appropriate error message
      const errorMessage = isTokenExpired
        ? 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
        : null; // Don't show error for other validation failures

      setAuthState({
        error: errorMessage,
        isLoading: false,
        status: 'unauthenticated',
        token: null,
        user: null,
      });

      // If token expired, redirect to login after a short delay
      if (isTokenExpired && typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/auth/login?error=session_expired';
        }, 2000);
      }
    }
  };

  /**
   * Handles user login.
   */
  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null, status: 'loading' }));

      const session = await authRepository.authenticate({ email, password });

      // Store token
      setSessionToken(session.token);

      setAuthState({
        error: null,
        isLoading: false,
        status: 'authenticated',
        token: session.token,
        user: session.user,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        status: 'error',
      }));
      throw error;
    }
  };

  /**
   * Handles user registration.
   */
  const register = async (
    email: string,
    password: string,
    name: string,
    businessData?: BusinessRegistrationData
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null, status: 'loading' }));

      // Prepare registration data
      const registrationData = businessData || { email, name, password };

      const session = await authRepository.register(registrationData);

      // Store token
      setSessionToken(session.token);

      setAuthState({
        error: null,
        isLoading: false,
        status: 'authenticated',
        token: session.token,
        user: session.user,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
        status: 'error',
      }));
      throw error;
    }
  };

  /**
   * Handles user logout.
   */
  const logout = async () => {
    try {
      if (authState.token) {
        await authRepository.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token regardless of API call result
      setSessionToken('');

      setAuthState({
        error: null,
        isLoading: false,
        status: 'unauthenticated',
        token: null,
        user: null,
      });
    }
  };

  const contextValue: AuthContextValue = {
    ...authState,
    // Map AuthState properties to expected interface
    isAuthenticated: authState.status === 'authenticated',
    loading: authState.isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context.
 * Must be used within AuthProvider.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
