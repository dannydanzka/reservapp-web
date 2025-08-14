'use client';

import React, { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { UserRoleEnum } from '@prisma/client';

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
      {
        href: '/admin',
        icon: '📊',
        label: 'Dashboard',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/business-accounts',
        icon: '🏢',
        label: 'Negocios',
        roles: [UserRoleEnum.SUPER_ADMIN],
      },
      {
        href: '/admin/business-account',
        icon: '🏪',
        label: 'Mi Negocio',
        roles: [UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/users',
        icon: '👥',
        label: 'Usuarios',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/venues',
        icon: '🏨',
        label: 'Venues',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/services',
        icon: '🛎️',
        label: 'Servicios',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/reservations',
        icon: '📅',
        label: 'Reservas',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
    ],
    title: 'Principal',
  },
  {
    items: [
      {
        href: '/admin/contact-forms',
        icon: '📧',
        label: 'Formularios de Contacto',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
      {
        href: '/admin/reports',
        icon: '📈',
        label: 'Reportes',
        roles: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN],
      },
    ],
    title: 'Contenido',
  },
  {
    items: [
      {
        href: '/admin/payments',
        icon: '💳',
        label: 'Registro de pagos',
        roles: [UserRoleEnum.SUPER_ADMIN],
      },
    ],
    roles: [UserRoleEnum.SUPER_ADMIN],
    title: 'Pagos',
  },
  // {
  //   items: [
  //     {
  //       href: '/admin/system-logs',
  //       icon: '📋',
  //       label: 'Logs del Sistema',
  //       roles: [UserRoleEnum.SUPER_ADMIN],
  //     },
  //   ],
  //   roles: [UserRoleEnum.SUPER_ADMIN],
  //   title: 'Sistema',
  // },
];

/**
 * Admin sidebar navigation component with role-based visibility.
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ navigation, onLogout, user }) => {
  const pathname = usePathname();
  const userRole = user?.role as UserRoleEnum;

  // Filter navigation sections and items based on user role
  const visibleNavigation = useMemo(() => {
    if (!userRole) return [];

    return navigationData
      .filter((section) => {
        // If section has role restrictions, check if user has access
        if (section.roles && section.roles.length > 0) {
          return section.roles.includes(userRole);
        }
        // If no role restrictions on section, check individual items
        return section.items.some((item) => !item.roles || item.roles.includes(userRole));
      })
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.roles || item.roles.includes(userRole)),
      }))
      .filter((section) => section.items.length > 0); // Only show sections with visible items
  }, [userRole]);

  return (
    <SidebarContainer>
      {visibleNavigation.map((section) => (
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
