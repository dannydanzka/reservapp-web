'use client';

import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

// Removed Logo component - replaced with styled text

interface AuthLayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[50]} 0%,
    ${({ theme }) => theme.colors.secondary[100]} 100%
  );
  padding: ${({ theme }) => theme.spacing[4]};
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const LogoText = styled(Link)`
  font-family: '"Montserrat"', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  transition: color 0.15s ease;
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
    text-decoration: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.875rem;
  }
`;

const LogoSubtext = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin-bottom: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const BusinessPortalLabel = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const BusinessPortalText = styled.span`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.875rem;
  font-weight: 500;
`;

const BackToHome = styled(Link)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[6]};
  left: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: static;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

/**
 * Authentication layout for login and registration pages.
 * Provides centered card layout with branding.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <BackToHome href='/landing'>← Volver al Inicio</BackToHome>
      <LayoutContainer>
        <AuthCard>
          <Logo>
            <LogoText href='/landing'>ReservApp</LogoText>
            <LogoSubtext>Portal de Negocios</LogoSubtext>
          </Logo>
          <BusinessPortalLabel>
            <BusinessPortalText>🏢 Portal Exclusivo para Negocios</BusinessPortalText>
          </BusinessPortalLabel>
          {children}
        </AuthCard>
      </LayoutContainer>
    </>
  );
};
