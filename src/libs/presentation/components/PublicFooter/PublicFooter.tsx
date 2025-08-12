'use client';

import React from 'react';

import { useTranslation } from '@i18n/index';

import {
  Copyright,
  FooterBottom,
  FooterContainer,
  FooterContent,
  FooterGrid,
  FooterLink,
  FooterSection,
  SocialLinks,
} from './PublicFooter.styled';

/**
 * Public footer component for landing and marketing pages.
 */
export const PublicFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>{t('landing.footer.company')}</h3>
            <p>{t('landing.footer.description')}</p>
          </FooterSection>

          <FooterSection>
            <h3>{t('landing.footer.sections.product')}</h3>
            <FooterLink href='/landing#features'>{t('landing.footer.links.features')}</FooterLink>
            <FooterLink href='/landing#pricing'>{t('landing.footer.links.pricing')}</FooterLink>
            <FooterLink href='/auth/register'>{t('landing.footer.links.getStarted')}</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>{t('landing.footer.sections.company')}</h3>
            <FooterLink href='/about'>{t('landing.footer.links.about')}</FooterLink>
            <FooterLink href='/careers'>{t('landing.footer.links.careers')}</FooterLink>
            <FooterLink href='/blog'>{t('landing.footer.links.blog')}</FooterLink>
            <FooterLink href='/contact'>{t('landing.footer.links.contact')}</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>{t('landing.footer.sections.support')}</h3>
            <FooterLink href='/help'>{t('landing.footer.links.helpCenter')}</FooterLink>
            <FooterLink href='/docs'>{t('landing.footer.links.documentation')}</FooterLink>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</Copyright>

          <SocialLinks>
            <FooterLink href='/privacy'>{t('landing.footer.links.privacy')}</FooterLink>
            <FooterLink href='/terms'>{t('landing.footer.links.terms')}</FooterLink>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};
