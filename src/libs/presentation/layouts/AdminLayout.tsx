'use client';

import React, { useEffect, useState } from 'react';

import {
  Bell,
  Building,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import { AdminHeader, AdminSidebar, LoadingSpinner } from '../components';
import { useAuth } from '../providers/AuthProvider';
import { useAuthInterceptor } from '../hooks/useAuthInterceptor';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  margin-left: 288px; /* Width of sidebar */
  transition: margin-left 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    padding-top: 56px; /* Height of fixed header in mobile */
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: ${({ theme }) => theme.spacing[2]};
    padding: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: ${({ theme }) => theme.spacing[1]};
    padding: ${({ theme }) => theme.spacing[3]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0;
    padding: ${({ theme }) => theme.spacing[2]};
    border-radius: 0;
    box-shadow: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

/**
 * Admin layout for authenticated admin pages.
 * Includes authentication check, admin header, and sidebar navigation.
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Initialize auth interceptor for automatic token handling
  useAuthInterceptor();

  // Handle redirects in useEffect to avoid state updates during render
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // Check if user has admin privileges (ADMIN, MANAGER, or SUPER_ADMIN)
      if (user && !['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(user.role)) {
        router.push('/auth/login');
        return;
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size='large' />
      </LoadingContainer>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated || (user && !['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(user.role))) {
    return (
      <LoadingContainer>
        <LoadingSpinner size='large' />
      </LoadingContainer>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const navigation = [
    {
      current: false,
      href: '/admin',
      icon: LayoutDashboard,
      name: 'Dashboard',
    },
    {
      current: false,
      href: '/admin/notifications',
      icon: Bell,
      name: 'Notificaciones',
    },
    {
      current: false,
      href: '/admin/payments',
      icon: CreditCard,
      name: 'Pagos',
    },
    {
      current: false,
      href: '/admin/reservations',
      icon: Calendar,
      name: 'Reservaciones',
    },
    {
      current: false,
      href: '/admin/venues',
      icon: Building,
      name: 'Venues',
    },
    {
      current: false,
      href: '/admin/reports',
      icon: FileText,
      name: 'Reportes',
    },
    {
      current: false,
      href: '/admin/users',
      icon: Users,
      name: 'Usuarios',
    },
  ];

  return (
    <LayoutContainer>
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        navigation={navigation}
        user={user}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <ContentContainer>
        <AdminHeader user={user} onLogout={handleLogout} onToggleMobileMenu={toggleMobileMenu} />

        <MainContent>{children}</MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};
