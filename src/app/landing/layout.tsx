import { PublicLayout } from '@layouts/PublicLayout';

interface LandingLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for landing pages.
 * Uses public layout without authentication requirements.
 */
export default function LandingLayout({ children }: LandingLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
