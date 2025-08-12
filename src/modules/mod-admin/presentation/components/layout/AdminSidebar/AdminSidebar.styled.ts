import Link from 'next/link';
import styled from 'styled-components';

export const SidebarContainer = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    bottom: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    position: fixed;
    top: 0;
    width: 18rem;
  }
`;

export const SidebarContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 1rem;
  padding-top: 1.25rem;
`;

export const LogoContainer = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  padding: 0 1rem;
`;

export const LogoText = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.25rem;
  font-weight: 700;
`;

export const Navigation = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 2rem;
  padding: 0 0.75rem;
`;

export const NavigationLink = styled(Link)<{ $current: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.15s ease;
  text-decoration: none;

  ${({ $current, theme }) =>
    $current
      ? `
          background-color: ${theme.colors.primary[50]};
          color: ${theme.colors.primary[700]};
        `
      : `
          color: ${theme.colors.secondary[700]};
          
          &:hover {
            background-color: ${theme.colors.secondary[50]};
            color: ${theme.colors.secondary[900]};
          }
        `}
`;

export const NavigationIcon = styled.div<{ $current: boolean }>`
  color: ${({ $current, theme }) =>
    $current ? theme.colors.primary[500] : theme.colors.secondary[400]};
  flex-shrink: 0;
  height: 1.25rem;
  margin-right: 0.75rem;
  width: 1.25rem;

  ${NavigationLink}:hover & {
    color: ${({ $current, theme }) =>
      $current ? theme.colors.primary[500] : theme.colors.secondary[500]};
  }
`;

export const UserSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  flex-shrink: 0;
  padding: 1rem;
`;

export const UserContainer = styled.div`
  display: block;
  flex-shrink: 0;
  width: 100%;
`;

export const UserInfo = styled.div`
  align-items: center;
  display: flex;
`;

export const UserAvatar = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  display: flex;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
`;

export const AvatarText = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const UserDetails = styled.div`
  flex: 1;
  margin-left: 0.75rem;
`;

export const UserName = styled.p`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  transition: color 0.15s ease;

  ${UserContainer}:hover & {
    color: ${({ theme }) => theme.colors.secondary[900]};
  }
`;

export const UserRole = styled.p`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  transition: color 0.15s ease;

  ${UserContainer}:hover & {
    color: ${({ theme }) => theme.colors.secondary[700]};
  }
`;

export const LogoutButton = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.secondary[400]};
  margin-left: 0.5rem;
  padding: 0.25rem;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[100]};
    color: ${({ theme }) => theme.colors.secondary[600]};
  }
`;
