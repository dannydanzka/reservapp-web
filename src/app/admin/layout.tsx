import { AdminLayout } from '@layouts/AdminLayout';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * Layout for admin pages.
 * Includes authentication check and admin navigation.
 */
const AdminLayoutWrapper = ({ children }: AdminLayoutWrapperProps) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminLayoutWrapper;
