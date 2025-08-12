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
  BusinessInfo,
  BusinessInfoText,
  BusinessInfoTitle,
  DemoCredentials,
  DemoItem,
  DemoTitle,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  LinkContainer,
  SubmitButton,
} from './LoginPage.styled';

/**
 * Login page component with form validation and authentication.
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
    handleDemoLogin('manager@reservapp.com');
  };

  return (
    <FormContainer>
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

      <DemoCredentials>
        <DemoTitle>Cuentas Demo para Negocios</DemoTitle>
        <DemoItem>
          <strong>Administrador:</strong> admin@reservapp.com / password123
          <button
            style={{ fontSize: '12px', marginLeft: '8px', padding: '2px 6px' }}
            type='button'
            onClick={handleAdminDemoLogin}
          >
            Usar
          </button>
        </DemoItem>
        <DemoItem>
          <strong>Gestor:</strong> manager@reservapp.com / password123
          <button
            style={{ fontSize: '12px', marginLeft: '8px', padding: '2px 6px' }}
            type='button'
            onClick={handleManagerDemoLogin}
          >
            Usar
          </button>
        </DemoItem>
      </DemoCredentials>

      <BusinessInfo>
        <BusinessInfoTitle>
          <Smartphone size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {t('auth.info.endUserTitle')}
        </BusinessInfoTitle>
        <BusinessInfoText>{t('auth.info.endUserDescription')}</BusinessInfoText>
      </BusinessInfo>

      <LinkContainer>
        <p>
          ¿No tienes cuenta de negocio?{' '}
          <AuthLink href='/auth/register'>Registrar mi negocio</AuthLink>
        </p>
      </LinkContainer>
    </FormContainer>
  );
};
