'use client';

import { useEffect, useMemo, useState } from 'react';

import { AuthorizationContext, authorizationService } from '@services/auth/AuthorizationService';
import { useAuth } from '@hooks/useAuth';
import { UserRoleEnum } from '@prisma/client';

interface PermissionState {
  permissions: string[];
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

      const context: AuthorizationContext = {
        userId: user.id,
        userRole: user.role as UserRoleEnum,
        venueId,
      };

      const permissions = await authorizationService.getUserPermissions(context);

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
  const authContext = useMemo((): AuthorizationContext | null => {
    if (!user) return null;

    return {
      userId: user.id,
      userRole: user.role as UserRoleEnum,
      venueId,
    };
  }, [user?.id, user?.role, venueId]);

  // Check single permission
  const hasPermission = async (
    module: string,
    action: string,
    resource?: string
  ): Promise<boolean> => {
    if (!authContext) return false;

    const cacheKey = `${module}:${action}:${resource || ''}`;

    if (cachedChecks[cacheKey] !== undefined) {
      return cachedChecks[cacheKey];
    }

    try {
      const hasAccess = await authorizationService.checkPermission(
        authContext,
        module,
        action,
        resource
      );

      setCachedChecks((prev) => ({ ...prev, [cacheKey]: hasAccess }));
      return hasAccess;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = async (checks: PermissionCheck[]): Promise<boolean> => {
    for (const check of checks) {
      const hasAccess = await hasPermission(check.module, check.action, check.resource);
      if (hasAccess) return true;
    }
    return false;
  };

  // Check multiple permissions (all must pass)
  const hasAllPermissions = async (checks: PermissionCheck[]): Promise<boolean> => {
    if (!authContext) return false;

    try {
      return await authorizationService.checkMultiplePermissions(authContext, checks);
    } catch (error) {
      console.error('Error checking multiple permissions:', error);
      return false;
    }
  };

  // Check if user has a specific role
  const hasRole = (requiredRole: UserRoleEnum): boolean => {
    if (!user?.role) return false;
    return authorizationService.hasRole(user.role as UserRoleEnum, requiredRole);
  };

  // Check if user has at least one of the specified roles
  const hasAnyRole = (roles: UserRoleEnum[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  // Clear permission cache
  const clearCache = () => {
    setCachedChecks({});
  };

  return {
    clearCache,
    error: permissionState.error,
    hasAllPermissions,
    hasAnyPermission,
    hasAnyRole,
    hasPermission,
    hasRole,
    isLoading: permissionState.isLoading || authLoading,
    loadPermissions,
    permissions: permissionState.permissions,
  };
};
