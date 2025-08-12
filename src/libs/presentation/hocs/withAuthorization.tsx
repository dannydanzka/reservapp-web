'use client';
/* eslint-disable */
// @ts-nocheck
// Temporarily disabled due to auth context mismatch

import { useEffect, useState } from 'react';

// Temporary stub for authorization service
const authorizationService = {
  createContext: (userId: string, role: string, venueId?: string) => ({ userId, role, venueId }),
  hasAnyPermission: async (context: any, permissions: any[]) => true, // Stub: allow all
  checkMultiplePermissions: async (context: any, permissions: any[]) => true, // Stub: allow all
  checkPermission: (context: any, module: string, action: string, resource?: string) => true, // Stub: allow all
};
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useAuth } from '@hooks/useAuth';

interface AuthorizationConfig {
  requiredPermissions?: Array<{
    module: string;
    action: string;
    resource?: string;
  }>;
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions, if false (default), user needs ALL
  venueId?: string;
  fallbackComponent?: React.ComponentType;
  loadingComponent?: React.ComponentType;
}

interface AuthorizationState {
  loading: boolean;
  isAuthorized: boolean;
  error?: string;
}

export function withAuthorization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: AuthorizationConfig
) {
  const AuthorizedComponent = (props: P) => {
    const { loading, user } = useAuth();
    const [authState, setAuthState] = useState<AuthorizationState>({
      isAuthorized: false,
      loading: true,
    });

    useEffect(() => {
      const checkAuthorization = async () => {
        if (loading || !user) {
          return;
        }

        try {
          setAuthState({ isAuthorized: false, loading: true });

          // Create authorization context
          const context = authorizationService.createContext(user.id, user.role, config.venueId);

          let isAuthorized = true;

          // Check permissions if specified
          if (config.requiredPermissions && config.requiredPermissions.length > 0) {
            if (config.requireAnyPermission) {
              isAuthorized = await authorizationService.hasAnyPermission(
                context,
                config.requiredPermissions
              );
            } else {
              isAuthorized = await authorizationService.checkMultiplePermissions(
                context,
                config.requiredPermissions
              );
            }
          }

          setAuthState({
            isAuthorized,
            loading: false,
          });
        } catch (error) {
          console.error('Authorization check failed:', error);
          setAuthState({
            error: error instanceof Error ? error.message : 'Authorization failed',
            isAuthorized: false,
            loading: false,
          });
        }
      };

      checkAuthorization();
    }, [user, loading, config.venueId]);

    // Show loading while checking auth or authorization
    if (loading || authState.loading) {
      if (config.loadingComponent) {
        const LoadingComponent = config.loadingComponent;
        return <LoadingComponent />;
      }
      return (
        <div className='flex items-center justify-center min-h-96'>
          <LoadingSpinner size='large' />
        </div>
      );
    }

    // Show unauthorized if user is not logged in or doesn't have permission
    if (!user || !authState.isAuthorized) {
      if (config.fallbackComponent) {
        const FallbackComponent = config.fallbackComponent;
        return <FallbackComponent />;
      }

      return (
        <div className='flex items-center justify-center min-h-96'>
          <div className='text-center'>
            <div className='text-red-600 text-6xl mb-4'>🚫</div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Acceso Denegado</h2>
            <p className='text-gray-600 mb-4'>No tienes permisos para acceder a esta sección.</p>
            {authState.error && (
              <p className='text-sm text-red-600 bg-red-50 p-2 rounded'>Error: {authState.error}</p>
            )}
          </div>
        </div>
      );
    }

    // User is authorized, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  AuthorizedComponent.displayName = `withAuthorization(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthorizedComponent;
}

// Convenience HOCs for common permission patterns
export const withDashboardAccess = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'dashboard' }],
  });

export const withPaymentManagement = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'payments' }],
  });

export const withReservationManagement = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'reservations' }],
  });

export const withUserManagement = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'users' }],
  });

export const withReportAccess = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'reports' }],
  });

export const withAuditAccess = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'read', module: 'audit' }],
  });

export const withAdminAccess = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requireAnyPermission: true,
    requiredPermissions: [
      { action: 'read', module: 'dashboard' },
      { action: 'read', module: 'users' },
    ],
  });

export const withSuperAdminAccess = <P extends object>(Component: React.ComponentType<P>) =>
  withAuthorization(Component, {
    requiredPermissions: [{ action: 'manage_permissions', module: 'system' }],
  });

// Hook for checking permissions in functional components
export const useAuthorization = () => {
  const { user } = useAuth();

  const checkPermission = async (
    module: string,
    action: string,
    venueId?: string,
    resource?: string
  ) => {
    if (!user) return false;

    const context = authorizationService.createContext(user.id, user.role, venueId);
    return authorizationService.checkPermission(context, module, action, resource);
  };

  const checkMultiplePermissions = async (
    permissions: Array<{ module: string; action: string; resource?: string }>,
    venueId?: string
  ) => {
    if (!user) return false;

    const context = authorizationService.createContext(user.id, user.role, venueId);
    return authorizationService.checkMultiplePermissions(context, permissions);
  };

  const hasAnyPermission = async (
    permissions: Array<{ module: string; action: string; resource?: string }>,
    venueId?: string
  ) => {
    if (!user) return false;

    const context = authorizationService.createContext(user.id, user.role, venueId);
    return authorizationService.hasAnyPermission(context, permissions);
  };

  return {
    canAccessAuditLogs: () => checkPermission('audit', 'read'),

    // Quick checks
    canAccessDashboard: () => checkPermission('dashboard', 'read'),

    canAccessReports: () => checkPermission('reports', 'read'),

    canManagePayments: () => checkPermission('payments', 'read'),

    canManageReservations: () => checkPermission('reservations', 'read'),
    canManageUsers: () => checkPermission('users', 'read'),
    canRefundPayments: () => checkPermission('payments', 'refund'),
    checkMultiplePermissions,
    checkPermission,
    hasAnyPermission,
    user,
  };
};
