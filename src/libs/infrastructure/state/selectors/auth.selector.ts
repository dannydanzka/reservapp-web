/**
 * Auth selectors with optimized memoization.
 * Following .selector.ts naming convention from Jafra project.
 */

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectCurrentUser = createSelector([selectAuthState], (auth) => auth.user);

export const selectAuthToken = createSelector([selectAuthState], (auth) => auth.token);

export const selectAuthLoading = createSelector([selectAuthState], (auth) => auth.isLoading);

export const selectAuthError = createSelector([selectAuthState], (auth) => auth.error);

export const selectIsAuthError = createSelector([selectAuthState], (auth) => auth.isError);

export const selectLoginAttempts = createSelector([selectAuthState], (auth) => auth.attempts);

export const selectIsBlocked = createSelector([selectAuthState], (auth) => auth.isBlocked);

export const selectSessionExpires = createSelector(
  [selectAuthState],
  (auth) => auth.sessionExpires
);

// Computed selectors
export const selectIsSessionExpired = createSelector([selectSessionExpires], (expiresAt) => {
  if (!expiresAt) return false;
  return new Date(expiresAt) <= new Date();
});

export const selectUserFullName = createSelector([selectCurrentUser], (user) => {
  if (!user) return null;
  return `${user.firstName} ${user.lastName}`.trim();
});

export const selectUserDisplayName = createSelector([selectCurrentUser], (user) => {
  if (!user) return null;
  return user.firstName || user.email || 'Usuario';
});

export const selectCanRetryLogin = createSelector(
  [selectLoginAttempts, selectIsBlocked],
  (attempts, isBlocked) => !isBlocked && attempts < 3
);

// Permission-based selectors (for future use)
export const selectUserPermissions = createSelector(
  [selectCurrentUser],
  (user) => [] // Temporarily return empty array - permissions not implemented in User model
);

export const selectHasPermission = (permission: string) =>
  createSelector([selectUserPermissions], (permissions) => permissions.includes(permission));

// Combined auth status selector
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectIsAuthError, selectIsBlocked],
  (isAuthenticated, isLoading, isError, isBlocked) => ({
    isAuthenticated,
    isBlocked,
    isError,
    isLoading,
  })
);
