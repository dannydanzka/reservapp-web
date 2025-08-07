import { PublicLayout } from '@/libs/ui/layouts/PublicLayout';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
