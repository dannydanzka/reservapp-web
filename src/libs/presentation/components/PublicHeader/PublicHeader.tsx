'use client';

import React from 'react';

import { Facebook, Instagram, Linkedin, Music, Twitter } from 'lucide-react';

import {
  AuthButtons,
  Button,
  HeaderContainer,
  HeaderContent,
  LogoText,
  Navigation,
  NavLink,
  RightSection,
  SocialLink,
  SocialLinks,
} from './PublicHeader.styled';

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
          <NavLink href='/api-docs'>API</NavLink>
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
