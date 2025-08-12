'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import type { AdminSidebarProps, NavSectionData } from './AdminSidebar.interfaces';

import {
  NavIcon,
  NavItem,
  NavLink,
  NavList,
  NavSection,
  NavText,
  SectionTitle,
  SidebarContainer,
} from './AdminSidebar.styled';

const navigationData: NavSectionData[] = [
  {
    items: [
      { href: '/admin', icon: '📊', label: 'Dashboard' },
      { href: '/admin/reservations', icon: '📅', label: 'Reservas' },
      { href: '/admin/venues', icon: '🏨', label: 'Venues' },
      { href: '/admin/users', icon: '👥', label: 'Usuarios' },
    ],
    title: 'Principal',
  },
  {
    items: [
      { href: '/admin/services', icon: '🛎️', label: 'Servicios' },
      { href: '/api-docs', icon: '📚', label: 'API Docs' },
      { href: '/admin/reports', icon: '📈', label: 'Reportes' },
      { href: '/admin/analytics', icon: '📊', label: 'Analytics' },
    ],
    title: 'Contenido',
  },
  {
    items: [
      { href: '/admin/settings', icon: '⚙️', label: 'Configuración' },
      { href: '/admin/integrations', icon: '🔌', label: 'Integraciones' },
      { href: '/admin/logs', icon: '📝', label: 'Logs del Sistema' },
    ],
    title: 'Sistema',
  },
];

/**
 * Admin sidebar navigation component.
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ navigation, onLogout, user }) => {
  const pathname = usePathname();

  return (
    <SidebarContainer>
      {navigationData.map((section) => (
        <NavSection key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>
          <NavList>
            {section.items.map((item) => (
              <NavItem key={item.href}>
                <NavLink $isActive={pathname === item.href} href={item.href}>
                  <NavIcon>{item.icon}</NavIcon>
                  <NavText>{item.label}</NavText>
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </NavSection>
      ))}
    </SidebarContainer>
  );
};
