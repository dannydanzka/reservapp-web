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
  ComparisonContainer,
  ComparisonSection,
  ComparisonTable,
  ComparisonTableCell,
  ComparisonTableHead,
  ComparisonTableHeader,
  ComparisonTableRow,
  ExampleCard,
  ExampleContainer,
  ExampleGrid,
  ExampleTitle,
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
            <BenefitIcon>💰</BenefitIcon>
            <BenefitTitle>{t('business.benefits.competitiveCommissions.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.competitiveCommissions.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>⚡</BenefitIcon>
            <BenefitTitle>{t('business.benefits.weeklyPayments.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.weeklyPayments.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>🏨</BenefitIcon>
            <BenefitTitle>{t('business.benefits.integralEcosystem.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.integralEcosystem.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>📊</BenefitIcon>
            <BenefitTitle>{t('business.benefits.advancedPanel.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.advancedPanel.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>🎯</BenefitIcon>
            <BenefitTitle>{t('business.benefits.productivityBonuses.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.productivityBonuses.description')}
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>👥</BenefitIcon>
            <BenefitTitle>{t('business.benefits.privateCommunity.title')}</BenefitTitle>
            <BenefitDescription>
              {t('business.benefits.privateCommunity.description')}
            </BenefitDescription>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      <ComparisonSection>
        <ComparisonContainer>
          <SectionTitle>{t('business.comparison.title')}</SectionTitle>
          <SectionSubtitle>{t('business.comparison.subtitle')}</SectionSubtitle>

          <div style={{ overflowX: 'auto' }}>
            <ComparisonTable>
              <ComparisonTableHead>
                <tr>
                  <ComparisonTableHeader>
                    {t('business.comparison.table.feature')}
                  </ComparisonTableHeader>
                  <ComparisonTableHeader>
                    {t('business.comparison.table.reservapp')}
                  </ComparisonTableHeader>
                  <ComparisonTableHeader>
                    {t('business.comparison.table.platformA')}
                  </ComparisonTableHeader>
                  <ComparisonTableHeader>
                    {t('business.comparison.table.platformB')}
                  </ComparisonTableHeader>
                </tr>
              </ComparisonTableHead>
              <tbody>
                <ComparisonTableRow>
                  <ComparisonTableCell>
                    {t('business.comparison.table.registration')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    ✅ {t('business.comparison.table.free')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    ✅ {t('business.comparison.table.free')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    ✅ {t('business.comparison.table.free')}
                  </ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow $highlighted>
                  <ComparisonTableCell>
                    {t('business.comparison.table.commission')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>5%</ComparisonTableCell>
                  <ComparisonTableCell $negative>15%</ComparisonTableCell>
                  <ComparisonTableCell $negative>15-25%</ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow>
                  <ComparisonTableCell>
                    {t('business.comparison.table.commissionAfter')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>10-12%</ComparisonTableCell>
                  <ComparisonTableCell $negative>15%</ComparisonTableCell>
                  <ComparisonTableCell $negative>15-25%</ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow $highlighted>
                  <ComparisonTableCell>
                    {t('business.comparison.table.paymentFrequency')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    {t('business.comparison.table.weekly')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $neutral>
                    {t('business.comparison.table.oneToSevenDays')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $negative>
                    {t('business.comparison.table.upToThirtyDays')}
                  </ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow>
                  <ComparisonTableCell>
                    {t('business.comparison.table.serviceTypes')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    {t('business.comparison.table.completeEcosystem')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $neutral>
                    {t('business.comparison.table.onlyAccommodation')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $neutral>
                    {t('business.comparison.table.onlyAccommodation')}
                  </ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow $highlighted>
                  <ComparisonTableCell>
                    {t('business.comparison.table.adminPanel')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    {t('business.comparison.table.advanced')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $neutral>
                    {t('business.comparison.table.basic')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $neutral>
                    {t('business.comparison.table.basic')}
                  </ComparisonTableCell>
                </ComparisonTableRow>
                <ComparisonTableRow>
                  <ComparisonTableCell>
                    {t('business.comparison.table.monthlySavings')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $positive>
                    {t('business.comparison.table.upToAmount')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $negative>
                    {t('business.comparison.table.none')}
                  </ComparisonTableCell>
                  <ComparisonTableCell $negative>
                    {t('business.comparison.table.none')}
                  </ComparisonTableCell>
                </ComparisonTableRow>
              </tbody>
            </ComparisonTable>
          </div>

          <ExampleContainer>
            <ExampleTitle>{t('business.comparison.example.title')}</ExampleTitle>
            <ExampleGrid>
              <ExampleCard $positive>
                <h4>{t('business.comparison.example.withReservapp')}</h4>
                <p className='amount'>{t('business.comparison.example.amountReservapp')}</p>
                <p className='description'>
                  {t('business.comparison.example.descriptionReservapp')}
                </p>
              </ExampleCard>
              <ExampleCard>
                <h4>{t('business.comparison.example.withTraditional')}</h4>
                <p className='amount'>{t('business.comparison.example.amountTraditional')}</p>
                <p className='description'>
                  {t('business.comparison.example.descriptionTraditional')}
                </p>
              </ExampleCard>
            </ExampleGrid>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
              {t('business.comparison.disclaimer')}
            </p>
          </ExampleContainer>
        </ComparisonContainer>
      </ComparisonSection>

      <PricingSection>
        <SectionTitle>{t('business.pricing.title')}</SectionTitle>
        <SectionSubtitle>{t('business.pricing.subtitle')}</SectionSubtitle>
        <PricingGrid>
          <PricingCard>
            <PlanName>{t('business.pricing.firstYear.name')}</PlanName>
            <PlanPrice>{t('business.pricing.firstYear.price')}</PlanPrice>
            <PlanPeriod>{t('business.pricing.firstYear.period')}</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>✅ {t('business.benefits.competitiveCommissions.title')}</PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.firstYear.features.fivePercentCommission')}
              </PlanFeature>
              <PlanFeature>✅ {t('business.pricing.firstYear.features.allServices')}</PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.firstYear.features.weeklyPayments')}
              </PlanFeature>
              <PlanFeature>✅ {t('business.benefits.advancedPanel.title')}</PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.firstYear.features.dedicatedSupport')}
              </PlanFeature>
            </PlanFeatures>
            <Button href='/auth/register' size='large' style={{ width: '100%' }} variant='outlined'>
              {t('business.pricing.firstYear.button')}
            </Button>
          </PricingCard>

          <PricingCard $featured>
            <PopularBadge>{t('business.pricing.standard.badge')}</PopularBadge>
            <PlanName>{t('business.pricing.standard.name')}</PlanName>
            <PlanPrice>{t('business.pricing.standard.price')}</PlanPrice>
            <PlanPeriod>{t('business.pricing.standard.period')}</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>✅ {t('business.pricing.standard.features.lowerThanBig')}</PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.standard.features.lowerThanTraditional')}
              </PlanFeature>
              <PlanFeature>✅ {t('business.benefits.productivityBonuses.title')}</PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.standard.features.volumeReduction')}
              </PlanFeature>
              <PlanFeature>✅ {t('business.benefits.privateCommunity.title')}</PlanFeature>
              <PlanFeature>✅ {t('business.pricing.standard.features.advancedTools')}</PlanFeature>
            </PlanFeatures>
            <Button
              href='/auth/register'
              size='large'
              style={{ width: '100%' }}
              variant='contained'
            >
              {t('business.pricing.standard.button')}
            </Button>
          </PricingCard>

          <PricingCard>
            <PlanName>{t('business.pricing.comparison.name')}</PlanName>
            <PlanPrice>{t('business.pricing.comparison.price')}</PlanPrice>
            <PlanPeriod>{t('business.pricing.comparison.period')}</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>
                ❌ {t('business.pricing.comparison.features.platformACommission')}
              </PlanFeature>
              <PlanFeature>
                ❌ {t('business.pricing.comparison.features.platformBCommission')}
              </PlanFeature>
              <PlanFeature>❌ {t('business.pricing.comparison.features.slowPayments')}</PlanFeature>
              <PlanFeature>
                ❌ {t('business.pricing.comparison.features.limitedServices')}
              </PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.comparison.features.reservappSavings')}
              </PlanFeature>
              <PlanFeature>
                ✅ {t('business.pricing.comparison.features.completeEcosystem')}
              </PlanFeature>
            </PlanFeatures>
          </PricingCard>
        </PricingGrid>
      </PricingSection>
    </PageContainer>
  );
};
