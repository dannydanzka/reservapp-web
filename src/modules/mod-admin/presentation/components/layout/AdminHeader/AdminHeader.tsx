'use client';

import { Bell, Menu, Search } from 'lucide-react';

import { AdminHeaderProps } from './AdminHeader.interfaces';

import {
  ActionsContainer,
  Avatar,
  AvatarText,
  HeaderContainer,
  LargeSeparator,
  MainContent,
  MobileMenuButton,
  NotificationButton,
  ProfileInfo,
  ProfileName,
  SearchForm,
  SearchIconWrapper,
  SearchInput,
  SearchLabel,
  Separator,
} from './AdminHeader.styled';

interface AdminHeaderWithToggleProps extends AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderWithToggleProps> = ({
  onLogout,
  onToggleMobileMenu,
  user,
}) => {
  return (
    <HeaderContainer>
      {/* Mobile menu button */}
      <MobileMenuButton type='button' onClick={onToggleMobileMenu}>
        <Menu size={20} />
      </MobileMenuButton>

      {/* Separator */}
      <Separator />

      <MainContent>
        {/* Search */}
        <SearchForm action='#' method='GET'>
          <SearchLabel htmlFor='search-field'>Buscar</SearchLabel>
          <SearchIconWrapper>
            <Search size={20} />
          </SearchIconWrapper>
          <SearchInput id='search-field' name='search' placeholder='Buscar...' type='search' />
        </SearchForm>

        <ActionsContainer>
          {/* Notifications */}
          <NotificationButton type='button'>
            <Bell size={24} />
          </NotificationButton>

          {/* Separator */}
          <LargeSeparator />

          {/* Profile info only - no dropdown */}
          <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
            <Avatar>
              <AvatarText>
                {user.firstName?.[0] || user.name?.[0] || 'U'}
                {user.lastName?.[0] || user.name?.split(' ')[1]?.[0] || 'U'}
              </AvatarText>
            </Avatar>
            <ProfileInfo>
              <ProfileName>
                {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
              </ProfileName>
            </ProfileInfo>
          </div>
        </ActionsContainer>
      </MainContent>
    </HeaderContainer>
  );
};
