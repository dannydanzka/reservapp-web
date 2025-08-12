/**
 * Authentication HOC based on Jafra's auth patterns.
 * Provides authentication protection and conditional rendering.
 */

import React, { ComponentType, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { ScreenLoader } from '@ui/ScreenLoader';
import { useAuth } from '@presentation/hooks';

interface WithAuthOptions {
  /**
   * Redirect URL for unauthenticated users
   * @default '/login'
   */
  redirectTo?: string;

  /**
   * Whether to show a loading spinner while checking authentication
   * @default true
   */
  showLoader?: boolean;

  /**
   * Custom loading component
   */
  loadingComponent?: ComponentType;

  /**
   * Whether authentication is required (true) or forbidden (false)
   * @default true
   */
  requireAuth?: boolean;

  /**
   * Custom redirect logic
   */
  onUnauthenticated?: () => void;

  /**
   * Custom authentication check
   */
  customAuthCheck?: (isAuthenticated: boolean, user: any) => boolean;
}

/**
 * Higher-Order Component that handles authentication protection.
 * @param WrappedComponent - The component to wrap
 * @param options - Configuration options for authentication
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    customAuthCheck,
    loadingComponent: LoadingComponent = ScreenLoader,
    onUnauthenticated,
    redirectTo = '/auth/login',
    requireAuth = true,
    showLoader = true,
  } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const { isAuthenticated, loading: isLoading, user } = useAuth();

    useEffect(() => {
      // Wait for auth state to be determined
      if (isLoading) return;

      let shouldAllow = isAuthenticated;

      // Use custom auth check if provided
      if (customAuthCheck) {
        shouldAllow = customAuthCheck(isAuthenticated, user);
      }

      // Handle authentication requirements
      if (requireAuth && !shouldAllow) {
        if (onUnauthenticated) {
          onUnauthenticated();
        } else {
          router.push(redirectTo);
        }
        return;
      }

      // Handle inverse authentication (e.g., login page should redirect if authenticated)
      if (!requireAuth && shouldAllow) {
        router.push('/admin'); // Default redirect for business users
        return;
      }
    }, [isAuthenticated, user, isLoading, router]);

    // Show loading state while determining authentication
    if (isLoading) {
      if (!showLoader) return null;
      return <LoadingComponent />;
    }

    // Custom auth check logic
    if (customAuthCheck) {
      const shouldAllow = customAuthCheck(isAuthenticated, user);
      if ((requireAuth && !shouldAllow) || (!requireAuth && shouldAllow)) {
        return null; // Will redirect via useEffect
      }
    } else {
      // Standard auth check
      if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
        return null; // Will redirect via useEffect
      }
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}

/**
 * HOC for protecting routes that require authentication
 */
export const withAuthRequired = <P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo?: string
) => withAuth(WrappedComponent, { redirectTo, requireAuth: true });

/**
 * HOC for routes that should redirect authenticated users (e.g., login page)
 */
export const withAuthForbidden = <P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo?: string
) => withAuth(WrappedComponent, { redirectTo, requireAuth: false });

/**
 * HOC for routes that require specific user permissions
 */
export const withPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermissions: string[],
  options?: Omit<WithAuthOptions, 'customAuthCheck'>
) => {
  const customAuthCheck = (isAuthenticated: boolean, user: any) => {
    if (!isAuthenticated || !user) return false;

    const userPermissions = user.permissions || [];
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  };

  return withAuth(WrappedComponent, {
    ...options,
    customAuthCheck,
    redirectTo: options?.redirectTo || '/unauthorized',
  });
};

/**
 * HOC for admin-only routes
 */
export const withAdminRequired = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: Omit<WithAuthOptions, 'customAuthCheck'>
) => {
  const customAuthCheck = (isAuthenticated: boolean, user: any) => {
    if (!isAuthenticated || !user) return false;
    return user.role === 'ADMIN' || user.role === 'admin' || user.isAdmin === true;
  };

  return withAuth(WrappedComponent, {
    ...options,
    customAuthCheck,
    redirectTo: options?.redirectTo || '/unauthorized',
  });
};

/**
 * HOC for business routes (admin or manager)
 */
export const withBusinessRequired = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: Omit<WithAuthOptions, 'customAuthCheck'>
) => {
  const customAuthCheck = (isAuthenticated: boolean, user: any) => {
    if (!isAuthenticated || !user) return false;
    return ['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(user.role?.toUpperCase());
  };

  return withAuth(WrappedComponent, {
    ...options,
    customAuthCheck,
    redirectTo: options?.redirectTo || '/auth/login',
  });
};

export default withAuth;
