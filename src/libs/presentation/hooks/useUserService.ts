import { useCallback, useState } from 'react';

import { handleApiRequest } from '@/libs/services/api/client/handleApiRequest';
import { User, UserRole } from '@prisma/client';

interface UserFilters {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface CreateUserData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

interface UseUserServiceReturn {
  getUsers: (
    filters?: UserFilters,
    pagination?: PaginationOptions
  ) => Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>;
  getUserById: (id: string, includeReservations?: boolean) => Promise<User | null>;
  createUser: (userData: CreateUserData) => Promise<User | null>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const useUserService = (): UseUserServiceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(
    async (filters: UserFilters = {}, pagination: PaginationOptions = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.email) params.append('email', filters.email);
        if (filters.role) params.append('role', filters.role);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.search) params.append('search', filters.search);
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await handleApiRequest({
          endpoint: `/users?${params.toString()}`,
          method: 'GET',
        });

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || 'Failed to fetch users');
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getUserById = useCallback(async (id: string, includeReservations: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = includeReservations ? '?includeReservations=true' : '';

      const response = await handleApiRequest({
        endpoint: `/users/${id}${params}`,
        method: 'GET',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest({
        body: userData,
        endpoint: '/users',
        method: 'POST',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to create user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest({
        body: userData,
        endpoint: `/users/${id}`,
        method: 'PUT',
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to update user');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleApiRequest({
        endpoint: `/users/${id}`,
        method: 'DELETE',
      });

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Failed to delete user');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createUser,
    deleteUser,
    error,
    getUserById,
    getUsers,
    isLoading,
    updateUser,
  };
};

export { useUserService };
