'use client';

import React from 'react';

import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import { AboutPageProps } from './AboutPage.interfaces';

import {
  CTAButtons,
  CTADescription,
  CTASection,
  CTATitle,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  MissionCard,
  MissionDescription,
  MissionGrid,
  MissionIcon,
  MissionSection,
  MissionTitle,
  PageContainer,
  SectionContainer,
  SectionSubtitle,
  SectionTitle,
  TeamGrid,
  TeamMemberCard,
  TeamMemberDescription,
  TeamMemberImage,
  TeamMemberName,
  TeamMemberRole,
  TeamSection,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineSection,
  TimelineTitle,
  ValueCard,
  ValueDescription,
  ValueIcon,
  ValuesGrid,
  ValuesSection,
  ValueTitle,
} from './AboutPage.styled';

export const AboutPage: React.FC<AboutPageProps> = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      description: t('about.team.members.ceo.description'),
      icon: '👔',
      name: t('about.team.members.ceo.name'),
      role: t('about.team.members.ceo.role'),
    },
    {
      description: t('about.team.members.cto.description'),
      icon: '💻',
      name: t('about.team.members.cto.name'),
      role: t('about.team.members.cto.role'),
    },
    {
      description: t('about.team.members.cmo.description'),
      icon: '📈',
      name: t('about.team.members.cmo.name'),
      role: t('about.team.members.cmo.role'),
    },
    {
      description: t('about.team.members.coo.description'),
      icon: '⚙️',
      name: t('about.team.members.coo.name'),
      role: t('about.team.members.coo.role'),
    },
  ];

  const values = [
    {
      description: t('about.values.innovation.description'),
      icon: '💡',
      title: t('about.values.innovation.title'),
    },
    {
      description: t('about.values.transparency.description'),
      icon: '🔍',
      title: t('about.values.transparency.title'),
    },
    {
      description: t('about.values.collaboration.description'),
      icon: '🤝',
      title: t('about.values.collaboration.title'),
    },
    {
      description: t('about.values.excellence.description'),
      icon: '⭐',
      title: t('about.values.excellence.title'),
    },
    {
      description: t('about.values.sustainability.description'),
      icon: '🌱',
      title: t('about.values.sustainability.title'),
    },
    {
      description: t('about.values.community.description'),
      icon: '👥',
      title: t('about.values.community.title'),
    },
  ];

  const milestones = [
    {
      description: t('about.timeline.2023.description'),
      title: t('about.timeline.2023.title'),
      year: '2023',
    },
    {
      description: t('about.timeline.2024Q1.description'),
      title: t('about.timeline.2024Q1.title'),
      year: '2024',
    },
    {
      description: t('about.timeline.2024Q3.description'),
      title: t('about.timeline.2024Q3.title'),
      year: 'Q3',
    },
    {
      description: t('about.timeline.2025.description'),
      title: t('about.timeline.2025.title'),
      year: '2025',
    },
  ];

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>{t('about.hero.title')}</HeroTitle>
        <HeroSubtitle>{t('about.hero.subtitle')}</HeroSubtitle>
      </HeroSection>

      <MissionSection>
        <SectionContainer>
          <SectionTitle>{t('about.mission.title')}</SectionTitle>
          <SectionSubtitle>{t('about.mission.subtitle')}</SectionSubtitle>
          <MissionGrid>
            <MissionCard>
              <MissionIcon>🎯</MissionIcon>
              <MissionTitle>{t('about.mission.ourMission.title')}</MissionTitle>
              <MissionDescription>{t('about.mission.ourMission.description')}</MissionDescription>
            </MissionCard>
            <MissionCard>
              <MissionIcon>👁️</MissionIcon>
              <MissionTitle>{t('about.mission.ourVision.title')}</MissionTitle>
              <MissionDescription>{t('about.mission.ourVision.description')}</MissionDescription>
            </MissionCard>
            <MissionCard>
              <MissionIcon>🚀</MissionIcon>
              <MissionTitle>{t('about.mission.ourGoal.title')}</MissionTitle>
              <MissionDescription>{t('about.mission.ourGoal.description')}</MissionDescription>
            </MissionCard>
          </MissionGrid>
        </SectionContainer>
      </MissionSection>

      <ValuesSection>
        <SectionContainer>
          <SectionTitle>{t('about.values.title')}</SectionTitle>
          <SectionSubtitle>{t('about.values.subtitle')}</SectionSubtitle>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard key={index}>
                <ValueIcon>{value.icon}</ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </SectionContainer>
      </ValuesSection>

      <TeamSection>
        <SectionContainer>
          <SectionTitle>{t('about.team.title')}</SectionTitle>
          <SectionSubtitle>{t('about.team.subtitle')}</SectionSubtitle>
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index}>
                <TeamMemberImage>{member.icon}</TeamMemberImage>
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberRole>{member.role}</TeamMemberRole>
                <TeamMemberDescription>{member.description}</TeamMemberDescription>
              </TeamMemberCard>
            ))}
          </TeamGrid>
        </SectionContainer>
      </TeamSection>

      <TimelineSection>
        <SectionContainer>
          <SectionTitle>{t('about.timeline.title')}</SectionTitle>
          <SectionSubtitle>{t('about.timeline.subtitle')}</SectionSubtitle>
          <Timeline>
            {milestones.map((milestone, index) => (
              <TimelineItem $position={index % 2 === 0 ? 'left' : 'right'} key={index}>
                <TimelineContent>
                  <TimelineTitle>{milestone.title}</TimelineTitle>
                  <TimelineDescription>{milestone.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </SectionContainer>
      </TimelineSection>

      <CTASection>
        <SectionContainer>
          <CTATitle>{t('about.cta.title')}</CTATitle>
          <CTADescription>{t('about.cta.description')}</CTADescription>
          <CTAButtons>
            <Button href='/auth/register' size='large' variant='contained'>
              {t('about.cta.joinButton')}
            </Button>
            <Button
              href='/contact'
              size='large'
              style={{ background: 'white', color: '#764ba2' }}
              variant='outlined'
            >
              {t('about.cta.contactButton')}
            </Button>
          </CTAButtons>
        </SectionContainer>
      </CTASection>
    </PageContainer>
  );
};
