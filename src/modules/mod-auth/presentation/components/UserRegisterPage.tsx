'use client';

import React, { useState } from 'react';

import { styled } from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { LoadingSpinner } from '@/libs/ui/components/LoadingSpinner';
import { useAuth } from '@/libs/ui/providers/AuthProvider';
import { useToast } from '@/libs/ui/providers/ToastProvider';
import { useTranslation } from '@/libs/i18n';

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const UserInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  text-align: center;
`;

const UserInfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const UserInfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1.5;
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

const Button = styled.button<{ $isLoading?: boolean; $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
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

  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'secondary') {
      return `
        background-color: ${theme.colors.secondary[200]};
        color: ${theme.colors.secondary[700]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary[300]};
        }
      `;
    }
    return `
      background-color: ${theme.colors.primary[600]};
      color: ${theme.colors.white};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[700]};
      }
    `;
  }}

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

const PasswordRequirements = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
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

const PlanInfo = styled.div<{ $isPremium: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ $isPremium, theme }) =>
    $isPremium ? theme.colors.secondary[50] : theme.colors.primary[50]};
  border: 1px solid
    ${({ $isPremium, theme }) =>
      $isPremium ? theme.colors.secondary[200] : theme.colors.primary[200]};
`;

const PlanTitle = styled.h5`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.primary[800]};
`;

const PlanDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: 0;
`;

const PlanPrice = styled.div<{ $isPremium: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $isPremium, theme }) =>
    $isPremium ? theme.colors.secondary[600] : theme.colors.primary[600]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

/**
 * Simple user registration page component for end users (not businesses).
 */
export const UserRegisterPage: React.FC = () => {
  const { t: _t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') || 'free'; // 'free' or 'premium'
  const isPremium = planType === 'premium';

  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }

    if (!email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido');
      return false;
    }

    if (!phone.trim()) {
      setError('El número de teléfono es requerido');
      return false;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('La contraseña debe incluir mayúsculas, minúsculas y números');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register the user with subscription status based on plan
      const _userData = {
        email,
        name,
        phone,
        role: 'USER' as const,
        subscriptionStatus: isPremium ? 'premium' : 'free',
      };

      await register(email, password, name);

      showToast({
        title: isPremium
          ? '¡Bienvenido! Tu cuenta premium ha sido creada exitosamente.'
          : '¡Bienvenido! Tu cuenta gratuita ha sido creada exitosamente.',
        variant: 'success',
      });

      // Redirect to the landing page or user dashboard
      router.push('/landing');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta';
      setError(errorMessage);
      showToast({ title: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <UserInfo>
        <UserInfoTitle>👤 Registro de Usuario</UserInfoTitle>
        <UserInfoText>
          Crea tu cuenta de usuario para acceder a todos los servicios de ReservApp.
        </UserInfoText>
        <UserInfoText>Podrás realizar reservaciones desde nuestra aplicación móvil.</UserInfoText>
      </UserInfo>

      <PlanInfo $isPremium={isPremium}>
        <PlanTitle>{isPremium ? '⭐ Plan Premium' : '🆓 Plan Gratuito'}</PlanTitle>
        <PlanDescription>
          {isPremium
            ? 'Acceso completo a servicios premium, descuentos exclusivos y soporte prioritario.'
            : 'Acceso a servicios básicos y reservaciones estándar.'}
        </PlanDescription>
        <PlanPrice $isPremium={isPremium}>{isPremium ? '$199 MXN/mes' : 'Gratis'}</PlanPrice>
      </PlanInfo>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor='name'>Nombre Completo *</Label>
          <Input
            disabled={isLoading}
            id='name'
            placeholder='Tu nombre completo'
            required
            type='text'
            value={name}
            onChange={handleNameChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='email'>Correo Electrónico *</Label>
          <Input
            disabled={isLoading}
            id='email'
            placeholder='tu@email.com'
            required
            type='email'
            value={email}
            onChange={handleEmailChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='phone'>Teléfono *</Label>
          <Input
            disabled={isLoading}
            id='phone'
            placeholder='33-1234-5678'
            required
            type='tel'
            value={phone}
            onChange={handlePhoneChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor='password'>Contraseña *</Label>
          <Input
            disabled={isLoading}
            id='password'
            placeholder='Crea una contraseña segura'
            required
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />
          <PasswordRequirements>
            Debe incluir mayúsculas, minúsculas y números (mínimo 8 caracteres)
          </PasswordRequirements>
        </FormGroup>

        <FormGroup>
          <Label htmlFor='confirmPassword'>Confirmar Contraseña *</Label>
          <Input
            disabled={isLoading}
            id='confirmPassword'
            placeholder='Confirma tu contraseña'
            required
            type='password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button $isLoading={isLoading} disabled={isLoading} type='submit'>
          {isLoading && <LoadingSpinner color='#ffffff' size='small' />}
          {isLoading ? 'Creando cuenta...' : `Crear Cuenta ${isPremium ? 'Premium' : 'Gratuita'}`}
        </Button>
      </Form>

      <LinkContainer>
        <p>
          ¿Ya tienes cuenta? <AuthLink href='/auth/login'>Iniciar sesión</AuthLink>
        </p>
        <p>
          ¿Tienes un negocio? <AuthLink href='/auth/register'>Registro empresarial</AuthLink>
        </p>
      </LinkContainer>
    </FormContainer>
  );
};
