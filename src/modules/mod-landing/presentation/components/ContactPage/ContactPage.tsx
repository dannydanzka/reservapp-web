'use client';

import React, { useState } from 'react';

import { Smartphone } from 'lucide-react';

import { Button } from '@ui/Button';
import { TextField } from '@ui/TextField';
import { useContactForm } from '@libs/presentation/hooks/useContact';
import { useTranslation } from '@i18n/index';

import { ContactPageProps, FormData } from './ContactPage.interfaces';

import {
  ContactContainer,
  ContactForm,
  ContactInfo,
  ErrorMessage,
  FormGroup,
  FormLabel,
  FormTitle,
  InfoCard,
  InfoIcon,
  InfoItem,
  InfoLabel,
  InfoText,
  InfoTitle,
  InfoValue,
  PageContainer,
  PageHeader,
  PageSubtitle,
  PageTitle,
  SuccessMessage,
  SupportHours,
  SupportTitle,
  SupportType,
  TextArea,
} from './ContactPage.styled';

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { t } = useTranslation();
  const { error, loading, submitContactForm, success } = useContactForm();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    message: '',
    name: '',
    phone: '',
    subject: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSuccess = await submitContactForm({
      email: formData.email,
      message: formData.message,
      name: formData.name,
      phone: formData.phone || undefined,
      subject: formData.subject,
    });

    if (isSuccess) {
      // Clear form on success
      setFormData({
        email: '',
        message: '',
        name: '',
        phone: '',
        subject: '',
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('contact.title')}</PageTitle>
        <PageSubtitle>{t('contact.subtitle')}</PageSubtitle>
      </PageHeader>

      <ContactContainer>
        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>{t('contact.form.title')}</FormTitle>

          {success && <SuccessMessage>{t('contact.form.success')}</SuccessMessage>}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <FormLabel htmlFor='name'>{t('contact.form.name')} *</FormLabel>
            <TextField
              fullWidth
              id='name'
              name='name'
              placeholder={t('contact.form.namePlaceholder')}
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='email'>{t('contact.form.email')} *</FormLabel>
            <TextField
              fullWidth
              id='email'
              name='email'
              placeholder={t('contact.form.emailPlaceholder')}
              required
              type='email'
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='phone'>{t('contact.form.phone')}</FormLabel>
            <TextField
              fullWidth
              id='phone'
              name='phone'
              placeholder={t('contact.form.phonePlaceholder')}
              type='tel'
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='subject'>{t('contact.form.subject')} *</FormLabel>
            <TextField
              fullWidth
              id='subject'
              name='subject'
              placeholder={t('contact.form.subjectPlaceholder')}
              required
              value={formData.subject}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='message'>{t('contact.form.message')} *</FormLabel>
            <TextArea
              id='message'
              name='message'
              placeholder={t('contact.form.messagePlaceholder')}
              required
              value={formData.message}
              onChange={handleInputChange}
            />
          </FormGroup>

          <Button
            disabled={loading}
            size='large'
            style={{ width: '100%' }}
            type='submit'
            variant='contained'
          >
            {loading ? t('contact.form.submitting') : t('contact.form.submit')}
          </Button>
        </ContactForm>

        <ContactInfo>
          <InfoCard>
            <InfoTitle>📍 {t('contact.info.contactTitle')}</InfoTitle>
            <InfoItem>
              <InfoIcon>🏢</InfoIcon>
              <InfoText>
                <InfoLabel>{t('contact.info.offices')}</InfoLabel>
                <InfoValue>
                  {t('contact.info.officesAddress')
                    .split('\n')
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < t('contact.info.officesAddress').split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </InfoValue>
              </InfoText>
            </InfoItem>
            <InfoItem>
              <InfoIcon>📧</InfoIcon>
              <InfoText>
                <InfoLabel>{t('contact.info.emailLabel')}</InfoLabel>
                <InfoValue>{t('contact.info.email')}</InfoValue>
              </InfoText>
            </InfoItem>
            <InfoItem>
              <InfoIcon>
                <Smartphone size={24} />
              </InfoIcon>
              <InfoText>
                <InfoLabel>{t('contact.info.phoneLabel')}</InfoLabel>
                <InfoValue>
                  {t('contact.info.phone')
                    .split('\n')
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < t('contact.info.phone').split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </InfoValue>
              </InfoText>
            </InfoItem>
          </InfoCard>

          <InfoCard>
            <InfoTitle>🕒 {t('contact.info.hoursTitle')}</InfoTitle>

            <SupportType>
              <SupportTitle>👤 {t('contact.info.userSupport')}</SupportTitle>
              <SupportHours>{t('contact.info.userSupportHours')}</SupportHours>
            </SupportType>

            <SupportType>
              <SupportTitle>🏢 {t('contact.info.businessSupport')}</SupportTitle>
              <SupportHours>{t('contact.info.businessSupportHours')}</SupportHours>
            </SupportType>
          </InfoCard>
        </ContactInfo>
      </ContactContainer>
    </PageContainer>
  );
};
