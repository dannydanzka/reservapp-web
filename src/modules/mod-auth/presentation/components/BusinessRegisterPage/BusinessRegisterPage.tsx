'use client';

import React, { useState } from 'react';

import { BarChart3, Building2, CreditCard, Shield, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button as UIButton } from '@ui/Button';
import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import { BusinessRegisterPageProps } from './BusinessRegisterPage.interfaces';

import {
  AdminDashboardImage,
  AdminDashboardShowcase,
  ButtonGroup,
  CheckboxGrid,
  CheckboxInput,
  CheckboxLabel,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  FormRow,
  FormSection,
  FormSubtitle,
  FormTitle,
  GiroSubtitle,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  HighlightText,
  InfoCard,
  InfoGrid,
  InfoNumber,
  InfoSection,
  InfoShowcaseContainer,
  InfoText,
  Input,
  Label,
  LandingContainer,
  LinkContainer,
  LinkText,
  StyledLink,
  ValuePropContainer,
} from './BusinessRegisterPage.styled';

/**
 * Business registration page component - Now completely FREE!
 * Simplified registration process focusing on basic business information.
 * Advanced business details can be completed later in the admin panel.
 */
export const BusinessRegisterPage: React.FC<BusinessRegisterPageProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessGiros, setBusinessGiros] = useState<string[]>([]);

  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGiroChange = (giro: string, checked: boolean) => {
    if (checked) {
      setBusinessGiros((prev) => [...prev, giro]);
    } else {
      setBusinessGiros((prev) => prev.filter((g) => g !== giro));
    }
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      setError(t('auth.businessRegister.errors.firstNameRequired'));
      return false;
    }
    if (!lastName.trim()) {
      setError(t('auth.businessRegister.errors.lastNameRequired'));
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.businessRegister.errors.emailRequired'));
      return false;
    }
    if (!password || password.length < 8) {
      setError(t('auth.businessRegister.errors.passwordLength'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('auth.businessRegister.errors.passwordMismatch'));
      return false;
    }
    if (!businessName.trim()) {
      setError(t('auth.businessRegister.errors.businessNameRequired'));
      return false;
    }
    if (!phone.trim()) {
      setError(t('auth.businessRegister.errors.phoneRequired'));
      return false;
    }
    if (businessGiros.length === 0) {
      setError(t('auth.businessRegister.errors.giroRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Register user with business account data
      await register(email, password, `${firstName} ${lastName}`, {
        // Use first selected giro as primary type
        businessGiros,

        businessName,
        businessType: (businessGiros[0] as any) || 'OTHER', // Store all selected giros
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        password,
        phone,
      });

      showToast({
        description: t('auth.businessRegister.success.welcome'),
        title: t('auth.businessRegister.success.title'),
        variant: 'success',
      });
      router.push('/admin');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err instanceof Error ? err.message : t('auth.businessRegister.errors.registrationFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handleUserRegister = () => {
    router.push('/auth/user-register');
  };

  return (
    <LandingContainer>
      {/* Hero Section */}
      <HeroSection>
        <ValuePropContainer>
          <div>
            <HeroTitle>
              {t('auth.businessRegister.hero.title')}
              <br />
              <HighlightText>{t('auth.businessRegister.hero.free')}</HighlightText>
            </HeroTitle>
            <HeroSubtitle>{t('auth.businessRegister.hero.subtitle')}</HeroSubtitle>
          </div>
        </ValuePropContainer>
      </HeroSection>

      {/* Stats and Admin Dashboard Showcase Section */}
      <InfoSection>
        <InfoShowcaseContainer>
          <div>
            <h2>{t('auth.businessRegister.dashboard.title')}</h2>
            <p>{t('auth.businessRegister.dashboard.subtitle')}</p>

            {/* Stats Section */}
            <InfoGrid>
              <InfoCard>
                <InfoNumber>{t('auth.businessRegister.stats.businesses.number')}</InfoNumber>
                <InfoText>{t('auth.businessRegister.stats.businesses.text')}</InfoText>
              </InfoCard>
              <InfoCard>
                <InfoNumber>{t('auth.businessRegister.stats.revenue.number')}</InfoNumber>
                <InfoText>{t('auth.businessRegister.stats.revenue.text')}</InfoText>
              </InfoCard>
              <InfoCard>
                <InfoNumber>{t('auth.businessRegister.stats.growth.number')}</InfoNumber>
                <InfoText>{t('auth.businessRegister.stats.growth.text')}</InfoText>
              </InfoCard>
            </InfoGrid>
          </div>

          {/* Admin Dashboard Mockup */}
          <AdminDashboardShowcase>
            <AdminDashboardImage
              alt={t('auth.businessRegister.dashboard.imageAlt')}
              loading='eager'
              src='/images/brand/admin-mockup.png'
            />
          </AdminDashboardShowcase>
        </InfoShowcaseContainer>
      </InfoSection>

      {/* Form Section */}
      <FormSection>
        <FormContainer>
          <FormTitle>{t('auth.businessRegister.form.title')}</FormTitle>
          <FormSubtitle>{t('auth.businessRegister.form.subtitle')}</FormSubtitle>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormRow>
              <FormGroup>
                <Label htmlFor='firstName'>{t('auth.businessRegister.form.firstName')}</Label>
                <Input
                  disabled={isLoading}
                  id='firstName'
                  placeholder={t('auth.businessRegister.form.firstNamePlaceholder')}
                  required
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='lastName'>{t('auth.businessRegister.form.lastName')}</Label>
                <Input
                  disabled={isLoading}
                  id='lastName'
                  placeholder={t('auth.businessRegister.form.lastNamePlaceholder')}
                  required
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor='email'>{t('auth.businessRegister.form.email')}</Label>
              <Input
                disabled={isLoading}
                id='email'
                placeholder={t('auth.businessRegister.form.emailPlaceholder')}
                required
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor='phone'>{t('auth.businessRegister.form.phone')}</Label>
                <Input
                  disabled={isLoading}
                  id='phone'
                  placeholder={t('auth.businessRegister.form.phonePlaceholder')}
                  required
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='businessName'>{t('auth.businessRegister.form.businessName')}</Label>
                <Input
                  disabled={isLoading}
                  id='businessName'
                  placeholder={t('auth.businessRegister.form.businessNamePlaceholder')}
                  required
                  type='text'
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>{t('auth.businessRegister.giros.title')}</Label>
              <GiroSubtitle>{t('auth.businessRegister.giros.subtitle')}</GiroSubtitle>
              <CheckboxGrid>
                {[
                  'hospitality',
                  'food',
                  'wellness',
                  'tourism',
                  'events',
                  'entertainment',
                  'retail',
                  'services',
                  'other',
                ].map((giro) => (
                  <CheckboxLabel key={giro}>
                    <CheckboxInput
                      checked={businessGiros.includes(giro)}
                      disabled={isLoading}
                      type='checkbox'
                      onChange={(e) => handleGiroChange(giro, e.target.checked)}
                    />
                    <span>{t(`auth.businessRegister.giros.${giro}`)}</span>
                  </CheckboxLabel>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor='password'>{t('auth.businessRegister.form.password')}</Label>
                <Input
                  disabled={isLoading}
                  id='password'
                  placeholder={t('auth.businessRegister.form.passwordPlaceholder')}
                  required
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='confirmPassword'>
                  {t('auth.businessRegister.form.confirmPassword')}
                </Label>
                <Input
                  disabled={isLoading}
                  id='confirmPassword'
                  placeholder={t('auth.businessRegister.form.confirmPasswordPlaceholder')}
                  required
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <UIButton
              disabled={isLoading}
              fullWidth
              loading={isLoading}
              size='large'
              style={{ marginTop: '1rem' }}
              type='submit'
            >
              {isLoading ? (
                t('auth.businessRegister.form.registering')
              ) : (
                <>
                  <Building2 size={20} />
                  {t('auth.businessRegister.form.submit')}
                </>
              )}
            </UIButton>
          </Form>

          <LinkContainer>
            <LinkText>
              {t('auth.businessRegister.form.hasAccount')}{' '}
              <StyledLink onClick={handleLoginRedirect}>
                {t('auth.businessRegister.form.login')}
              </StyledLink>
            </LinkText>
            <LinkText>
              {t('auth.businessRegister.isUser')}{' '}
              <StyledLink onClick={handleUserRegister}>
                {t('auth.businessRegister.userRegisterLink')}
              </StyledLink>
            </LinkText>
          </LinkContainer>
        </FormContainer>
      </FormSection>
    </LandingContainer>
  );
};
