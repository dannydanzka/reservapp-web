'use client';

import { useEffect, useMemo, useState } from 'react';

import { authorizationService, AuthorizationService } from '@services/auth/AuthorizationService';
import type { Permission } from '@shared/types/admin.types';
import { useAuth } from '@hooks/useAuth';

interface PermissionState {
  permissions: Permission[];
  isLoading: boolean;
  error?: string;
}

interface PermissionCheck {
  module: string;
  action: string;
  resource?: string;
}

interface UsePermissionsOptions {
  venueId?: string;
  autoLoad?: boolean;
}

export const usePermissions = (options: UsePermissionsOptions = {}) => {
  const { loading: authLoading, user } = useAuth();
  const { autoLoad = true, venueId } = options;

  const [permissionState, setPermissionState] = useState<PermissionState>({
    isLoading: false,
    permissions: [],
  });

  const [cachedChecks, setCachedChecks] = useState<Record<string, boolean>>({});

  // Load user permissions
  const loadPermissions = async () => {
    if (!user || authLoading) return;

    try {
      setPermissionState((prev) => ({ ...prev, error: undefined, isLoading: true }));

      const permissions = await authorizationService.getUserPermissions(user.id, venueId);

      setPermissionState({
        isLoading: false,
        permissions,
      });
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissionState({
        error: error instanceof Error ? error.message : 'Failed to load permissions',
        isLoading: false,
        permissions: [],
      });
    }
  };

  useEffect(() => {
    if (autoLoad && user && !authLoading) {
      loadPermissions();
    }
  }, [user?.id, venueId, autoLoad, authLoading]);

  // Create authorization context
  const authContext = useMemo(() => {
    if (!user) return null;

    return AuthorizationService.createContext(user.id, user.role, venueId);
  }, [user?.id, user?.role, venueId]);

  // Check single permission
  const hasPermission = async (
    module: string,
    action: string,
    resource?: string
  ): Promise<boolean> => {
    if (!authContext) return false;

    const cacheKey = `${module}:${action}${resource ? `:${resource}` : ''}`;

    // Return cached result if available
    if (cacheKey in cachedChecks) {
      return cachedChecks[cacheKey];
    }

    try {
      const result = await authorizationService.checkPermission(
        authContext,
        module,
        action,
        resource
      );

      // Cache the result
      setCachedChecks((prev) => ({ ...prev, [cacheKey]: result }));

      return result;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  // Check multiple permissions (all required)
  const hasAllPermissions = async (permissions: PermissionCheck[]): Promise<boolean> => {
    if (!authContext) return false;

    try {
      return await authorizationService.checkMultiplePermissions(authContext, permissions);
    } catch (error) {
      console.error('Error checking multiple permissions:', error);
      return false;
    }
  };

  // Check multiple permissions (any required)
  const hasAnyPermission = async (permissions: PermissionCheck[]): Promise<boolean> => {
    if (!authContext) return false;

    try {
      return await authorizationService.hasAnyPermission(authContext, permissions);
    } catch (error) {
      console.error('Error checking any permission:', error);
      return false;
    }
  };

  // Batch check permissions for optimization
  const batchCheckPermissions = async (
    permissions: PermissionCheck[]
  ): Promise<Record<string, boolean>> => {
    if (!authContext) return {};

    try {
      return await authorizationService.batchCheckPermissions(authContext, permissions);
    } catch (error) {
      console.error('Error in batch permission check:', error);
      return {};
    }
  };

  // Clear permission cache
  const clearCache = () => {
    setCachedChecks({});
  };

  // Refresh permissions and clear cache
  const refresh = async () => {
    clearCache();
    await loadPermissions();
  };

  // Quick permission checks for common operations
  const quickChecks = useMemo(
    () => ({
      // Dashboard
      canAccessDashboard: () => hasPermission('dashboard', 'read'),

      canBulkUpdatePayments: () => hasPermission('payments', 'bulk_update'),

      canCancelReservations: () => hasPermission('reservations', 'cancel'),

      canCreateReservations: () => hasPermission('reservations', 'create'),

      canCreateServices: () => hasPermission('services', 'create'),

      canCreateUsers: () => hasPermission('users', 'create'),

      canCreateVenues: () => hasPermission('venues', 'create'),

      canDeleteServices: () => hasPermission('services', 'delete'),

      canDeleteUsers: () => hasPermission('users', 'delete'),

      canDeleteVenues: () => hasPermission('venues', 'delete'),

      canExportAuditLogs: () => hasPermission('audit', 'export'),

      canExportPayments: () => hasPermission('payments', 'export'),

      canExportReceipts: () => hasPermission('receipts', 'export'),

      canExportReports: () => hasPermission('reports', 'export'),

      canExportReservations: () => hasPermission('reservations', 'export'),

      canManagePermissions: () => hasPermission('users', 'manage_permissions'),

      // System
      canManageSystemPermissions: () => hasPermission('system', 'manage_permissions'),

      canRefundPayments: () => hasPermission('payments', 'refund'),

      canUpdatePayments: () => hasPermission('payments', 'update'),

      canUpdateReservations: () => hasPermission('reservations', 'update'),

      canUpdateServices: () => hasPermission('services', 'update'),

      canUpdateUsers: () => hasPermission('users', 'update'),

      canUpdateVenues: () => hasPermission('venues', 'update'),

      canVerifyPayments: () => hasPermission('payments', 'verify'),

      canVerifyReceipts: () => hasPermission('receipts', 'verify'),

      // Audit
      canViewAuditLogs: () => hasPermission('audit', 'read'),

      // Payments
      canViewPayments: () => hasPermission('payments', 'read'),

      // Receipts
      canViewReceipts: () => hasPermission('receipts', 'read'),

      // Reports
      canViewReports: () => hasPermission('reports', 'read'),

      // Reservations
      canViewReservations: () => hasPermission('reservations', 'read'),

      // Services
      canViewServices: () => hasPermission('services', 'read'),

      // Users
      canViewUsers: () => hasPermission('users', 'read'),

      // Venues
      canViewVenues: () => hasPermission('venues', 'read'),
    }),
    [hasPermission]
  );

  // Helper to get permissions by module
  const getModulePermissions = (module: string): Permission[] => {
    return permissionState.permissions.filter((p) => p.module === module);
  };

  // Helper to check if user has any admin-level permissions
  const isAdmin = useMemo(() => {
    return permissionState.permissions.some(
      (p) =>
        ['users', 'system'].includes(p.module) &&
        ['create', 'update', 'delete', 'manage_permissions'].includes(p.action)
    );
  }, [permissionState.permissions]);

  // Helper to check if user has venue-specific permissions
  const hasVenueAccess = (targetVenueId?: string): boolean => {
    if (!targetVenueId) return true; // Global permissions

    return permissionState.permissions.some(
      (p) => p.resource === targetVenueId || !p.resource // Global or venue-specific
    );
  };

  return {
    batchCheckPermissions,

    error: permissionState.error,

    hasAllPermissions,

    hasAnyPermission,

    // Permission checks
    hasPermission,

    isAdmin,

    isLoading: permissionState.isLoading || authLoading,
    // State
    permissions: permissionState.permissions,

    // Quick checks
    ...quickChecks,

    clearCache,
    // Utilities
    getModulePermissions,
    hasVenueAccess,
    loadPermissions,
    refresh,
  };
};

// Hook for specific module permissions
export const useModulePermissions = (module: string, venueId?: string) => {
  const { hasPermission, isLoading, permissions, ...rest } = usePermissions({ venueId });

  const modulePermissions = useMemo(
    () => permissions.filter((p) => p.module === module),
    [permissions, module]
  );

  const moduleChecks = useMemo(
    () => ({
      canCreate: () => hasPermission(module, 'create'),
      canDelete: () => hasPermission(module, 'delete'),
      canExport: () => hasPermission(module, 'export'),
      canRead: () => hasPermission(module, 'read'),
      canUpdate: () => hasPermission(module, 'update'),
    }),
    [hasPermission, module]
  );

  return {
    hasPermission: (action: string, resource?: string) => hasPermission(module, action, resource),
    isLoading,
    permissions: modulePermissions,
    ...moduleChecks,
    ...rest,
  };
};
