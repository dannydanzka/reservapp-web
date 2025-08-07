/**
 * Custom user management hook using Redux selectors.
 * Based on Jafra's domain hook patterns with selector integration.
 */

import { useCallback } from 'react';

import {
  clearError,
  clearSelectedUser,
  createUserAsync,
  CreateUserData,
  deleteUserAsync,
  fetchUserByIdAsync,
  fetchUsersAsync,
  resetUserState,
  setFilters,
  setPagination,
  updateUserAsync,
  UpdateUserData,
  UserFilters,
} from '@/libs/core/state/slices/user.slice';
import {
  selectCurrentUserData,
  selectHasUsers,
  selectIsLoadingUsers,
  selectSelectedUser,
  selectSelectedUserReservations,
  selectSelectedUserReservationsCount,
  selectSelectedUserStats,
  selectTotalUsers,
  selectUserError,
  selectUserErrorMessage,
  selectUserFilters,
  selectUserHasActiveFilters,
  selectUserHasNextPage,
  selectUserHasPreviousPage,
  selectUserPagination,
  selectUsers,
  selectUserStats,
} from '@/libs/core/state/selectors/user.selector';

import { useAppDispatch, useAppSelector } from './useRedux';

/**
 * Custom hook for user management state and actions.
 * Provides both state selectors and action dispatchers for admin user management.
 */
export const useUser = () => {
  const dispatch = useAppDispatch();

  // State selectors
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUserData);
  const selectedUser = useAppSelector(selectSelectedUser);
  const filters = useAppSelector(selectUserFilters);
  const pagination = useAppSelector(selectUserPagination);
  const isLoading = useAppSelector(selectIsLoadingUsers);
  const error = useAppSelector(selectUserError);
  const errorMessage = useAppSelector(selectUserErrorMessage);

  // Computed selectors
  const hasUsers = useAppSelector(selectHasUsers);
  const totalUsers = useAppSelector(selectTotalUsers);
  const userStats = useAppSelector(selectUserStats);
  const hasActiveFilters = useAppSelector(selectUserHasActiveFilters);
  const hasNextPage = useAppSelector(selectUserHasNextPage);
  const hasPreviousPage = useAppSelector(selectUserHasPreviousPage);

  // Selected user selectors
  const selectedUserReservations = useAppSelector(selectSelectedUserReservations);
  const selectedUserReservationsCount = useAppSelector(selectSelectedUserReservationsCount);
  const selectedUserStats = useAppSelector(selectSelectedUserStats);

  // Action dispatchers
  const fetchUsers = useCallback(
    async (params?: { filters?: UserFilters; pagination?: { page?: number; limit?: number } }) => {
      return dispatch(fetchUsersAsync(params || {})).unwrap();
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    async (id: string, includeReservations: boolean = false) => {
      return dispatch(fetchUserByIdAsync({ id, includeReservations })).unwrap();
    },
    [dispatch]
  );

  const createUser = useCallback(
    async (userData: CreateUserData) => {
      return dispatch(createUserAsync(userData)).unwrap();
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (userData: UpdateUserData) => {
      return dispatch(updateUserAsync(userData)).unwrap();
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      return dispatch(deleteUserAsync(userId)).unwrap();
    },
    [dispatch]
  );

  // Filter and pagination actions
  const updateFilters = useCallback(
    (newFilters: UserFilters) => {
      dispatch(setFilters(newFilters));
      // Reset to first page when filters change
      dispatch(setPagination({ page: 1 }));
    },
    [dispatch]
  );

  const updatePagination = useCallback(
    (newPagination: Partial<typeof pagination>) => {
      dispatch(setPagination(newPagination));
    },
    [dispatch]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      dispatch(setPagination({ page: pagination.page + 1 }));
    }
  }, [dispatch, hasNextPage, pagination.page]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      dispatch(setPagination({ page: pagination.page - 1 }));
    }
  }, [dispatch, hasPreviousPage, pagination.page]);

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setPagination({ page }));
    },
    [dispatch]
  );

  // Utility actions
  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const resetUsers = useCallback(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  // Refresh current data
  const refreshUsers = useCallback(async () => {
    await fetchUsers({ filters, pagination: { limit: pagination.limit, page: pagination.page } });
  }, [fetchUsers, filters, pagination]);

  const refreshSelectedUser = useCallback(async () => {
    if (selectedUser) {
      await fetchUserById(selectedUser.id, true);
    }
  }, [fetchUserById, selectedUser]);

  // Search and filter helpers
  const searchUsers = useCallback(
    async (searchTerm: string) => {
      const newFilters = { ...filters, search: searchTerm };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchUsers({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchUsers]
  );

  const filterByRole = useCallback(
    async (role: UserFilters['role']) => {
      const newFilters = { ...filters, role };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchUsers({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchUsers]
  );

  const filterByStatus = useCallback(
    async (isActive: boolean | undefined) => {
      const newFilters = { ...filters, isActive };
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
      await fetchUsers({ filters: newFilters, pagination: { limit: pagination.limit, page: 1 } });
    },
    [dispatch, filters, pagination.limit, fetchUsers]
  );

  const clearFilters = useCallback(async () => {
    dispatch(setFilters({}));
    dispatch(setPagination({ page: 1 }));
    await fetchUsers({ filters: {}, pagination: { limit: pagination.limit, page: 1 } });
  }, [dispatch, pagination.limit, fetchUsers]);

  // Validation helpers
  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const isValidPassword = useCallback((password: string): boolean => {
    return password.length >= 8;
  }, []);

  const validateCreateUserData = useCallback(
    (userData: CreateUserData): string[] => {
      const errors: string[] = [];

      if (!userData.email) errors.push('Email es requerido');
      else if (!isValidEmail(userData.email)) errors.push('Email no es válido');

      if (!userData.firstName) errors.push('Nombre es requerido');
      if (!userData.lastName) errors.push('Apellido es requerido');

      if (!userData.password) errors.push('Contraseña es requerida');
      else if (!isValidPassword(userData.password))
        errors.push('Contraseña debe tener al menos 8 caracteres');

      if (userData.password !== userData.confirmPassword) {
        errors.push('Las contraseñas no coinciden');
      }

      return errors;
    },
    [isValidEmail, isValidPassword]
  );

  return {
    clearFilters,
    clearSelected,
    clearUserError,
    createUser,
    currentUser,
    deleteUser,
    error,
    errorMessage,
    fetchUserById,
    fetchUsers,
    filterByRole,
    filterByStatus,
    filters,
    goToPage,
    hasActiveFilters,
    hasNextPage,
    hasPreviousPage,
    hasUsers,
    isLoading,
    isValidEmail,
    isValidPassword,
    nextPage,
    pagination,
    previousPage,
    refreshSelectedUser,
    refreshUsers,
    resetUsers,
    searchUsers,
    selectedUser,
    selectedUserReservations,
    selectedUserReservationsCount,
    selectedUserStats,
    totalUsers,
    updateFilters,
    updatePagination,
    updateUser,
    userStats,
    users,
    validateCreateUserData,
  };
};
