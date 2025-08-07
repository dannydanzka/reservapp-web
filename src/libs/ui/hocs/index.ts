/**
 * Higher-Order Components (HOCs) barrel export.
 * Based on Jafra's HOC architecture patterns.
 */

// Error handling HOCs
export { default as withErrorBoundary } from './withErrorBoundary';

// Authentication HOCs
export {
  default as withAuth,
  withAuthRequired,
  withAuthForbidden,
  withPermissions as withAuthPermissions,
  withAdminRequired,
} from './withAuth';

// Loading state HOCs
export {
  default as withLoading,
  withGlobalLoading,
  withComponentLoading,
  withLoadingOverlay,
} from './withLoading';

// Permission-based HOCs
export {
  default as withPermissions,
  withAdminOnly,
  withManagerOnly,
  withRequiredPermissions,
  withHiddenPermissions,
  PermissionGate,
} from './withPermissions';
