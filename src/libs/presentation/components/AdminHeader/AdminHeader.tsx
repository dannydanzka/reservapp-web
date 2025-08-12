'use client';

import React from 'react';

import type { AdminHeaderProps } from './AdminHeader.interfaces';

import {
  HeaderContainer,
  LogoText,
  LogoutButton,
  UserInfo,
  UserName,
  UserRole,
  UserSection,
} from './AdminHeader.styled';

/**
 * Admin header component with user info and logout functionality.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, user }) => {
  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
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
