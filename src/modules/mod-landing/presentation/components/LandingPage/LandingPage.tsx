'use client';

import React from 'react';

import { Apple, Play, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import {
  AppDownloadSection,
  AppDownloadText,
  AppDownloadTitle,
  AppStoreButton,
  AppStoreButtons,
  AppStoreText,
  CTASection,
  CTASubtitle,
  CTATitle,
  FeatureCard,
  FeatureDescription,
  FeatureIcon,
  FeaturesGrid,
  FeaturesSection,
  FeatureTitle,
  HeroButtons,
  HeroContent,
  HeroGrid,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  LandingContainer,
  MobileAppShowcase,
  MobileScreenshotWrapper,
  PlanFeature,
  PlanFeatures,
  PlanName,
  PlanPeriod,
  PlanPrice,
  PopularBadge,
  PricingCard,
  PricingGrid,
  PricingSection,
  PricingSection2,
  ScreenshotImage,
  SectionSubtitle,
  SectionTitle,
  ServiceCard,
  ServiceDescription,
  ServiceIcon,
  ServicesGrid,
  ServicesSection,
  ServiceTitle,
} from './LandingPage.styled';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleBusinessRegister = () => {
    router.push('/auth/user-register');
  };

  const handleBusinessSignup = () => {
    router.push('/auth/register');
  };

  return (
    <LandingContainer>
      <HeroSection>
        <HeroGrid>
          <HeroContent>
            <HeroTitle>{t('landing.hero.title')}</HeroTitle>
            <HeroSubtitle>
              {t('landing.hero.subtitle')}
              <br />
              <strong>🚀 {t('landing.hero.mobileAppAvailable')}</strong>
            </HeroSubtitle>
            <HeroButtons>
              <Button size='large' variant='contained' onClick={handleBusinessRegister}>
                👤 {t('landing.hero.registerUser')}
              </Button>
              <Button size='large' variant='outlined' onClick={handleBusinessSignup}>
                🏨 {t('landing.hero.registerBusiness')}
              </Button>
            </HeroButtons>

            <AppDownloadSection>
              <AppDownloadTitle>
                <Smartphone size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('landing.mobileApp.download.downloadTitle')}
              </AppDownloadTitle>
              <AppDownloadText>{t('landing.mobileApp.download.downloadSubtitle')}</AppDownloadText>
              <AppStoreButtons>
                <AppStoreButton>
                  <Apple size={20} />
                  <div>
                    <AppStoreText>{t('landing.mobileApp.download.appStore')}</AppStoreText>
                  </div>
                </AppStoreButton>
                <AppStoreButton>
                  <Play size={20} />
                  <div>
                    <AppStoreText>{t('landing.mobileApp.download.googlePlay')}</AppStoreText>
                  </div>
                </AppStoreButton>
              </AppStoreButtons>
            </AppDownloadSection>
          </HeroContent>

          <MobileAppShowcase>
            <MobileScreenshotWrapper>
              <ScreenshotImage
                alt='ReservApp - Aplicación Móvil para Reservas Premium'
                loading='eager'
                src='/images/brand/mobile-mockup.png'
              />
            </MobileScreenshotWrapper>
          </MobileAppShowcase>
        </HeroGrid>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>{t('landing.features.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.features.subtitle')}</SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>{t('landing.features.easyBooking.title')}</FeatureTitle>
            <FeatureDescription>{t('landing.features.easyBooking.description')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🕒</FeatureIcon>
            <FeatureTitle>{t('landing.features.realTimeAvailability.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.realTimeAvailability.description')}
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🏨</FeatureIcon>
            <FeatureTitle>{t('landing.features.uniqueVenues.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.uniqueVenues.description')}
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💳</FeatureIcon>
            <FeatureTitle>{t('landing.features.securePayments.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.securePayments.description')}
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>{t('landing.features.smartNotifications.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.smartNotifications.description')}
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🌱</FeatureIcon>
            <FeatureTitle>{t('landing.features.localTourism.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.localTourism.description')}
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ServicesSection>
        <SectionTitle>{t('landing.services.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.services.subtitle')}</SectionSubtitle>
        <ServicesGrid>
          <ServiceCard>
            <ServiceIcon>🏨</ServiceIcon>
            <ServiceTitle>{t('landing.services.accommodation.title')}</ServiceTitle>
            <ServiceDescription>
              {t('landing.services.accommodation.description')}
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon>🍽️</ServiceIcon>
            <ServiceTitle>{t('landing.services.dining.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.dining.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon>💆</ServiceIcon>
            <ServiceTitle>{t('landing.services.wellness.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.wellness.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon>🧳</ServiceIcon>
            <ServiceTitle>{t('landing.services.tours.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.tours.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon>🎉</ServiceIcon>
            <ServiceTitle>{t('landing.services.events.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.events.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon>🎭</ServiceIcon>
            <ServiceTitle>{t('landing.services.entertainment.title')}</ServiceTitle>
            <ServiceDescription>
              {t('landing.services.entertainment.description')}
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      <PricingSection>
        <SectionTitle>{t('landing.pricing.userModel.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.pricing.userModel.subtitle')}</SectionSubtitle>
        <PricingGrid>
          <PricingCard>
            <PlanName>{t('landing.pricing.userModel.freePlan.name')}</PlanName>
            <PlanPrice>{t('landing.pricing.userModel.freePlan.price')}</PlanPrice>
            <PlanPeriod>{t('landing.pricing.userModel.freePlan.period')}</PlanPeriod>
            <PlanFeatures>
              {(
                t('landing.pricing.userModel.freePlan.features', {
                  returnObjects: true,
                } as any) as string[]
              ).map((feature: string, index: number) => (
                <PlanFeature key={index}>{feature}</PlanFeature>
              ))}
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='outlined'
              onClick={handleBusinessRegister}
            >
              {t('landing.pricing.userModel.freePlan.button')}
            </Button>
          </PricingCard>

          <PricingCard $featured>
            <PopularBadge>{t('landing.pricing.userModel.premiumPlan.badge')}</PopularBadge>
            <PlanName>{t('landing.pricing.userModel.premiumPlan.name')}</PlanName>
            <PlanPrice>{t('landing.pricing.userModel.premiumPlan.price')}</PlanPrice>
            <PlanPeriod>{t('landing.pricing.userModel.premiumPlan.period')}</PlanPeriod>
            <PlanFeatures>
              {(
                t('landing.pricing.userModel.premiumPlan.features', {
                  returnObjects: true,
                } as any) as string[]
              ).map((feature: string, index: number) => (
                <PlanFeature key={index}>{feature}</PlanFeature>
              ))}
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='contained'
              onClick={handleBusinessRegister}
            >
              {t('landing.pricing.userModel.premiumPlan.button')}
            </Button>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      <PricingSection2>
        <SectionTitle>{t('landing.pricing.venueModel.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.pricing.venueModel.subtitle')}</SectionSubtitle>
        <PricingGrid>
          <PricingCard>
            <PlanName>{t('landing.pricing.venueModel.firstYear.name')}</PlanName>
            <PlanPrice>{t('landing.pricing.venueModel.firstYear.price')}</PlanPrice>
            <PlanPeriod>{t('landing.pricing.venueModel.firstYear.period')}</PlanPeriod>
            <PlanFeatures>
              {(
                t('landing.pricing.venueModel.firstYear.features', {
                  returnObjects: true,
                } as any) as string[]
              ).map((feature: string, index: number) => (
                <PlanFeature key={index}>{feature}</PlanFeature>
              ))}
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='outlined'
              onClick={handleBusinessSignup}
            >
              {t('landing.pricing.venueModel.firstYear.button')}
            </Button>
          </PricingCard>

          <PricingCard $featured>
            <PopularBadge>{t('landing.pricing.venueModel.standardRate.badge')}</PopularBadge>
            <PlanName>{t('landing.pricing.venueModel.standardRate.name')}</PlanName>
            <PlanPrice>{t('landing.pricing.venueModel.standardRate.price')}</PlanPrice>
            <PlanPeriod>{t('landing.pricing.venueModel.standardRate.period')}</PlanPeriod>
            <PlanFeatures>
              {(
                t('landing.pricing.venueModel.standardRate.features', {
                  returnObjects: true,
                } as any) as string[]
              ).map((feature: string, index: number) => (
                <PlanFeature key={index}>{feature}</PlanFeature>
              ))}
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='contained'
              onClick={handleBusinessSignup}
            >
              {t('landing.pricing.venueModel.standardRate.button')}
            </Button>
          </PricingCard>
        </PricingGrid>
      </PricingSection2>

      <CTASection>
        <CTATitle>{t('landing.cta.title')}</CTATitle>
        <CTASubtitle>{t('landing.cta.subtitle')}</CTASubtitle>
        <HeroButtons>
          <Button size='large' variant='contained' onClick={handleBusinessRegister}>
            👤 {t('landing.cta.userButton')}
          </Button>
          <Button size='large' variant='contained' onClick={handleBusinessSignup}>
            🏨 {t('landing.cta.businessButton')}
          </Button>
        </HeroButtons>
      </CTASection>
    </LandingContainer>
  );
};
