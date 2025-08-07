'use client';

import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

import { useAuth } from '../providers/AuthProvider';

// Removed Logo component - replaced with styled text

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 0 ${({ theme }) => theme.spacing[6]};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoText = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-weight: 800;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.primary[700]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
    text-decoration: none;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UserRole = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LogoutButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.error[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error[700]};
  }
`;

/**
 * Admin header component with user info and logout functionality.
 */
export const AdminHeader: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Administrador';
      case 'MANAGER':
        return 'Gestor';
      case 'EMPLOYEE':
        return 'Empleado';
      default:
        return role;
    }
  };

  return (
    <HeaderContainer>
      <LogoText href='/admin'>ReservApp Admin</LogoText>

      <UserSection>
        {user && (
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserRole>{getRoleDisplayName(user.role)}</UserRole>
          </UserInfo>
        )}

        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
      </UserSection>
    </HeaderContainer>
  );
};
