'use client';

import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { AdminSidebarProps } from './AdminSidebar.interfaces';

import {
  AvatarText,
  LogoContainer,
  LogoText,
  LogoutButton,
  MainContent,
  Navigation,
  NavigationIcon,
  NavigationLink,
  SidebarContainer,
  SidebarContent,
  UserAvatar,
  UserContainer,
  UserDetails,
  UserInfo,
  UserName,
  UserRole,
  UserSection,
} from './AdminSidebar.styled';

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ navigation, onLogout, user }) => {
  const pathname = usePathname();

  // Update current state based on pathname
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: pathname === item.href || pathname.startsWith(item.href + '/'),
  }));

  return (
    <SidebarContainer>
      <SidebarContent>
        <MainContent>
          {/* Logo */}
          <LogoContainer>
            <LogoText>ReservApp Admin</LogoText>
          </LogoContainer>

          {/* Navigation */}
          <Navigation>
            {updatedNavigation.map((item) => (
              <NavigationLink $current={item.current} href={item.href} key={item.name}>
                <NavigationIcon $current={item.current}>
                  <item.icon size={20} />
                </NavigationIcon>
                {item.name}
              </NavigationLink>
            ))}
          </Navigation>
        </MainContent>

        {/* User info */}
        <UserSection>
          <UserContainer>
            <UserInfo>
              <UserAvatar>
                <AvatarText>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarText>
              </UserAvatar>
              <UserDetails>
                <UserName>
                  {user.firstName} {user.lastName}
                </UserName>
                <UserRole>{user.role}</UserRole>
              </UserDetails>
              <LogoutButton title='Cerrar sesión' onClick={onLogout}>
                <LogOut size={20} />
              </LogoutButton>
            </UserInfo>
          </UserContainer>
        </UserSection>
      </SidebarContent>
    </SidebarContainer>
  );
};
