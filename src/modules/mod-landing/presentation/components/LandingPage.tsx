'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Apple, Play, Smartphone } from 'lucide-react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';

import { Button } from '@/libs/ui/components/Button';
import { useTranslation } from '@/libs/i18n';

// import useCloudinary from '@/libs/presentation/hooks/useCloudinary';

const LandingContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  color: white;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  max-width: 800px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: 1.5rem;
  margin-bottom: 3rem;
  max-width: 700px;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const AppDownloadSection = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
`;

const AppDownloadTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: white;
`;

const AppDownloadText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: rgba(255, 255, 255, 0.9);
`;

const AppStoreButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const AppStoreButton = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  font-size: 0.9rem;
  cursor: default;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: 1px dashed rgba(255, 255, 255, 0.3);

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const SectionSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.6;
`;

const ServicesSection = styled.section`
  padding: 6rem 2rem;
  background-color: white;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  text-align: center;
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    transform: translateY(-4px);
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ServiceTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary[50]};
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 2rem;
`;

const StepTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  line-height: 1.5;
`;

const PricingSection = styled.section`
  padding: 6rem 2rem;
  background-color: white;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  border: ${({ $featured, theme }) =>
    $featured ? `3px solid ${theme.colors.secondary[500]}` : '2px solid #e2e8f0'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.secondary[500]};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const PlanPeriod = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 2rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const PlanFeature = styled.li`
  padding: 0.5rem 0;
  color: ${({ theme }) => theme.colors.primary[700]};

  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.secondary[500]};
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const CTASection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const MobileAppSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[50]} 0%,
    ${({ theme }) => theme.colors.secondary[50]} 100%
  );
`;

const MobileAppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const MobileAppContent = styled.div`
  @media (max-width: 968px) {
    order: 2;
  }
`;

const MobileAppTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[900]};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MobileAppDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const MobileAppFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MobileFeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.secondary[500]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
`;

const FeatureText = styled.span`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 500;
`;

const DownloadButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary[900]};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-decoration: none;
    color: white;
  }

  &.coming-soon {
    background: ${({ theme }) => theme.colors.secondary[200]};
    color: ${({ theme }) => theme.colors.secondary[700]};
    cursor: not-allowed;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary[200]};
      transform: none;
      box-shadow: none;
      color: ${({ theme }) => theme.colors.secondary[700]};
    }
  }
`;

const MobileAppScreenshots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 968px) {
    order: 1;
    margin-bottom: 2rem;
  }
`;

const ScreenshotImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-height: 500px;
  object-fit: contain;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  }
`;

const MobileDeviceMockup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 600px;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary[200]} 0%,
      ${({ theme }) => theme.colors.secondary[200]} 100%
    );
    border-radius: 40px;
    opacity: 0.1;
    z-index: -1;
  }
`;

const MobileScreenshotWrapper = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const LocalMobileImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  }
`;

const FallbackMobileImage = styled.div`
  width: 100%;
  max-width: 300px;
  height: 500px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  }

  .mobile-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .mobile-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .mobile-subtitle {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  // const { generateImageUrl, isReady: isCloudinaryReady } = useCloudinary();
  const isCloudinaryReady = false;
  const [mobileImageUrl, setMobileImageUrl] = useState<string>('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [localImageError, setLocalImageError] = useState(false);

  const generateImageUrl = useCallback(
    (_path: string, _width?: number, _height?: number) => '',
    []
  );

  // Generate mobile app screenshot URL from Cloudinary
  useEffect(() => {
    if (isCloudinaryReady) {
      const imageUrl = generateImageUrl(
        'reservapp/marketing/mobile-screenshots/mobile-app-screenshot',
        300,
        600
      );
      setMobileImageUrl(imageUrl);
    }
  }, [isCloudinaryReady, generateImageUrl]);

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

  const handleImageLoadError = () => {
    setImageLoadError(true);
  };

  const handleLocalImageLoadError = () => {
    setLocalImageError(true);
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
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Próximamente en</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>App Store</div>
              </div>
            </AppStoreButton>
            <AppStoreButton>
              <Play size={20} />
              <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Próximamente en</div>
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
            <PlanPeriod>siempre gratis</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Registro gratuito inicial</PlanFeature>
              <PlanFeature>Explorar todos los servicios disponibles</PlanFeature>
              <PlanFeature>Reservaciones con pocos pasos</PlanFeature>
              <PlanFeature>Notificaciones básicas por email</PlanFeature>
              <PlanFeature>Acceso a información de contacto</PlanFeature>
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
            <PlanPeriod>por mes</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Todo lo del Usuario Free</PlanFeature>
              <PlanFeature>Acceso a comunidad privada exclusiva</PlanFeature>
              <PlanFeature>Promociones especiales para miembros</PlanFeature>
              <PlanFeature>Descuentos en servicios premium</PlanFeature>
              <PlanFeature>Acceso prioritario a nuevos negocios</PlanFeature>
              <PlanFeature>Historial completo de reservaciones</PlanFeature>
              <PlanFeature>Notificaciones avanzadas y recordatorios</PlanFeature>
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
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {t('landing.mobileApp.download.comingSoon')}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {t('landing.mobileApp.download.appStore')}
                  </span>
                </div>
              </DownloadButton>

              <DownloadButton className='coming-soon' href='#'>
                <Play size={24} />
                <div style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {t('landing.mobileApp.download.comingSoon')}
                  </span>
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
                {mobileImageUrl && !imageLoadError ? (
                  <ScreenshotImage
                    alt='ReservApp - Aplicación Móvil para Reservas Premium'
                    loading='lazy'
                    src={mobileImageUrl}
                    onError={handleImageLoadError}
                  />
                ) : !localImageError ? (
                  <LocalMobileImage
                    alt='ReservApp - Mockup de Aplicación Móvil'
                    loading='lazy'
                    src='/images/brand/mobile-mockup.svg'
                    onError={handleLocalImageLoadError}
                  />
                ) : (
                  <FallbackMobileImage>
                    <div className='mobile-icon'>
                      <Smartphone size={60} />
                    </div>
                    <div className='mobile-title'>ReservApp</div>
                    <div className='mobile-subtitle'>App Móvil Próximamente</div>
                  </FallbackMobileImage>
                )}
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
