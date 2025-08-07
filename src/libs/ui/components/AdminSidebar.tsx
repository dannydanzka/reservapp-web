'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${({ theme }) => theme.colors.secondary[800]};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]} 0;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none; // TODO: Add mobile menu
  }
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.secondary[400]};
  padding: 0 ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.secondary[300]};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[600] : 'transparent'};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-right: 3px solid
    ${({ $isActive, theme }) => ($isActive ? theme.colors.primary[400] : 'transparent')};

  &:hover {
    background-color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary[700] : theme.colors.secondary[700]};
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

const NavIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const NavText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

interface NavItemData {
  href: string;
  icon: string;
  label: string;
}

interface NavSectionData {
  title: string;
  items: NavItemData[];
}

const navigationData: NavSectionData[] = [
  {
    items: [
      { href: '/admin', icon: '📊', label: 'Dashboard' },
      { href: '/admin/reservations', icon: '📅', label: 'Reservations' },
      { href: '/admin/users', icon: '👥', label: 'Users' },
    ],
    title: 'Main',
  },
  {
    items: [
      { href: '/admin/services', icon: '🛎️', label: 'Services' },
      { href: '/admin/resources', icon: '🏢', label: 'Resources' },
      { href: '/admin/categories', icon: '🏷️', label: 'Categories' },
      { href: '/admin/reports', icon: '📈', label: 'Reports' },
    ],
    title: 'Content',
  },
  {
    items: [
      { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
      { href: '/admin/integrations', icon: '🔌', label: 'Integrations' },
      { href: '/admin/logs', icon: '📝', label: 'System Logs' },
    ],
    title: 'Settings',
  },
];

/**
 * Admin sidebar navigation component.
 */
export const AdminSidebar: React.FC = () => {
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
