'use client';

import React, { useState } from 'react';

import { Smartphone } from 'lucide-react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { LoadingSpinner } from '@/libs/ui/components/LoadingSpinner';
import { useAuth } from '@/libs/ui/providers/AuthProvider';
import { useToast } from '@/libs/ui/providers/ToastProvider';
import { useTranslation } from '@/libs/i18n';

const FormContainer = styled.div`
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

const SubmitButton = styled.button<{ $isLoading: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DemoCredentials = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const DemoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const DemoItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const BusinessInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  text-align: center;
`;

const BusinessInfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const BusinessInfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 0;
  line-height: 1.4;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const AuthLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

/**
 * Login page component with form validation and authentication.
 */
export const LoginPage: React.FC = () => {
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
