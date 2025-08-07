'use client';

import React from 'react';

import { Facebook, Instagram, Linkedin, Music, Twitter } from 'lucide-react';
import Link from 'next/link';
import styled from 'styled-components';

// Removed Logo component - replaced with styled text

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-right: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.secondary[600]};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-1px);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const LogoText = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-weight: 800;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
    text-decoration: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const Button = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;

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

/**
 * Public header component for landing and marketing pages.
 */
export const PublicHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoText href='/landing'>ReservApp</LogoText>

        <Navigation>
          <NavLink href='/services'>Servicios</NavLink>
          <NavLink href='/business'>Negocios</NavLink>
          <NavLink href='/contact'>Contacto</NavLink>
        </Navigation>

        <RightSection>
          <SocialLinks>
            <SocialLink
              href='https://facebook.com/reservapp'
              rel='noopener noreferrer'
              target='_blank'
              title='Facebook'
            >
              <Facebook size={16} />
            </SocialLink>
            <SocialLink
              href='https://instagram.com/reservapp'
              rel='noopener noreferrer'
              target='_blank'
              title='Instagram'
            >
              <Instagram size={16} />
            </SocialLink>
            <SocialLink
              href='https://twitter.com/reservapp'
              rel='noopener noreferrer'
              target='_blank'
              title='Twitter'
            >
              <Twitter size={16} />
            </SocialLink>
            <SocialLink
              href='https://linkedin.com/company/reservapp'
              rel='noopener noreferrer'
              target='_blank'
              title='LinkedIn'
            >
              <Linkedin size={16} />
            </SocialLink>
            <SocialLink
              href='https://tiktok.com/@reservapp'
              rel='noopener noreferrer'
              target='_blank'
              title='TikTok'
            >
              <Music size={16} />
            </SocialLink>
          </SocialLinks>

          <AuthButtons>
            <Button $variant='secondary' href='/auth/login'>
              Portal de Negocios
            </Button>
            <Button $variant='primary' href='/auth/register'>
              Registrar Negocio
            </Button>
          </AuthButtons>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
