import type { Metadata } from 'next';

import { PublicLayout } from '@layouts/PublicLayout';

export const metadata: Metadata = {
  robots: {
    follow: true,
    index: true,
  },
};

interface PrivacyLayoutProps {
  children: React.ReactNode;
}

export default function PrivacyLayout({ children }: PrivacyLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
