'use client';

import React from 'react';

import { styled } from 'styled-components';

import { Button } from '@/libs/ui/components/Button';
import { useTranslation } from '@/libs/i18n';

const PageContainer = styled.div`
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
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: white;
`;

const HeroTitle = styled.h1`
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

const BenefitsSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const SectionSubtitle = styled.p`
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BenefitCard = styled.div`
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

const BenefitIcon = styled.div`
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

const BenefitTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const BenefitDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.6;
`;

const PricingSection = styled.section`
  padding: 6rem 2rem;
  background-color: white;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1366px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1000px;
  }

  @media (min-width: 1440px) {
    max-width: 1200px;
    gap: 2.5rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  border: ${({ $featured, theme }) =>
    $featured ? `3px solid ${theme.colors.secondary[500]}` : '2px solid #e2e8f0'};
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 1024px) {
    min-height: auto;
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const PlanPrice = styled.div`
  font-size: 3rem;
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
  flex: 1;
`;

const PlanFeature = styled.li`
  padding: 0.5rem 0;
  color: ${({ theme }) => theme.colors.primary[700]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.secondary[500]};
    font-weight: bold;
    margin-right: 0;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ContactFormSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary[50]};
`;

const _FeatureIcon = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: ${({ theme }) => theme.spacing[2]};
  width: 20px;
  height: 20px;
`;

export const BusinessPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>{t('business.title')}</HeroTitle>
        <HeroSubtitle>{t('business.subtitle')}</HeroSubtitle>
        <HeroButtons>
          <Button href='/auth/register' size='large' variant='contained'>
            {t('business.hero.registerButton')}
          </Button>
        </HeroButtons>
      </HeroSection>

      <BenefitsSection>
        <SectionTitle>{t('business.benefits.title')}</SectionTitle>
        <SectionSubtitle>{t('business.benefits.subtitle')}</SectionSubtitle>
        <BenefitsGrid>
          <BenefitCard>
            <BenefitIcon>📈</BenefitIcon>
            <BenefitTitle>{t('business.benefits.increaseBookings.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.increaseBookings.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>⏰</BenefitIcon>
            <BenefitTitle>{t('business.benefits.schedule247.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.schedule247.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>💳</BenefitIcon>
            <BenefitTitle>{t('business.benefits.securePayments.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.securePayments.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>📊</BenefitIcon>
            <BenefitTitle>{t('business.benefits.analytics.title')}</BenefitTitle>
            <BenefitDescription>{t('business.benefits.analytics.description')}</BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>🔔</BenefitIcon>
            <BenefitTitle>{t('business.benefits.notifications.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.notifications.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>🌟</BenefitIcon>
            <BenefitTitle>{t('business.benefits.reviews.title')}</BenefitTitle>
            <BenefitDescription>{t('business.benefits.reviews.description')}</BenefitDescription>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      <PricingSection>
        <SectionTitle>Modelos de Precios para Negocios</SectionTitle>
        <SectionSubtitle>
          Suscripción fija + comisión por venta + escalamiento por tráfico realista
        </SectionSubtitle>
        <PricingGrid>
          <PricingCard>
            <PlanName>Plan Inicial</PlanName>
            <PlanPrice>$1,299</PlanPrice>
            <PlanPeriod>suscripción mensual</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Hospedaje de hasta 5 servicios</PlanFeature>
              <PlanFeature>5% comisión por venta realizada</PlanFeature>
              <PlanFeature>Hasta 500 visitas mensuales</PlanFeature>
              <PlanFeature>$0.50 por visita adicional</PlanFeature>
              <PlanFeature>Panel de administración unificado</PlanFeature>
              <PlanFeature>Soporte por email</PlanFeature>
            </PlanFeatures>
            <Button href='/auth/register' size='large' style={{ width: '100%' }} variant='outlined'>
              Comenzar Ahora
            </Button>
          </PricingCard>

          <PricingCard $featured>
            <PopularBadge>Más Popular</PopularBadge>
            <PlanName>Plan Profesional</PlanName>
            <PlanPrice>$2,499</PlanPrice>
            <PlanPeriod>suscripción mensual</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Servicios ilimitados</PlanFeature>
              <PlanFeature>4% comisión por venta realizada</PlanFeature>
              <PlanFeature>Hasta 25,000 visitas mensuales</PlanFeature>
              <PlanFeature>Reportes detallados</PlanFeature>
              <PlanFeature>Soporte prioritario</PlanFeature>
              <PlanFeature>Tráfico adicional a precio preferencial</PlanFeature>
            </PlanFeatures>
            <Button
              href='/auth/register'
              size='large'
              style={{ width: '100%' }}
              variant='contained'
            >
              Empezar Ahora
            </Button>
          </PricingCard>

          <PricingCard>
            <PlanName>Plan Enterprise</PlanName>
            <PlanPrice>$4,999</PlanPrice>
            <PlanPeriod>suscripción mensual</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Todo lo anterior</PlanFeature>
              <PlanFeature>3% comisión por venta realizada</PlanFeature>
              <PlanFeature>Hasta 100,000 visitas mensuales</PlanFeature>
              <PlanFeature>Múltiples ubicaciones</PlanFeature>
              <PlanFeature>Soporte 24/7</PlanFeature>
              <PlanFeature>Tráfico adicional a precio preferencial</PlanFeature>
            </PlanFeatures>
            <Button href='/contact' size='large' style={{ width: '100%' }} variant='outlined'>
              Contactar Ventas
            </Button>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      <ContactFormSection>
        <SectionTitle>{t('business.cta.title')}</SectionTitle>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '1.125rem', marginBottom: '2rem' }}>
            ¿Listo para impulsar tu negocio? Regístrate ahora y comienza a gestionar tus
            reservaciones de manera profesional.
          </p>
          <Button href='/auth/register' size='large' variant='contained'>
            Registrar mi Negocio
          </Button>
        </div>
      </ContactFormSection>
    </PageContainer>
  );
};
