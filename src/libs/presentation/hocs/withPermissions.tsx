/**
 * Permissions HOC based on Jafra's authorization patterns.
 * Provides role-based and permission-based access control.
 */

import React, { ComponentType } from 'react';

import styled from 'styled-components';

import { useAuth } from '@presentation/hooks';

interface WithPermissionsOptions {
  /**
   * Required permissions (user must have ALL of these)
   */
  permissions?: string[];

  /**
   * Required roles (user must have ONE of these)
   */
  roles?: string[];

  /**
   * Custom permission check function
   */
  checkPermissions?: (user: any) => boolean;

  /**
   * Component to render when access is denied
   */
  fallbackComponent?: ComponentType<{
    user?: any;
    requiredPermissions?: string[];
    requiredRoles?: string[];
  }>;

  /**
   * Whether to hide the component entirely when access is denied
   * @default false
   */
  hideOnDenied?: boolean;

  /**
   * Callback when access is denied
   */
  onAccessDenied?: (user: any) => void;
}

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.warning[50]};
  border: 1px solid ${({ theme }) => theme.colors.warning[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const AccessDeniedTitle = styled.h3`
  color: ${({ theme }) => theme.colors.warning[800]};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AccessDeniedMessage = styled.p`
  color: ${({ theme }) => theme.colors.warning[600]};
  font-size: 1rem;
  margin: 0;
`;

/**
 * Default access denied component
 */
const DefaultAccessDeniedComponent: React.FC<{
  user?: any;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}> = ({ requiredPermissions, requiredRoles }) => (
  <AccessDeniedContainer>
    <AccessDeniedTitle>Acceso Denegado</AccessDeniedTitle>
    <AccessDeniedMessage>
      No tienes los permisos necesarios para acceder a esta sección.
      {requiredPermissions && requiredPermissions.length > 0 && (
        <>
          <br />
          Permisos requeridos: {requiredPermissions.join(', ')}
        </>
      )}
      {requiredRoles && requiredRoles.length > 0 && (
        <>
          <br />
          Roles requeridos: {requiredRoles.join(', ')}
        </>
      )}
    </AccessDeniedMessage>
  </AccessDeniedContainer>
);

/**
 * Helper function to check if user has required permissions
 */
const hasPermissions = (
  userPermissions: string[] = [],
  requiredPermissions: string[] = []
): boolean => {
  return requiredPermissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Helper function to check if user has required roles
 */
const hasRoles = (userRole: string | string[], requiredRoles: string[] = []): boolean => {
  if (requiredRoles.length === 0) return true;

  const roles = Array.isArray(userRole) ? userRole : [userRole];
  return requiredRoles.some((role) => roles.includes(role));
};

/**
 * Higher-Order Component that provides permission-based access control.
 * @param WrappedComponent - The component to wrap
 * @param options - Configuration options for permissions
 */
export function withPermissions<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionsOptions = {}
) {
  const {
    checkPermissions,
    fallbackComponent: FallbackComponent = DefaultAccessDeniedComponent,
    hideOnDenied = false,
    onAccessDenied,
    permissions = [],
    roles = [],
  } = options;

  const WithPermissionsComponent: React.FC<P> = (props) => {
    const { isAuthenticated, user } = useAuth();

    // If not authenticated, always deny access
    if (!isAuthenticated || !user) {
      if (hideOnDenied) return null;
      return (
        <FallbackComponent requiredPermissions={permissions} requiredRoles={roles} user={user} />
      );
    }

    let hasAccess = true;

    // Use custom permission check if provided
    if (checkPermissions) {
      hasAccess = checkPermissions(user);
    } else {
      // Check permissions
      if (permissions.length > 0) {
        hasAccess = hasAccess && hasPermissions(user.permissions || [], permissions);
      }

      // Check roles
      if (roles.length > 0) {
        hasAccess = hasAccess && hasRoles(user.role, roles);
      }
    }

    // Handle access denied
    if (!hasAccess) {
      if (onAccessDenied) {
        onAccessDenied(user);
      }

      if (hideOnDenied) {
        return null;
      }

      return (
        <FallbackComponent requiredPermissions={permissions} requiredRoles={roles} user={user} />
      );
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  WithPermissionsComponent.displayName = `withPermissions(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithPermissionsComponent;
}

/**
 * HOC for admin-only components
 */
export const withAdminOnly = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType<any>
) =>
  withPermissions(WrappedComponent, {
    fallbackComponent,
    roles: ['admin'],
  });

/**
 * HOC for manager-level components
 */
export const withManagerOnly = <P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType<any>
) =>
  withPermissions(WrappedComponent, {
    fallbackComponent,
    roles: ['admin', 'manager'],
  });

/**
 * HOC for specific permission requirements
 */
export const withRequiredPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermissions: string[],
  options?: Omit<WithPermissionsOptions, 'permissions'>
) =>
  withPermissions(WrappedComponent, {
    ...options,
    permissions: requiredPermissions,
  });

/**
 * HOC that hides component instead of showing access denied message
 */
export const withHiddenPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: Omit<WithPermissionsOptions, 'hideOnDenied'>
) =>
  withPermissions(WrappedComponent, {
    ...options,
    hideOnDenied: true,
  });

/**
 * Render prop component for conditional permission-based rendering
 */
export const PermissionGate: React.FC<{
  permissions?: string[];
  roles?: string[];
  checkPermissions?: (user: any) => boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ checkPermissions, children, fallback = null, permissions = [], roles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  let hasAccess = true;

  if (checkPermissions) {
    hasAccess = checkPermissions(user);
  } else {
    if (permissions.length > 0) {
      hasAccess = hasAccess && hasPermissions(user.permissions, permissions);
    }

    if (roles.length > 0) {
      hasAccess = hasAccess && hasRoles(user.role, roles);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default withPermissions;
