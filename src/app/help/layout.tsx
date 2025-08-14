import type { ReactNode } from 'react';

import { PublicLayout } from '@layouts/PublicLayout';

interface HelpLayoutProps {
  children: ReactNode;
}

export default function HelpLayout({ children }: HelpLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
