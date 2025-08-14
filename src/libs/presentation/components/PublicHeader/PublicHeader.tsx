'use client';

import React from 'react';

import { Facebook, Instagram, Linkedin, Music, Twitter } from 'lucide-react';

import { useTranslation } from '@i18n/index';

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
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoText href='/landing'>{t('common.appName')}</LogoText>

        <Navigation>
          <NavLink href='/landing'>{t('navigation.home')}</NavLink>
          <NavLink href='/business'>{t('navigation.business')}</NavLink>
          <NavLink href='/contact'>{t('navigation.contact')}</NavLink>
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
              {t('navigation.businessPortal')}
            </Button>
            <Button $variant='primary' href='/auth/register'>
              {t('navigation.registerBusiness')}
            </Button>
          </AuthButtons>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
