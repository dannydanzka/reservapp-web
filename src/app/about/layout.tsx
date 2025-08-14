import { PublicLayout } from '@layouts/PublicLayout';

interface AboutLayoutProps {
  children: React.ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
