'use client';

import React from 'react';

import {
  Calendar,
  CreditCard,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Star,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { useTranslation } from '@i18n/index';

import type { FAQCategory, HelpPageProps, QuickGuide } from './HelpPage.interfaces';

import * as S from './HelpPage.styled';

export const HelpPage: React.FC<HelpPageProps> = ({ className = undefined }) => {
  const { t } = useTranslation();

  const faqCategories: FAQCategory[] = [
    {
      faqs: [
        {
          answer: t('help.faq.registration.howToRegisterAnswer'),
          question: t('help.faq.registration.howToRegister'),
        },
        {
          answer: t('help.faq.registration.whichPlanAnswer'),
          question: t('help.faq.registration.whichPlan'),
        },
        {
          answer: t('help.faq.registration.freeFeaturesAnswer'),
          question: t('help.faq.registration.freeFeatures'),
        },
      ],
      title: t('help.faq.categories.registration'),
    },
    {
      faqs: [
        {
          answer: t('help.faq.reservations.howToBookAnswer'),
          question: t('help.faq.reservations.howToBook'),
        },
        {
          answer: t('help.faq.reservations.cancelPolicyAnswer'),
          question: t('help.faq.reservations.cancelPolicy'),
        },
        {
          answer: t('help.faq.reservations.confirmationsAnswer'),
          question: t('help.faq.reservations.confirmations'),
        },
      ],
      title: t('help.faq.categories.reservations'),
    },
    {
      faqs: [
        {
          answer: t('help.faq.payments.paymentMethodsAnswer'),
          question: t('help.faq.payments.paymentMethods'),
        },
        {
          answer: t('help.faq.payments.securityAnswer'),
          question: t('help.faq.payments.security'),
        },
        {
          answer: t('help.faq.payments.refundsAnswer'),
          question: t('help.faq.payments.refunds'),
        },
      ],
      title: t('help.faq.categories.payments'),
    },
    {
      faqs: [
        {
          answer: t('help.faq.support.hoursAnswer'),
          question: t('help.faq.support.hours'),
        },
        {
          answer: t('help.faq.support.contactAnswer'),
          question: t('help.faq.support.contact'),
        },
        {
          answer: t('help.faq.support.emergenciesAnswer'),
          question: t('help.faq.support.emergencies'),
        },
      ],
      title: t('help.faq.categories.support'),
    },
  ];

  const quickGuides: QuickGuide[] = [
    {
      description: t('help.quickGuides.userRegistration.description'),
      icon: '👤',
      steps: [
        t('help.quickGuides.userRegistration.step1'),
        t('help.quickGuides.userRegistration.step2'),
        t('help.quickGuides.userRegistration.step3'),
        t('help.quickGuides.userRegistration.step4'),
      ],
      title: t('help.quickGuides.userRegistration.title'),
    },
    {
      description: t('help.quickGuides.makeReservation.description'),
      icon: '📅',
      steps: [
        t('help.quickGuides.makeReservation.step1'),
        t('help.quickGuides.makeReservation.step2'),
        t('help.quickGuides.makeReservation.step3'),
        t('help.quickGuides.makeReservation.step4'),
      ],
      title: t('help.quickGuides.makeReservation.title'),
    },
    {
      description: t('help.quickGuides.businessRegistration.description'),
      icon: '🏢',
      steps: [
        t('help.quickGuides.businessRegistration.step1'),
        t('help.quickGuides.businessRegistration.step2'),
        t('help.quickGuides.businessRegistration.step3'),
        t('help.quickGuides.businessRegistration.step4'),
      ],
      title: t('help.quickGuides.businessRegistration.title'),
    },
  ];

  const renderFAQIcon = (categoryTitle: string) => {
    if (categoryTitle.includes('Registro')) return <UserPlus size={24} />;
    if (categoryTitle.includes('Reservaciones')) return <Calendar size={24} />;
    if (categoryTitle.includes('Pagos')) return <CreditCard size={24} />;
    return <HelpCircle size={24} />;
  };

  return (
    <S.PageContainer className={className}>
      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>{t('help.hero.title')}</S.HeroTitle>
          <S.HeroSubtitle>{t('help.hero.subtitle')}</S.HeroSubtitle>
        </S.HeroContent>
      </S.HeroSection>

      {/* Startup Narrative Highlight */}
      <S.Section>
        <S.Container>
          <S.HighlightBox>
            <S.HighlightTitle>{t('help.narrative.title')}</S.HighlightTitle>
            <S.HighlightText>{t('help.narrative.description')}</S.HighlightText>
            <Link href='/register/user' passHref>
              <S.HighlightButton>{t('help.narrative.ctaButton')}</S.HighlightButton>
            </Link>
          </S.HighlightBox>
        </S.Container>
      </S.Section>

      {/* FAQs Section */}
      <S.Section>
        <S.Container>
          <S.SectionTitle>{t('help.faq.title')}</S.SectionTitle>
          <S.SectionSubtitle>{t('help.faq.subtitle')}</S.SectionSubtitle>

          <S.FAQGrid>
            {faqCategories.map((category, index) => (
              <S.FAQCategory key={index}>
                <S.CategoryTitle>
                  <S.CategoryIcon>{renderFAQIcon(category.title)}</S.CategoryIcon>
                  {category.title}
                </S.CategoryTitle>

                {category.faqs.map((faq, faqIndex) => (
                  <S.FAQItem key={faqIndex}>
                    <S.Question>{faq.question}</S.Question>
                    <S.Answer>{faq.answer}</S.Answer>
                  </S.FAQItem>
                ))}
              </S.FAQCategory>
            ))}
          </S.FAQGrid>
        </S.Container>
      </S.Section>

      {/* Quick Start Guides */}
      <S.Section>
        <S.Container>
          <S.SectionTitle>{t('help.quickGuides.title')}</S.SectionTitle>
          <S.SectionSubtitle>{t('help.quickGuides.subtitle')}</S.SectionSubtitle>

          <S.QuickGuidesGrid>
            {quickGuides.map((guide, index) => (
              <S.GuideCard key={index}>
                <S.GuideHeader>
                  <S.GuideIcon>{guide.icon}</S.GuideIcon>
                  <S.GuideTitle>{guide.title}</S.GuideTitle>
                  <S.GuideDescription>{guide.description}</S.GuideDescription>
                </S.GuideHeader>

                <S.GuideContent>
                  <S.StepsList>
                    {guide.steps.map((step, stepIndex) => (
                      <S.StepItem key={stepIndex}>{step}</S.StepItem>
                    ))}
                  </S.StepsList>
                </S.GuideContent>
              </S.GuideCard>
            ))}
          </S.QuickGuidesGrid>
        </S.Container>
      </S.Section>

      {/* Benefits for New Users */}
      <S.Section $background='#f9fafb'>
        <S.Container>
          <S.SectionTitle>{t('help.benefits.title')}</S.SectionTitle>
          <S.SectionSubtitle>{t('help.benefits.subtitle')}</S.SectionSubtitle>

          <S.QuickGuidesGrid>
            <S.GuideCard>
              <S.GuideHeader>
                <S.GuideIcon>
                  <Zap size={32} />
                </S.GuideIcon>
                <S.GuideTitle>{t('help.benefits.simplicity.title')}</S.GuideTitle>
                <S.GuideDescription>{t('help.benefits.simplicity.description')}</S.GuideDescription>
              </S.GuideHeader>
            </S.GuideCard>

            <S.GuideCard>
              <S.GuideHeader>
                <S.GuideIcon>
                  <Users size={32} />
                </S.GuideIcon>
                <S.GuideTitle>{t('help.benefits.community.title')}</S.GuideTitle>
                <S.GuideDescription>{t('help.benefits.community.description')}</S.GuideDescription>
              </S.GuideHeader>
            </S.GuideCard>

            <S.GuideCard>
              <S.GuideHeader>
                <S.GuideIcon>
                  <Star size={32} />
                </S.GuideIcon>
                <S.GuideTitle>{t('help.benefits.exclusive.title')}</S.GuideTitle>
                <S.GuideDescription>{t('help.benefits.exclusive.description')}</S.GuideDescription>
              </S.GuideHeader>
            </S.GuideCard>
          </S.QuickGuidesGrid>
        </S.Container>
      </S.Section>

      {/* Contact Support */}
      <S.Section>
        <S.Container>
          <S.ContactSection>
            <S.ContactTitle>{t('help.support.title')}</S.ContactTitle>
            <S.ContactDescription>{t('help.support.description')}</S.ContactDescription>

            <S.ContactMethods>
              <S.ContactMethod>
                <S.ContactIcon>
                  <Mail size={24} />
                </S.ContactIcon>
                <S.ContactMethodTitle>{t('help.support.email.title')}</S.ContactMethodTitle>
                <S.ContactMethodDescription>
                  {t('help.support.email.description')}
                </S.ContactMethodDescription>
              </S.ContactMethod>

              <S.ContactMethod>
                <S.ContactIcon>
                  <Phone size={24} />
                </S.ContactIcon>
                <S.ContactMethodTitle>{t('help.support.phone.title')}</S.ContactMethodTitle>
                <S.ContactMethodDescription>
                  {t('help.support.phone.description')}
                </S.ContactMethodDescription>
              </S.ContactMethod>

              <S.ContactMethod>
                <S.ContactIcon>
                  <MessageCircle size={24} />
                </S.ContactIcon>
                <S.ContactMethodTitle>{t('help.support.chat.title')}</S.ContactMethodTitle>
                <S.ContactMethodDescription>
                  {t('help.support.chat.description')}
                </S.ContactMethodDescription>
              </S.ContactMethod>
            </S.ContactMethods>

            <Link href='/contact'>
              <S.HighlightButton style={{ marginTop: '2rem' }}>
                {t('help.support.contactButton')}
              </S.HighlightButton>
            </Link>
          </S.ContactSection>
        </S.Container>
      </S.Section>
    </S.PageContainer>
  );
};
