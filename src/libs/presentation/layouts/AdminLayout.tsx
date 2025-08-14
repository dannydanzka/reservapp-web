'use client';

import React, { useEffect } from 'react';

import { Building, Calendar, CreditCard, FileText, LayoutDashboard, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import { AdminHeader, AdminSidebar, LoadingSpinner } from '../components';
import { useAuth } from '../providers/AuthProvider';

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

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
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
      <AdminSidebar navigation={navigation} user={user} onLogout={handleLogout} />

      <ContentContainer>
        <AdminHeader user={user} onLogout={handleLogout} />

        <MainContent>{children}</MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};
