import { PublicLayout } from '@/libs/ui/layouts/PublicLayout';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

export default function ServicesLayout({ children }: ServicesLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
