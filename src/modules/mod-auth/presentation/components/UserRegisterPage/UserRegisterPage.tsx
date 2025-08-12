'use client';

import React, { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import { UserRegisterPageProps } from './UserRegisterPage.interfaces';

import {
  AuthLink,
  Button,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  LinkContainer,
  PasswordRequirements,
  PlanDescription,
  PlanInfo,
  PlanPrice,
  PlanTitle,
  UserInfo,
  UserInfoText,
  UserInfoTitle,
} from './UserRegisterPage.styled';

/**
 * Simple user registration page component for end users (not businesses).
 */
export const UserRegisterPage: React.FC<UserRegisterPageProps> = () => {
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
