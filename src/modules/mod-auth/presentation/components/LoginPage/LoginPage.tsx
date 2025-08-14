'use client';

import React, { useState } from 'react';

import { Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import { LoginPageProps } from './LoginPage.interfaces';

import {
  AuthLink,
  DemoButton,
  DemoCard,
  DemoContainer,
  DemoCredential,
  DemoGrid,
  DemoLabel,
  DemoSection,
  DemoTitle,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  FormSection,
  FormSubtitle,
  FormTitle,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  InfoContainer,
  InfoSection,
  InfoText,
  InfoTitle,
  Input,
  Label,
  LinksContainer,
  LinksGrid,
  LinksSection,
  LinksText,
  LoginContainer,
  SubmitButton,
} from './LoginPage.styled';

/**
 * Login page component with form validation and authentication.
 * Follows LandingPage structure pattern with multiple sections.
 */
export const LoginPage: React.FC<LoginPageProps> = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      showToast({ title: t('auth.login.success.loginSuccessful'), variant: 'success' });
      router.push('/admin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.login.errors.serverError');
      setError(errorMessage);
      showToast({ title: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setIsLoading(true);

    try {
      await login(demoEmail, 'password123');
      showToast({ title: t('auth.login.success.loginSuccessful'), variant: 'success' });
      router.push('/admin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.login.errors.serverError');
      setError(errorMessage);
      showToast({ title: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAdminDemoLogin = () => {
    handleDemoLogin('admin@reservapp.com');
  };

  const handleManagerDemoLogin = () => {
    handleDemoLogin('demo@reservapp.com');
  };

  return (
    <LoginContainer>
      <HeroSection>
        <HeroTitle>{t('auth.login.title')}</HeroTitle>
        <HeroSubtitle>
          {t('auth.login.subtitle')}
          <br />
          <strong>{t('auth.login.businessAccess')}</strong>
        </HeroSubtitle>
      </HeroSection>

      <FormSection>
        <FormContainer>
          <FormTitle>{t('auth.login.formTitle')}</FormTitle>
          <FormSubtitle>{t('auth.login.formSubtitle')}</FormSubtitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor='email'>{t('auth.login.email')}</Label>
              <Input
                disabled={isLoading}
                id='email'
                placeholder={t('auth.login.emailPlaceholder')}
                required
                type='email'
                value={email}
                onChange={handleEmailChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='password'>{t('auth.login.password')}</Label>
              <Input
                disabled={isLoading}
                id='password'
                placeholder={t('auth.login.passwordPlaceholder')}
                required
                type='password'
                value={password}
                onChange={handlePasswordChange}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton $isLoading={isLoading} disabled={isLoading} type='submit'>
              {isLoading && <LoadingSpinner color='#ffffff' size='small' />}
              {isLoading ? t('auth.login.success.redirecting') : t('auth.login.loginButton')}
            </SubmitButton>
          </Form>
        </FormContainer>
      </FormSection>

      <DemoSection>
        <DemoContainer>
          <DemoTitle>{t('auth.login.demo.title')}</DemoTitle>
          <DemoGrid>
            <DemoCard>
              <DemoLabel>{t('auth.login.demo.adminLabel')}</DemoLabel>
              <DemoCredential>admin@reservapp.com / password123</DemoCredential>
              <DemoButton disabled={isLoading} type='button' onClick={handleAdminDemoLogin}>
                {t('auth.login.demo.useButton')}
              </DemoButton>
            </DemoCard>
            <DemoCard>
              <DemoLabel>{t('auth.login.demo.managerLabel')}</DemoLabel>
              <DemoCredential>demo@reservapp.com / password123</DemoCredential>
              <DemoButton disabled={isLoading} type='button' onClick={handleManagerDemoLogin}>
                {t('auth.login.demo.useButton')}
              </DemoButton>
            </DemoCard>
          </DemoGrid>
        </DemoContainer>
      </DemoSection>

      <InfoSection>
        <InfoContainer>
          <InfoTitle>
            <Smartphone size={24} />
            {t('auth.info.endUserTitle')}
          </InfoTitle>
          <InfoText>{t('auth.info.endUserDescription')}</InfoText>
        </InfoContainer>
      </InfoSection>

      <LinksSection>
        <LinksContainer>
          <LinksText>{t('auth.login.links.noAccount')}</LinksText>
          <LinksGrid>
            <AuthLink href='/auth/user-register'>{t('auth.login.links.registerUser')}</AuthLink>
            <AuthLink href='/auth/register'>{t('auth.login.links.registerBusiness')}</AuthLink>
          </LinksGrid>
        </LinksContainer>
      </LinksSection>
    </LoginContainer>
  );
};
