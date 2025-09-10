import { styled } from 'styled-components';
import Link from 'next/link';

export const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
`;

export const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  height: 64px;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing[4]};
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }

  @media (width <= 480px) {
    gap: ${({ theme }) => theme.spacing[1]};
    padding: 0 ${({ theme }) => theme.spacing[2]};
  }
`;

export const Navigation = styled.nav`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (width <= 320px) {
    display: none; /* Hide only on very tiny screens, TODO: Add hamburger menu */
  }
`;

export const SocialLinks = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-right: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const SocialLink = styled.a`
  align-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.secondary[600]};
  display: flex;
  height: 32px;
  justify-content: center;
  transition: all 0.15s ease;
  width: 32px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

export const RightSection = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
  }
`;

export const AuthButtons = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing[2]};
  }

  @media (width <= 480px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const LogoText = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  text-decoration: none;
  transition: color 0.15s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
    text-decoration: none;
  }
`;

export const Button = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  }

  @media (width <= 480px) {
    font-size: 0.75rem;
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  }

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};

    &:hover {
      background-color: ${theme.colors.primary[700]};
      color: ${theme.colors.white};
      text-decoration: none;
    }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};

    &:hover {
      background-color: ${theme.colors.secondary[50]};
      color: ${theme.colors.secondary[900]};
      text-decoration: none;
    }
  `}
`;
