'use client';

import React from 'react';

import { useTranslation } from '@i18n/index';

import { PrivacyPageProps } from './PrivacyPage.interfaces';

import {
  ContactInfo,
  ContentContainer,
  HighlightBox,
  LastUpdated,
  PageContainer,
  PageHeader,
  PageSubtitle,
  PageTitle,
  Section,
  SectionContent,
  SectionTitle,
} from './PrivacyPage.styled';

export const PrivacyPage: React.FC<PrivacyPageProps> = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('privacy.title')}</PageTitle>
        <PageSubtitle>{t('privacy.subtitle')}</PageSubtitle>
      </PageHeader>

      <ContentContainer>
        <Section>
          <LastUpdated>{t('privacy.lastUpdated')}</LastUpdated>

          <SectionContent>
            <p>{t('privacy.introduction')}</p>

            <HighlightBox>
              <h4>{t('privacy.commitment.title')}</h4>
              <p>{t('privacy.commitment.description')}</p>
            </HighlightBox>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.dataCollection.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.dataCollection.intro')}</p>

            <h3>{t('privacy.dataCollection.personalInfo.title')}</h3>
            <ul>
              <li>{t('privacy.dataCollection.personalInfo.item1')}</li>
              <li>{t('privacy.dataCollection.personalInfo.item2')}</li>
              <li>{t('privacy.dataCollection.personalInfo.item3')}</li>
              <li>{t('privacy.dataCollection.personalInfo.item4')}</li>
              <li>{t('privacy.dataCollection.personalInfo.item5')}</li>
            </ul>

            <h3>{t('privacy.dataCollection.businessInfo.title')}</h3>
            <ul>
              <li>{t('privacy.dataCollection.businessInfo.item1')}</li>
              <li>{t('privacy.dataCollection.businessInfo.item2')}</li>
              <li>{t('privacy.dataCollection.businessInfo.item3')}</li>
              <li>{t('privacy.dataCollection.businessInfo.item4')}</li>
            </ul>

            <h3>{t('privacy.dataCollection.technicalInfo.title')}</h3>
            <ul>
              <li>{t('privacy.dataCollection.technicalInfo.item1')}</li>
              <li>{t('privacy.dataCollection.technicalInfo.item2')}</li>
              <li>{t('privacy.dataCollection.technicalInfo.item3')}</li>
              <li>{t('privacy.dataCollection.technicalInfo.item4')}</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.dataUsage.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.dataUsage.intro')}</p>
            <ul>
              <li>
                <strong>{t('privacy.dataUsage.purpose1.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose1.description')}
              </li>
              <li>
                <strong>{t('privacy.dataUsage.purpose2.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose2.description')}
              </li>
              <li>
                <strong>{t('privacy.dataUsage.purpose3.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose3.description')}
              </li>
              <li>
                <strong>{t('privacy.dataUsage.purpose4.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose4.description')}
              </li>
              <li>
                <strong>{t('privacy.dataUsage.purpose5.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose5.description')}
              </li>
              <li>
                <strong>{t('privacy.dataUsage.purpose6.title')}:</strong>{' '}
                {t('privacy.dataUsage.purpose6.description')}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.dataSharing.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.dataSharing.intro')}</p>

            <h3>{t('privacy.dataSharing.withPartners.title')}</h3>
            <ul>
              <li>{t('privacy.dataSharing.withPartners.item1')}</li>
              <li>{t('privacy.dataSharing.withPartners.item2')}</li>
              <li>{t('privacy.dataSharing.withPartners.item3')}</li>
            </ul>

            <h3>{t('privacy.dataSharing.serviceProviders.title')}</h3>
            <ul>
              <li>{t('privacy.dataSharing.serviceProviders.item1')}</li>
              <li>{t('privacy.dataSharing.serviceProviders.item2')}</li>
              <li>{t('privacy.dataSharing.serviceProviders.item3')}</li>
              <li>{t('privacy.dataSharing.serviceProviders.item4')}</li>
            </ul>

            <h3>{t('privacy.dataSharing.legalRequirements.title')}</h3>
            <p>{t('privacy.dataSharing.legalRequirements.description')}</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.dataSecurity.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.dataSecurity.intro')}</p>

            <h3>{t('privacy.dataSecurity.technicalMeasures.title')}</h3>
            <ul>
              <li>{t('privacy.dataSecurity.technicalMeasures.item1')}</li>
              <li>{t('privacy.dataSecurity.technicalMeasures.item2')}</li>
              <li>{t('privacy.dataSecurity.technicalMeasures.item3')}</li>
              <li>{t('privacy.dataSecurity.technicalMeasures.item4')}</li>
            </ul>

            <h3>{t('privacy.dataSecurity.organizationalMeasures.title')}</h3>
            <ul>
              <li>{t('privacy.dataSecurity.organizationalMeasures.item1')}</li>
              <li>{t('privacy.dataSecurity.organizationalMeasures.item2')}</li>
              <li>{t('privacy.dataSecurity.organizationalMeasures.item3')}</li>
            </ul>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.userRights.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.userRights.intro')}</p>
            <ul>
              <li>
                <strong>{t('privacy.userRights.access.title')}:</strong>{' '}
                {t('privacy.userRights.access.description')}
              </li>
              <li>
                <strong>{t('privacy.userRights.rectification.title')}:</strong>{' '}
                {t('privacy.userRights.rectification.description')}
              </li>
              <li>
                <strong>{t('privacy.userRights.cancellation.title')}:</strong>{' '}
                {t('privacy.userRights.cancellation.description')}
              </li>
              <li>
                <strong>{t('privacy.userRights.opposition.title')}:</strong>{' '}
                {t('privacy.userRights.opposition.description')}
              </li>
              <li>
                <strong>{t('privacy.userRights.portability.title')}:</strong>{' '}
                {t('privacy.userRights.portability.description')}
              </li>
              <li>
                <strong>{t('privacy.userRights.limitation.title')}:</strong>{' '}
                {t('privacy.userRights.limitation.description')}
              </li>
            </ul>

            <HighlightBox>
              <h4>{t('privacy.userRights.exerciseRights.title')}</h4>
              <p>{t('privacy.userRights.exerciseRights.description')}</p>
            </HighlightBox>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.cookies.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.cookies.intro')}</p>

            <h3>{t('privacy.cookies.types.title')}</h3>
            <ul>
              <li>
                <strong>{t('privacy.cookies.types.essential.title')}:</strong>{' '}
                {t('privacy.cookies.types.essential.description')}
              </li>
              <li>
                <strong>{t('privacy.cookies.types.functional.title')}:</strong>{' '}
                {t('privacy.cookies.types.functional.description')}
              </li>
              <li>
                <strong>{t('privacy.cookies.types.analytics.title')}:</strong>{' '}
                {t('privacy.cookies.types.analytics.description')}
              </li>
              <li>
                <strong>{t('privacy.cookies.types.marketing.title')}:</strong>{' '}
                {t('privacy.cookies.types.marketing.description')}
              </li>
            </ul>

            <h3>{t('privacy.cookies.management.title')}</h3>
            <p>{t('privacy.cookies.management.description')}</p>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.minors.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.minors.description')}</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.internationalTransfers.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.internationalTransfers.description')}</p>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.dataRetention.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.dataRetention.intro')}</p>
            <ul>
              <li>
                <strong>{t('privacy.dataRetention.users.title')}:</strong>{' '}
                {t('privacy.dataRetention.users.description')}
              </li>
              <li>
                <strong>{t('privacy.dataRetention.businesses.title')}:</strong>{' '}
                {t('privacy.dataRetention.businesses.description')}
              </li>
              <li>
                <strong>{t('privacy.dataRetention.reservations.title')}:</strong>{' '}
                {t('privacy.dataRetention.reservations.description')}
              </li>
              <li>
                <strong>{t('privacy.dataRetention.marketing.title')}:</strong>{' '}
                {t('privacy.dataRetention.marketing.description')}
              </li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.legalCompliance.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.legalCompliance.description')}</p>

            <HighlightBox>
              <h4>{t('privacy.legalCompliance.mexicanLaws.title')}</h4>
              <p>{t('privacy.legalCompliance.mexicanLaws.description')}</p>
            </HighlightBox>
          </SectionContent>
        </Section>

        <Section $isGray>
          <SectionTitle>{t('privacy.policyChanges.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.policyChanges.description')}</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>{t('privacy.contact.title')}</SectionTitle>
          <SectionContent>
            <p>{t('privacy.contact.intro')}</p>

            <ContactInfo>
              <h3>{t('privacy.contact.dataController.title')}</h3>
              <p>
                <strong>{t('privacy.contact.dataController.company')}</strong>
              </p>
              <p>{t('privacy.contact.dataController.address')}</p>
              <p>
                <strong>{t('privacy.contact.dataController.emailLabel')}:</strong>{' '}
                {t('privacy.contact.dataController.email')}
              </p>
              <p>
                <strong>{t('privacy.contact.dataController.phoneLabel')}:</strong>{' '}
                {t('privacy.contact.dataController.phone')}
              </p>
            </ContactInfo>
          </SectionContent>
        </Section>
      </ContentContainer>
    </PageContainer>
  );
};
