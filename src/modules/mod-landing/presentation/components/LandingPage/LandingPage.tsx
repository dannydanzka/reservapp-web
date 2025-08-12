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
  CTASection,
  CTASubtitle,
  CTATitle,
  DownloadButton,
  DownloadButtons,
  FeatureCard,
  FeatureDescription,
  FeatureIcon,
  FeatureItem,
  FeaturesGrid,
  FeaturesSection,
  FeatureText,
  FeatureTitle,
  HeroButtons,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  HowItWorksSection,
  LandingContainer,
  MobileAppContainer,
  MobileAppContent,
  MobileAppDescription,
  MobileAppFeatures,
  MobileAppScreenshots,
  MobileAppSection,
  MobileAppTitle,
  MobileDeviceMockup,
  MobileFeatureIcon,
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
  ScreenshotImage,
  SectionSubtitle,
  SectionTitle,
  ServiceCard,
  ServiceDescription,
  ServiceIcon,
  ServicesGrid,
  ServicesSection,
  ServiceTitle,
  StepCard,
  StepDescription,
  StepNumber,
  StepsContainer,
  StepTitle,
} from './LandingPage.styled';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleFreeUserRegister = () => {
    router.push('/auth/user-register?plan=free');
  };

  const handlePremiumUserRegister = () => {
    router.push('/auth/user-register?plan=premium');
  };

  const handleViewServices = () => {
    router.push('/services');
  };

  const handleBusinessSignup = () => {
    router.push('/auth/register');
  };

  const handleBusinessLogin = () => {
    router.push('/auth/login');
  };

  return (
    <LandingContainer>
      <HeroSection>
        <HeroTitle>{t('landing.hero.title')}</HeroTitle>
        <HeroSubtitle>{t('landing.hero.subtitle')}</HeroSubtitle>
        <HeroButtons>
          <Button size='large' variant='contained' onClick={handleViewServices}>
            Ver Servicios
          </Button>
          <Button size='large' variant='outlined' onClick={handleBusinessSignup}>
            Registrar mi Negocio
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
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>App Store</div>
              </div>
            </AppStoreButton>
            <AppStoreButton>
              <Play size={20} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Google Play</div>
              </div>
            </AppStoreButton>
          </AppStoreButtons>
        </AppDownloadSection>
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
            <FeatureIcon>🌮</FeatureIcon>
            <FeatureTitle>{t('landing.features.localServices.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.localServices.description')}
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
            <FeatureIcon>🎧</FeatureIcon>
            <FeatureTitle>{t('landing.features.customerSupport.title')}</FeatureTitle>
            <FeatureDescription>
              {t('landing.features.customerSupport.description')}
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ServicesSection>
        <SectionTitle>{t('landing.services.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.services.subtitle')}</SectionSubtitle>
        <ServicesGrid>
          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>🏨</ServiceIcon>
            <ServiceTitle>{t('landing.services.accommodation.title')}</ServiceTitle>
            <ServiceDescription>
              {t('landing.services.accommodation.description')}
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>🍽️</ServiceIcon>
            <ServiceTitle>{t('landing.services.dining.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.dining.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>💆</ServiceIcon>
            <ServiceTitle>{t('landing.services.wellness.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.wellness.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>🧳</ServiceIcon>
            <ServiceTitle>{t('landing.services.tours.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.tours.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>🎉</ServiceIcon>
            <ServiceTitle>{t('landing.services.events.title')}</ServiceTitle>
            <ServiceDescription>{t('landing.services.events.description')}</ServiceDescription>
          </ServiceCard>

          <ServiceCard style={{ cursor: 'pointer' }} onClick={handleViewServices}>
            <ServiceIcon>🎭</ServiceIcon>
            <ServiceTitle>{t('landing.services.entertainment.title')}</ServiceTitle>
            <ServiceDescription>
              {t('landing.services.entertainment.description')}
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      <HowItWorksSection>
        <SectionTitle>{t('landing.howItWorks.title')}</SectionTitle>
        <SectionSubtitle>{t('landing.howItWorks.subtitle')}</SectionSubtitle>
        <StepsContainer>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepTitle>{t('landing.howItWorks.step1.title')}</StepTitle>
            <StepDescription>{t('landing.howItWorks.step1.description')}</StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>2</StepNumber>
            <StepTitle>{t('landing.howItWorks.step2.title')}</StepTitle>
            <StepDescription>{t('landing.howItWorks.step2.description')}</StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>3</StepNumber>
            <StepTitle>{t('landing.howItWorks.step3.title')}</StepTitle>
            <StepDescription>{t('landing.howItWorks.step3.description')}</StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>4</StepNumber>
            <StepTitle>{t('landing.howItWorks.step4.title')}</StepTitle>
            <StepDescription>{t('landing.howItWorks.step4.description')}</StepDescription>
          </StepCard>
        </StepsContainer>
      </HowItWorksSection>

      <PricingSection>
        <SectionTitle>Modelo de Usuarios Free y Premium</SectionTitle>
        <SectionSubtitle>
          Comienza gratis y accede a funcionalidades premium después de tu primer pago
        </SectionSubtitle>
        <PricingGrid>
          <PricingCard>
            <PlanName>Usuario Free</PlanName>
            <PlanPrice>$0</PlanPrice>
            <PlanPeriod>Siempre gratis</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Registro gratuito inicial</PlanFeature>
              <PlanFeature>Explorar todos los servicios disponibles</PlanFeature>
              <PlanFeature>Acceso a información limitada</PlanFeature>
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='outlined'
              onClick={handleFreeUserRegister}
            >
              Registrarse Gratis
            </Button>
          </PricingCard>

          <PricingCard $featured>
            <PopularBadge>Más Popular</PopularBadge>
            <PlanName>Usuario Premium</PlanName>
            <PlanPrice>$199 MXN</PlanPrice>
            <PlanPeriod>Por mes</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Todo lo del Usuario Free</PlanFeature>
              <PlanFeature>Reservaciones con pocos pasos</PlanFeature>
              <PlanFeature>Notificaciones por email y smartphone</PlanFeature>
              <PlanFeature>Información completa de los venues</PlanFeature>
              <PlanFeature>Acceso a comunidad privada exclusiva</PlanFeature>
              <PlanFeature>Promociones especiales</PlanFeature>
              <PlanFeature>Historial completo de reservaciones</PlanFeature>
              <PlanFeature>Historial de pagos y facturación</PlanFeature>
              <PlanFeature>Soporte técnico</PlanFeature>
              <PlanFeature>Y mucho más...</PlanFeature>
            </PlanFeatures>
            <Button
              size='medium'
              style={{ width: '100%' }}
              variant='contained'
              onClick={handlePremiumUserRegister}
            >
              Registrarse Premium
            </Button>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      <MobileAppSection>
        <MobileAppContainer>
          <MobileAppContent>
            <MobileAppTitle>{t('landing.mobileApp.title')}</MobileAppTitle>
            <MobileAppDescription>{t('landing.mobileApp.description')}</MobileAppDescription>

            <MobileAppFeatures>
              <FeatureItem>
                <MobileFeatureIcon>⚡</MobileFeatureIcon>
                <FeatureText>{t('landing.mobileApp.features.instantBooking')}</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <MobileFeatureIcon>🔔</MobileFeatureIcon>
                <FeatureText>{t('landing.mobileApp.features.realTimeNotifications')}</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <MobileFeatureIcon>⚡</MobileFeatureIcon>
                <FeatureText>Reservaciones con pocos pasos</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <MobileFeatureIcon>💳</MobileFeatureIcon>
                <FeatureText>{t('landing.mobileApp.features.securePayments')}</FeatureText>
              </FeatureItem>
            </MobileAppFeatures>

            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  color: '#1a202c',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {t('landing.mobileApp.download.title')}
              </h3>
            </div>

            <DownloadButtons>
              <DownloadButton className='coming-soon' href='#'>
                <Apple size={24} />
                <div style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {t('landing.mobileApp.download.appStore')}
                  </span>
                </div>
              </DownloadButton>

              <DownloadButton className='coming-soon' href='#'>
                <Play size={24} />
                <div style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {t('landing.mobileApp.download.googlePlay')}
                  </span>
                </div>
              </DownloadButton>
            </DownloadButtons>
          </MobileAppContent>

          <MobileAppScreenshots>
            <MobileDeviceMockup>
              <MobileScreenshotWrapper>
                <ScreenshotImage
                  alt='ReservApp - Aplicación Móvil para Reservas Premium'
                  loading='lazy'
                  src='/images/brand/mobile-mockup.png'
                />
              </MobileScreenshotWrapper>
            </MobileDeviceMockup>
          </MobileAppScreenshots>
        </MobileAppContainer>
      </MobileAppSection>

      <CTASection>
        <CTATitle>{t('landing.cta.title')}</CTATitle>
        <CTASubtitle>{t('landing.cta.subtitle')}</CTASubtitle>
        <HeroButtons>
          <Button size='large' variant='contained' onClick={handleBusinessSignup}>
            🏢 Registrar mi Negocio
          </Button>
          <Button size='large' variant='outlined' onClick={handleBusinessLogin}>
            💼 Portal de Negocios
          </Button>
        </HeroButtons>
      </CTASection>
    </LandingContainer>
  );
};
