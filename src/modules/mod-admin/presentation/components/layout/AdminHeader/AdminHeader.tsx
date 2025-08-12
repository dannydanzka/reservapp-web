'use client';

import { useState } from 'react';

import { Bell, ChevronDown, Menu, Search } from 'lucide-react';

import { AdminHeaderProps } from './AdminHeader.interfaces';

import {
  ActionsContainer,
  Avatar,
  AvatarText,
  ChevronIcon,
  HeaderContainer,
  LargeSeparator,
  MainContent,
  MenuButton,
  MenuDropdown,
  MenuOverlay,
  MobileMenuButton,
  NotificationButton,
  ProfileButton,
  ProfileDropdown,
  ProfileInfo,
  ProfileName,
  SearchForm,
  SearchIconWrapper,
  SearchInput,
  SearchLabel,
  Separator,
} from './AdminHeader.styled';

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleMobileMenu = () => {
    // Handle mobile menu logic
  };

  return (
    <HeaderContainer>
      {/* Mobile menu button */}
      <MobileMenuButton type='button' onClick={handleMobileMenu}>
        <Menu size={24} />
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

          {/* Profile dropdown */}
          <ProfileDropdown>
            <ProfileButton type='button' onClick={() => setShowUserMenu(!showUserMenu)}>
              <Avatar>
                <AvatarText>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarText>
              </Avatar>
              <ProfileInfo>
                <ProfileName>
                  {user.firstName} {user.lastName}
                </ProfileName>
                <ChevronIcon>
                  <ChevronDown size={20} />
                </ChevronIcon>
              </ProfileInfo>
            </ProfileButton>

            {showUserMenu && (
              <>
                {/* Overlay */}
                <MenuOverlay onClick={() => setShowUserMenu(false)} />

                {/* Dropdown */}
                <MenuDropdown>
                  <MenuButton
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                  >
                    Cerrar sesión
                  </MenuButton>
                </MenuDropdown>
              </>
            )}
          </ProfileDropdown>
        </ActionsContainer>
      </MainContent>
    </HeaderContainer>
  );
};
