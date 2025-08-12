import { styled } from 'styled-components';
import Link from 'next/link';

export const HeaderContainer = styled.header`
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  display: flex;
  height: 64px;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

export const LogoText = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Montserrat, sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
    text-decoration: none;
  }
`;

export const UserSection = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const UserInfo = styled.div`
  text-align: right;
`;

export const UserName = styled.div`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const UserRole = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-family: Lato, sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error[700]};
  }
`;
