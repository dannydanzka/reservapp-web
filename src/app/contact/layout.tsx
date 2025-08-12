import { PublicLayout } from '@layouts/PublicLayout';

interface ContactLayoutProps {
  children: React.ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  return <PublicLayout>{children}</PublicLayout>;
}
