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

  /**
   * Checks for existing authentication session.
   */
  const checkExistingSession = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (sessionToken) {
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
    } catch (error) {
      // Clear invalid token
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
