import { PublicLayout } from '@layouts/PublicLayout';

interface TermsLayoutProps {
  children: React.ReactNode;
}

export default function TermsLayout({ children }: TermsLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
