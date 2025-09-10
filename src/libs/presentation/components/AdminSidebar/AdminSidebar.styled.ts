import { styled } from 'styled-components';
import Link from 'next/link';

export const SidebarContainer = styled.aside<{ $isOpen?: boolean }>`
  background: ${({ theme }) => theme.colors.secondary[800]};
  color: ${({ theme }) => theme.colors.white};
  height: 100vh;
  left: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  position: fixed;
  top: 0;
  transition: transform 0.3s ease;
  width: 288px;
  z-index: 30;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 250px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
    height: calc(100vh - 56px);
    padding: ${({ theme }) => theme.spacing[4]} 0;
    top: 56px; /* Below fixed header */
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    z-index: 1001;
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

export const MobileMenuButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: none;
  height: 48px;
  justify-content: center;
  left: ${({ theme }) => theme.spacing[4]};
  position: fixed;
  top: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s ease;
  width: 48px;
  z-index: 1001;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
    transform: scale(1.05);
  }
`;

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  background: rgb(0 0 0 / 0.5);
  inset: 56px 0 0;
  display: none;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  -webkit-overflow-scrolling: touch;
  position: fixed; /* Below fixed header */
  transition: all 0.3s ease;
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

export const LogoutSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[600]};
  margin-top: auto;
  padding: ${({ theme }) => theme.spacing[4]} 0;
`;

export const LogoutButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[300]};
  cursor: pointer;
  display: flex;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  text-decoration: none;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error[600]};
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing[3]};
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;
