'use client';

import React from 'react';

import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import { BusinessPageProps } from './BusinessPage.interfaces';

import {
  BenefitCard,
  BenefitDescription,
  BenefitIcon,
  BenefitsGrid,
  BenefitsSection,
  BenefitTitle,
  ContactFormSection,
  HeroButtons,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  PageContainer,
  PlanFeature,
  PlanFeatures,
  PlanName,
  PlanPeriod,
  PlanPrice,
  PopularBadge,
  PricingCard,
  PricingGrid,
  PricingSection,
  SectionSubtitle,
  SectionTitle,
} from './BusinessPage.styled';

export const BusinessPage: React.FC<BusinessPageProps> = () => {
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
