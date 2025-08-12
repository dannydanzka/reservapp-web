/**
 * User selectors with optimized memoization.
 * Following .selector.ts naming convention from Jafra project.
 */

import { createSelector } from '@reduxjs/toolkit';
import { UserRoleEnum } from '@prisma/client';

import { RootState } from '../store';

// Base selectors
const selectUserState = (state: RootState) => state.users;

// Basic selectors
export const selectUsers = createSelector([selectUserState], (userState) => userState.users);

export const selectCurrentUserData = createSelector(
  [selectUserState],
  (userState) => userState.currentUser
);

export const selectSelectedUser = createSelector(
  [selectUserState],
  (userState) => userState.selectedUser
);

export const selectUserFilters = createSelector(
  [selectUserState],
  (userState) => userState.filters
);

export const selectUserPagination = createSelector(
  [selectUserState],
  (userState) => userState.pagination
);

export const selectUserLoading = createSelector(
  [selectUserState],
  (userState) => userState.isLoading
);

export const selectUserError = createSelector([selectUserState], (userState) => userState.error);

export const selectUserIsError = createSelector(
  [selectUserState],
  (userState) => userState.isError
);

export const selectUserLastUpdated = createSelector(
  [selectUserState],
  (userState) => userState.lastUpdated
);

// Computed selectors
export const selectTotalUsers = createSelector(
  [selectUserPagination],
  (pagination) => pagination.total
);

export const selectHasUsers = createSelector([selectUsers], (users) => users.length > 0);

export const selectUsersByRole = (role: UserRoleEnum) =>
  createSelector([selectUsers], (users) => users.filter((user) => user.role === role));

export const selectActiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.isActive)
);

export const selectInactiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => !user.isActive)
);

export const selectAdminUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === UserRoleEnum.ADMIN)
);

export const selectManagerUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === UserRoleEnum.MANAGER)
);

export const selectEmployeeUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === UserRoleEnum.EMPLOYEE)
);

export const selectRegularUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === UserRoleEnum.USER)
);

// User by ID selector factory
export const selectUserById = (userId: string) =>
  createSelector([selectUsers], (users) => users.find((user) => user.id === userId));

// Statistics selectors
export const selectUserStats = createSelector([selectUsers], (users) => {
  const stats = {
    active: 0,
    admin: 0,
    employee: 0,
    inactive: 0,
    manager: 0,
    total: users.length,
    user: 0,
  };

  users.forEach((user) => {
    if (user.isActive) stats.active++;
    else stats.inactive++;

    switch (user.role) {
      case UserRoleEnum.ADMIN:
        stats.admin++;
        break;
      case UserRoleEnum.MANAGER:
        stats.manager++;
        break;
      case UserRoleEnum.EMPLOYEE:
        stats.employee++;
        break;
      case UserRoleEnum.USER:
        stats.user++;
        break;
    }
  });

  return stats;
});

// Pagination selectors
export const selectUserHasNextPage = createSelector(
  [selectUserPagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectUserHasPreviousPage = createSelector(
  [selectUserPagination],
  (pagination) => pagination.page > 1
);

export const selectCurrentPageInfo = createSelector([selectUserPagination], (pagination) => ({
  current: pagination.page,
  total: pagination.totalPages,
}));

// Filter selectors
export const selectUserHasActiveFilters = createSelector([selectUserFilters], (filters) =>
  Boolean(filters.email || filters.role || filters.isActive !== undefined || filters.search)
);

export const selectFilteredUsersCount = createSelector(
  [selectUsers, selectUserFilters],
  (users, filters) => {
    if (!filters || Object.keys(filters).length === 0) return users.length;

    return users.filter((user) => {
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const emailMatch = user.email.toLowerCase().includes(searchLower);
        const nameMatch = fullName.includes(searchLower);
        const phoneMatch = user.phone?.toLowerCase().includes(searchLower);

        if (!emailMatch && !nameMatch && !phoneMatch) {
          return false;
        }
      }
      return true;
    }).length;
  }
);

// Loading state selectors
export const selectIsLoadingUsers = createSelector([selectUserLoading], (loading) => loading);

// Error state selectors
export const selectUserErrorMessage = createSelector(
  [selectUserError, selectUserIsError],
  (error, isError) => (isError ? error : null)
);

// Selected user with reservations selectors
export const selectSelectedUserReservations = createSelector(
  [selectSelectedUser],
  (selectedUser) => selectedUser?.reservations || []
);

export const selectSelectedUserReservationsCount = createSelector(
  [selectSelectedUser],
  (selectedUser) => selectedUser?._count?.reservations || 0
);

export const selectSelectedUserStats = createSelector([selectSelectedUser], (selectedUser) => {
  if (!selectedUser?.reservations) return null;

  const stats = {
    cancelled: 0,
    confirmed: 0,
    pending: 0,
    total: selectedUser.reservations.length,
    totalRevenue: 0,
  };

  selectedUser.reservations.forEach((reservation) => {
    stats.totalRevenue += reservation.totalAmount;

    switch (reservation?.status) {
      case 'PENDING':
        stats.pending++;
        break;
      case 'CONFIRMED':
      case 'CHECKED_IN':
      case 'CHECKED_OUT':
        stats.confirmed++;
        break;
      case 'CANCELLED':
        stats.cancelled++;
        break;
    }
  });

  return stats;
});

// Utility selectors
export const selectIsUserManagementReady = createSelector(
  [selectUsers, selectUserLoading, selectUserError],
  (users, loading, error) => !loading && !error && users.length >= 0
);
