/**
 * Custom auth hook using Redux selectors.
 * Based on Jafra's auth hook patterns with selector integration.
 */

import { useCallback } from 'react';

import {
  authErrorReset,
  loginAsync,
  logoutAsync,
  registerAsync,
  resetLoginAttempts,
  updateUserProfile,
  validateTokenAsync,
} from '@/libs/core/state/slices/auth.slice';
import {
  LoginCredentials,
  RegisterData,
  User,
} from '@/modules/mod-auth/domain/interfaces/auth.interfaces';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthToken,
  selectCanRetryLogin,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsBlocked,
  selectUserDisplayName,
} from '@/libs/core/state/selectors';

import { useAppDispatch, useAppSelector } from './useRedux';

/**
 * Custom hook for authentication state and actions.
 * Provides both state selectors and action dispatchers.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectAuthToken);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isBlocked = useAppSelector(selectIsBlocked);
  const canRetryLogin = useAppSelector(selectCanRetryLogin);
  const userDisplayName = useAppSelector(selectUserDisplayName);
  const authStatus = useAppSelector(selectAuthStatus);

  // Action dispatchers
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginAsync(credentials)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (registerData: RegisterData) => {
      return dispatch(registerAsync(registerData)).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    if (token) {
      return dispatch(logoutAsync(token)).unwrap();
    }
  }, [dispatch, token]);

  const validateToken = useCallback(
    async (tokenToValidate: string) => {
      return dispatch(validateTokenAsync(tokenToValidate)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(authErrorReset());
  }, [dispatch]);

  const resetAttempts = useCallback(() => {
    dispatch(resetLoginAttempts());
  }, [dispatch]);

  const updateProfile = useCallback(
    (profileData: Partial<User>) => {
      dispatch(updateUserProfile(profileData));
    },
    [dispatch]
  );

  return {
    authStatus,

    canRetryLogin,

    clearError,

    error,
    // State
    isAuthenticated,
    isBlocked,
    isLoading,
    // Actions
    login,

    logout,

    register,
    resetAttempts,
    token,
    updateProfile,
    user,
    userDisplayName,
    validateToken,
  };
};
