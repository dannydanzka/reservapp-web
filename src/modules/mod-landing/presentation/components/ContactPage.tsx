'use client';

import React, { useState } from 'react';

import { Smartphone } from 'lucide-react';
import { styled } from 'styled-components';

import { Button } from '@/libs/ui/components/Button';
import { TextField } from '@/libs/ui/components/TextField';
import { useTranslation } from '@/libs/i18n';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  color: white;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.span`
  font-size: 1.25rem;
  margin-top: 0.125rem;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.4;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`;

const SupportType = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 8px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
`;

const SupportTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 0.5rem;
`;

const SupportHours = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.9rem;
`;

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    name: '',
    phone: '',
    subject: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setSuccess(true);
      setFormData({
        email: '',
        message: '',
        name: '',
        phone: '',
        subject: '',
      });
    } catch (_err) {
      setError(t('contact.form.error'));
    } finally {
      setLoading(false);
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
