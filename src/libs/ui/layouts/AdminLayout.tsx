'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
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
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

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
  const { isLoading, status, user } = useAuth();
  const router = useRouter();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size='large' />
      </LoadingContainer>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  // Check if user has admin privileges
  if (user && user.role !== 'admin') {
    router.push('/auth/login'); // or unauthorized page
    return null;
  }

  return (
    <LayoutContainer>
      <AdminHeader />
      <ContentContainer>
        <AdminSidebar />
        <MainContent>{children}</MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};
