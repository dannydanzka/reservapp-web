/**
 * Users Hook using HTTP API instead of Prisma direct
 * For user management in admin interface
 */

import { useCallback, useState } from 'react';

import {
  User,
  UserCreateData,
  UserFilters,
  usersApiService,
  UserUpdateData,
} from '@services/core/api/usersApiService';

export interface UseUsersReturn {
  // State
  users: User[];
  isLoading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hasUsers: boolean;
  hasActiveFilters: boolean;

  // Actions
  loadUsers: (filters?: UserFilters, page?: number, limit?: number) => Promise<void>;
  createUser: (userData: UserCreateData) => Promise<User | null>;
  updateUser: (userData: UserUpdateData) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearFilters: () => void;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  setFilters: (filters: UserFilters) => void;

  // Computed values
  currentPageInfo: {
    current: number;
    total: number;
  };
  filters: UserFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useUsers(): UseUsersReturn {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    pages: 0,
    total: 0,
  });

  // Computed values
  const totalUsers = pagination.total;
  const currentPage = pagination.page;
  const totalPages = pagination.pages;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const hasUsers = users.length > 0;
  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof UserFilters] !== undefined &&
      filters[key as keyof UserFilters] !== null &&
      filters[key as keyof UserFilters] !== ''
  );

  const currentPageInfo = {
    current: currentPage,
    total: totalPages,
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: UserFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Load users
  const loadUsers = useCallback(
    async (userFilters?: UserFilters, page = 1, limit = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await usersApiService.getUsers({
          filters: userFilters || filters,
          pagination: { limit, page },
        });

        if (response.success) {
          setUsers(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || 'Error al cargar usuarios');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Create user
  const createUser = useCallback(
    async (userData: UserCreateData): Promise<User | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await usersApiService.createUser(userData);

        if (response.success) {
          // Reload users to get updated list
          await loadUsers();
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear usuario');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUsers]
  );

  // Update user
  const updateUser = useCallback(async (userData: UserUpdateData): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersApiService.updateUser(userData);

      if (response.success) {
        // Update local state
        setUsers((prev) => prev.map((user) => (user.id === userData.id ? response.data : user)));
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersApiService.deleteUser(id);

      if (response.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, isActive: false } : user))
        );
        return true;
      } else {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle user status
  const toggleUserStatus = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Find current user to toggle its status
        const currentUser = users.find((u) => u.id === id);
        if (!currentUser) {
          throw new Error('Usuario no encontrado');
        }

        const response = await usersApiService.toggleUserStatus(id, !currentUser.isActive);

        if (response.success) {
          // Update local state
          setUsers((prev) =>
            prev.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user))
          );
          return true;
        } else {
          throw new Error(response.message || 'Error al cambiar estado del usuario');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [users]
  );

  // Go to next page
  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      await loadUsers(filters, currentPage + 1, pagination.limit);
    }
  }, [hasNextPage, loadUsers, filters, currentPage, pagination.limit]);

  // Go to previous page
  const goToPreviousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await loadUsers(filters, currentPage - 1, pagination.limit);
    }
  }, [hasPreviousPage, loadUsers, filters, currentPage, pagination.limit]);

  return {
    clearError,

    clearFilters,

    createUser,

    currentPage,

    // Computed values
    currentPageInfo,

    deleteUser,

    error,

    goToNextPage,

    filters,

    hasActiveFilters,

    goToPreviousPage,
    hasNextPage,

    hasPreviousPage,

    hasUsers,

    isLoading,

    // Actions
    loadUsers,

    pagination,

    setFilters,

    toggleUserStatus,

    totalPages,

    // State
    users,
    totalUsers,
    updateUser,
  };
}
