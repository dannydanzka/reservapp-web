import { AuthLayout } from '@layouts/AuthLayout';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * Layout for authentication pages.
 * Provides centered form layout with branding.
 */
export default function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
