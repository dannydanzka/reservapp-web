'use client';

import React from 'react';

import Link from 'next/link';
import styled from 'styled-components';

import { useTranslation } from '@/libs/i18n';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.secondary[900]};
  color: ${({ theme }) => theme.colors.secondary[300]};
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[6]};
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary[400]};
  text-decoration: none;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[700]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;

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
            <FooterLink href='/landing#integrations'>
              {t('landing.footer.links.integrations')}
            </FooterLink>
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
            <FooterLink href='/api'>{t('landing.footer.links.apiReference')}</FooterLink>
            <FooterLink href='/status'>{t('landing.footer.links.systemStatus')}</FooterLink>
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
