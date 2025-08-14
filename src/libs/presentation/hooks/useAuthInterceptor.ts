import { useEffect } from 'react';

import { authInterceptor } from '@libs/infrastructure/services/core/http/authInterceptor';
import { useAuth } from '@libs/presentation/providers/AuthProvider';

/**
 * Hook to initialize and configure the authentication interceptor
 *
 * This hook sets up automatic handling of:
 * - Token expiration
 * - Unauthorized requests
 * - Automatic redirects
 * - Session cleanup
 */
export const useAuthInterceptor = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Configure the auth interceptor
    authInterceptor.configure({
      excludeRoutes: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/contact',
        '/api/health',
        '/api/swagger',
      ],

      onTokenExpired: () => {
        console.log('Token expired, cleaning up session...');

        // Call the logout function from AuthProvider
        logout().catch((error) => {
          console.error('Error during automatic logout:', error);
        });
      },

      onUnauthorized: () => {
        console.log('Unauthorized access, redirecting to login...');

        // Clear session and redirect
        logout().catch((error) => {
          console.error('Error during unauthorized cleanup:', error);
        });
      },
    });

    // Log that interceptor is ready
    console.log('Auth interceptor configured successfully');

    return () => {
      // Cleanup if needed (interceptor is a singleton, so this is mostly for logging)
      console.log('Auth interceptor hook cleanup');
    };
  }, [logout]);

  // Return interceptor methods for manual use if needed
  return {
    authFetch: authInterceptor.authFetch.bind(authInterceptor),
    authFetchWithRetry: authInterceptor.authFetchWithRetry.bind(authInterceptor),
  };
};
