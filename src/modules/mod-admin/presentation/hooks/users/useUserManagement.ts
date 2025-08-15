/**
 * User Management Hook - Presentation Layer
 * Handles user operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import { User, UserRole, UserStatus } from '../../../domain/users/entities/User';

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  emailVerified?: boolean;
  businessId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  businessOwners: number;
  regularUsers: number;
  adminUsers: number;
}

export interface UseUserManagementReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  stats: UserStats | null;
  filters: UserFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  createUser: (userData: Partial<User>) => Promise<User | null>;
  updateUser: (id: string, updates: Partial<User>) => Promise<boolean>;
  updateUserStatus: (id: string, status: UserStatus) => Promise<boolean>;
  updateUserRole: (id: string, role: UserRole) => Promise<boolean>;
  activateUser: (id: string) => Promise<boolean>;
  deactivateUser: (id: string) => Promise<boolean>;
  verifyUserEmail: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;

  // Bulk actions
  bulkUpdateStatus: (userIds: string[], status: UserStatus) => Promise<boolean>;
  bulkUpdateRole: (userIds: string[], role: UserRole) => Promise<boolean>;
  bulkActivate: (userIds: string[]) => Promise<boolean>;
  bulkDeactivate: (userIds: string[]) => Promise<boolean>;

  // Business management
  assignUserToBusiness: (userId: string, businessId: string) => Promise<boolean>;
  removeUserFromBusiness: (userId: string) => Promise<boolean>;
  getUsersByBusiness: (businessId: string) => Promise<void>;

  // Analytics & Export
  exportUsers: (format: 'csv' | 'excel', filters?: UserFilters) => Promise<void>;
  getUserActivity: (userId: string) => Promise<any>;

  // Filters & Pagination
  setFilters: (filters: UserFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
  });

  /**
   * Get auth token from localStorage (same pattern as AdminStatsService)
   */
  const getAuthToken = useCallback((): string => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Remove quotes if present (localStorage sometimes stores with quotes)
    return token.replace(/^"(.*)"$/, '$1');
  }, []);

  const fetchUsers = useCallback(
    async (newFilters?: UserFilters) => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());

        const activeFilters = newFilters || filters;

        if (activeFilters.role) {
          queryParams.append('role', activeFilters.role);
        }

        if (activeFilters?.status) {
          queryParams.append('status', activeFilters?.status);
        }

        if (activeFilters.isActive !== undefined) {
          queryParams.append('isActive', activeFilters.isActive.toString());
        }

        if (activeFilters.emailVerified !== undefined) {
          queryParams.append('emailVerified', activeFilters.emailVerified.toString());
        }

        if (activeFilters.businessId) {
          queryParams.append('businessId', activeFilters.businessId);
        }

        if (activeFilters.dateFrom) {
          queryParams.append('dateFrom', activeFilters.dateFrom.toISOString());
        }

        if (activeFilters.dateTo) {
          queryParams.append('dateTo', activeFilters.dateTo.toISOString());
        }

        if (activeFilters.searchQuery) {
          queryParams.append('search', activeFilters.searchQuery);
        }

        const response = await fetch(`/api/admin/users?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        setUsers(data.users);
        setPagination(data.pagination);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchUserById = useCallback(
    async (id: string): Promise<User | null> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        return data.user;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        return null;
      }
    },
    [getAuthToken]
  );

  const createUser = useCallback(
    async (userData: Partial<User>): Promise<User | null> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/users', {
          body: JSON.stringify(userData),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        const data = await response.json();
        const newUser = data.user;

        // Add to local state
        setUsers((prev) => [newUser, ...prev]);

        return newUser;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create user');
        return null;
      }
    },
    [getAuthToken]
  );

  const updateUser = useCallback(
    async (id: string, updates: Partial<User>): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}`, {
          body: JSON.stringify(updates),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        const data = await response.json();
        const updatedUser = data.user;

        // Update local state
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === id ? updatedUser : user)));

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update user');
        return false;
      }
    },
    [getAuthToken]
  );

  const updateUserStatus = useCallback(
    async (id: string, status: UserStatus): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}/status`, {
          body: JSON.stringify({ status }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update user status');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, status } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update user status');
        return false;
      }
    },
    [getAuthToken]
  );

  const updateUserRole = useCallback(
    async (id: string, role: UserRole): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}/role`, {
          body: JSON.stringify({ role }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update user role');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, role } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update user role');
        return false;
      }
    },
    [getAuthToken]
  );

  const activateUser = useCallback(
    async (id: string): Promise<boolean> => {
      return updateUser(id, { isActive: true });
    },
    [updateUser]
  );

  const deactivateUser = useCallback(
    async (id: string): Promise<boolean> => {
      return updateUser(id, { isActive: false });
    },
    [updateUser]
  );

  const verifyUserEmail = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}/verify-email`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to verify user email');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, emailVerified: true } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify user email');
        return false;
      }
    },
    [getAuthToken]
  );

  const resetUserPassword = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}/reset-password`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to reset user password');
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset user password');
        return false;
      }
    },
    [getAuthToken]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Remove from local state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
        return false;
      }
    },
    [getAuthToken]
  );

  const bulkUpdateStatus = useCallback(
    async (userIds: string[], status: UserStatus): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/users/bulk/status', {
          body: JSON.stringify({ status, userIds }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to bulk update user status');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (userIds.includes(user.id) ? { ...user, status } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to bulk update user status');
        return false;
      }
    },
    [getAuthToken]
  );

  const bulkUpdateRole = useCallback(
    async (userIds: string[], role: UserRole): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/users/bulk/role', {
          body: JSON.stringify({ role, userIds }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to bulk update user role');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (userIds.includes(user.id) ? { ...user, role } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to bulk update user role');
        return false;
      }
    },
    [getAuthToken]
  );

  const bulkActivate = useCallback(
    async (userIds: string[]): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/users/bulk/activate', {
          body: JSON.stringify({ userIds }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to bulk activate users');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (userIds.includes(user.id) ? { ...user, isActive: true } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to bulk activate users');
        return false;
      }
    },
    [getAuthToken]
  );

  const bulkDeactivate = useCallback(
    async (userIds: string[]): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/users/bulk/deactivate', {
          body: JSON.stringify({ userIds }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to bulk deactivate users');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (userIds.includes(user.id) ? { ...user, isActive: false } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to bulk deactivate users');
        return false;
      }
    },
    [getAuthToken]
  );

  const assignUserToBusiness = useCallback(
    async (userId: string, businessId: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${userId}/assign-business`, {
          body: JSON.stringify({ businessId }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to assign user to business');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, businessId } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to assign user to business');
        return false;
      }
    },
    [getAuthToken]
  );

  const removeUserFromBusiness = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${userId}/remove-business`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to remove user from business');
        }

        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, businessId: null } : user))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove user from business');
        return false;
      }
    },
    [getAuthToken]
  );

  const getUsersByBusiness = useCallback(
    async (businessId: string) => {
      const businessFilters: UserFilters = { businessId };
      await fetchUsers(businessFilters);
    },
    [fetchUsers]
  );

  const exportUsers = useCallback(
    async (format: 'csv' | 'excel', exportFilters?: UserFilters) => {
      try {
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('format', format);

        const activeFilters = exportFilters || filters;

        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/export?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to export users');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export users');
      }
    },
    [filters]
  );

  const getUserActivity = useCallback(
    async (userId: string) => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/users/${userId}/activity`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to get user activity');
        }

        const data = await response.json();
        return data.activity;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user activity');
        return null;
      }
    },
    [getAuthToken]
  );

  const handleSetFilters = useCallback(
    (newFilters: UserFilters) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [getAuthToken]
  );

  const handleSetPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
    },
    [getAuthToken]
  );

  const handleSetLimit = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 }));
    },
    [getAuthToken]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [getAuthToken]);

  // Load users on mount and when filters/pagination change
  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page, pagination.limit]);

  return {
    activateUser,
    assignUserToBusiness,
    bulkActivate,
    bulkDeactivate,
    bulkUpdateRole,
    bulkUpdateStatus,
    clearFilters,
    createUser,
    deactivateUser,
    deleteUser,
    error,
    exportUsers,
    fetchUserById,
    fetchUsers,
    filters,
    getUserActivity,
    getUsersByBusiness,
    loading,
    pagination,
    removeUserFromBusiness,
    resetUserPassword,
    setFilters: handleSetFilters,
    setLimit: handleSetLimit,
    setPage: handleSetPage,
    stats,
    updateUser,
    updateUserRole,
    updateUserStatus,
    users,
    verifyUserEmail,
  };
};
