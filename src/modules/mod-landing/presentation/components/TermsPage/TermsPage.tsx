'use client';

import React from 'react';

import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import { TermsPageProps } from './TermsPage.interfaces';

import {
  ContactButtons,
  ContactDescription,
  ContactSection,
  ContactTitle,
  ContentSection,
  DateSection,
  DateText,
  DateTitle,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  HighlightBox,
  HighlightText,
  HighlightTitle,
  PageContainer,
  SectionContainer,
  TermsContent,
  TermsList,
  TermsListItem,
  TermsSection,
  TermsSectionSubtitle,
  TermsSectionTitle,
  TermsText,
} from './TermsPage.styled';

export const TermsPage: React.FC<TermsPageProps> = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>{t('terms.hero.title')}</HeroTitle>
        <HeroSubtitle>{t('terms.hero.subtitle')}</HeroSubtitle>
      </HeroSection>

      <ContentSection $background='white'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.acceptance.title')}</TermsSectionTitle>
              <TermsText>{t('terms.acceptance.content')}</TermsText>
              <HighlightBox>
                <HighlightTitle>{t('terms.acceptance.highlight.title')}</HighlightTitle>
                <HighlightText>{t('terms.acceptance.highlight.content')}</HighlightText>
              </HighlightBox>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='gray'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.service.title')}</TermsSectionTitle>
              <TermsText>{t('terms.service.description')}</TermsText>
              <TermsSectionSubtitle>{t('terms.service.whatWeOffer.title')}</TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.service.whatWeOffer.platform')}</TermsListItem>
                <TermsListItem>{t('terms.service.whatWeOffer.management')}</TermsListItem>
                <TermsListItem>{t('terms.service.whatWeOffer.payments')}</TermsListItem>
                <TermsListItem>{t('terms.service.whatWeOffer.support')}</TermsListItem>
                <TermsListItem>{t('terms.service.whatWeOffer.marketing')}</TermsListItem>
              </TermsList>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='white'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.registration.title')}</TermsSectionTitle>
              <TermsText>{t('terms.registration.content')}</TermsText>
              <HighlightBox>
                <HighlightTitle>{t('terms.registration.highlight.title')}</HighlightTitle>
                <HighlightText>{t('terms.registration.highlight.content')}</HighlightText>
              </HighlightBox>
              <TermsSectionSubtitle>
                {t('terms.registration.requirements.title')}
              </TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.registration.requirements.accurate')}</TermsListItem>
                <TermsListItem>{t('terms.registration.requirements.current')}</TermsListItem>
                <TermsListItem>{t('terms.registration.requirements.security')}</TermsListItem>
                <TermsListItem>{t('terms.registration.requirements.compliance')}</TermsListItem>
              </TermsList>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='gray'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.fees.title')}</TermsSectionTitle>
              <TermsText>{t('terms.fees.description')}</TermsText>
              <HighlightBox>
                <HighlightTitle>{t('terms.fees.structure.title')}</HighlightTitle>
                <HighlightText>{t('terms.fees.structure.firstYear')}</HighlightText>
                <HighlightText>{t('terms.fees.structure.afterFirstYear')}</HighlightText>
              </HighlightBox>
              <TermsSectionSubtitle>{t('terms.fees.benefits.title')}</TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.fees.benefits.transparent')}</TermsListItem>
                <TermsListItem>{t('terms.fees.benefits.fast')}</TermsListItem>
                <TermsListItem>{t('terms.fees.benefits.lower')}</TermsListItem>
                <TermsListItem>{t('terms.fees.benefits.noHidden')}</TermsListItem>
              </TermsList>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='white'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.responsibilities.title')}</TermsSectionTitle>
              <TermsText>{t('terms.responsibilities.description')}</TermsText>
              <TermsSectionSubtitle>
                {t('terms.responsibilities.business.title')}
              </TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.responsibilities.business.accurate')}</TermsListItem>
                <TermsListItem>{t('terms.responsibilities.business.availability')}</TermsListItem>
                <TermsListItem>{t('terms.responsibilities.business.service')}</TermsListItem>
                <TermsListItem>{t('terms.responsibilities.business.legal')}</TermsListItem>
              </TermsList>
              <TermsSectionSubtitle>{t('terms.responsibilities.users.title')}</TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.responsibilities.users.respectful')}</TermsListItem>
                <TermsListItem>{t('terms.responsibilities.users.accurate')}</TermsListItem>
                <TermsListItem>{t('terms.responsibilities.users.comply')}</TermsListItem>
              </TermsList>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='gray'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.intellectual.title')}</TermsSectionTitle>
              <TermsText>{t('terms.intellectual.content')}</TermsText>
              <TermsSectionSubtitle>{t('terms.intellectual.platform.title')}</TermsSectionSubtitle>
              <TermsText>{t('terms.intellectual.platform.content')}</TermsText>
              <TermsSectionSubtitle>
                {t('terms.intellectual.userContent.title')}
              </TermsSectionSubtitle>
              <TermsText>{t('terms.intellectual.userContent.content')}</TermsText>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='white'>
        <SectionContainer>
          <TermsContent>
            <TermsSection>
              <TermsSectionTitle>{t('terms.liability.title')}</TermsSectionTitle>
              <TermsText>{t('terms.liability.description')}</TermsText>
              <HighlightBox>
                <HighlightTitle>{t('terms.liability.highlight.title')}</HighlightTitle>
                <HighlightText>{t('terms.liability.highlight.content')}</HighlightText>
              </HighlightBox>
              <TermsSectionSubtitle>{t('terms.liability.coverage.title')}</TermsSectionSubtitle>
              <TermsList>
                <TermsListItem>{t('terms.liability.coverage.platform')}</TermsListItem>
                <TermsListItem>{t('terms.liability.coverage.technical')}</TermsListItem>
                <TermsListItem>{t('terms.liability.coverage.mediation')}</TermsListItem>
              </TermsList>
            </TermsSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContentSection $background='gray'>
        <SectionContainer>
          <TermsContent>
            <DateSection>
              <DateTitle>{t('terms.date.title')}</DateTitle>
              <DateText>{t('terms.date.effective')}</DateText>
              <DateText>{t('terms.date.lastUpdated')}</DateText>
            </DateSection>
          </TermsContent>
        </SectionContainer>
      </ContentSection>

      <ContactSection>
        <SectionContainer>
          <ContactTitle>{t('terms.contact.title')}</ContactTitle>
          <ContactDescription>{t('terms.contact.description')}</ContactDescription>
          <ContactButtons>
            <Button href='/auth/register' size='large' variant='contained'>
              {t('terms.contact.registerButton')}
            </Button>
            <Button
              href='/contact'
              size='large'
              style={{ background: 'white', color: '#764ba2' }}
              variant='outlined'
            >
              {t('terms.contact.contactButton')}
            </Button>
          </ContactButtons>
        </SectionContainer>
      </ContactSection>
    </PageContainer>
  );
};
