import { styled } from 'styled-components';
import Link from 'next/link';

export const SidebarContainer = styled.aside`
  background: ${({ theme }) => theme.colors.secondary[800]};
  color: ${({ theme }) => theme.colors.white};
  height: 100vh;
  left: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  position: fixed;
  top: 0;
  width: 288px;
  z-index: 30;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none; /* TODO: Add mobile menu */
  }
`;

export const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[400]};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  padding: 0 ${({ theme }) => theme.spacing[6]};
  text-transform: uppercase;
`;

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const NavLink = styled(Link)<{ $isActive: boolean }>`
  align-items: center;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[600] : 'transparent'};
  border-right: 3px solid
    ${({ $isActive, theme }) => ($isActive ? theme.colors.primary[400] : 'transparent')};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.secondary[300]};
  display: flex;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary[700] : theme.colors.secondary[700]};
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export const NavIcon = styled.span`
  font-size: 1.125rem;
  margin-right: ${({ theme }) => theme.spacing[3]};
`;

export const NavText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;
