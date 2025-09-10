'use client';

import React from 'react';

import { Menu } from 'lucide-react';

import type { AdminHeaderProps } from './AdminHeader.interfaces';

import {
  HeaderContainer,
  LogoText,
  MobileMenuButton,
  UserInfo,
  UserName,
  UserRole,
  UserSection,
} from './AdminHeader.styled';

/**
 * Admin header component with user info and mobile menu toggle.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu, user }) => {
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
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <MobileMenuButton type='button' onClick={onToggleMobileMenu}>
          <Menu size={18} />
        </MobileMenuButton>
        <LogoText href='/admin'>ReservApp Admin</LogoText>
      </div>

      <UserSection>
        {user && (
          <UserInfo>
            <UserName>{user.name || `${user.firstName} ${user.lastName}`}</UserName>
            <UserRole>{getRoleDisplayName(user.role)}</UserRole>
          </UserInfo>
        )}
      </UserSection>
    </HeaderContainer>
  );
};
