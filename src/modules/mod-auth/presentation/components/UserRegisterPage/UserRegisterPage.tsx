'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import type {
  RegisterApiRequest,
  RegisterApiResponse,
  UserRegisterFormData,
  UserRegisterPageProps,
} from './UserRegisterPage.interfaces';

import {
  AppMessage,
  BenefitItem,
  BenefitsList,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  FormRow,
  FormSection,
  FormSubtitle,
  FormTitle,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  Input,
  Label,
  LandingContainer,
  LinkContainer,
  LinkText,
  MobileAppShowcase,
  MobileScreenshotWrapper,
  ModalButtons,
  ModalContainer,
  ModalOverlay,
  ModalSubtitle,
  ModalTitle,
  ScreenshotImage,
  StatsCard,
  StatsGrid,
  StatsNumber,
  StatsSection,
  StatsText,
  StyledLink,
  ValuePropContainer,
} from './UserRegisterPage.styled';

export const UserRegisterPage: React.FC<UserRegisterPageProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<UserRegisterFormData>({
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) {
      return 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      return 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      return 'El correo electrónico es requerido';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Por favor ingresa un correo electrónico válido';
    }

    if (!formData.password) {
      return 'La contraseña es requerida';
    }

    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: RegisterApiRequest = {
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || undefined,
      };

      const response = await fetch('/api/auth/register', {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data: RegisterApiResponse = await response.json();

      if (data.success && data.data?.token) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.data.token);

        // Mostrar modal de éxito
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error de conexión. Por favor verifica tu internet e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handleBusinessRegister = () => {
    router.push('/auth/register');
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const handleModalOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <LandingContainer>
      {/* Hero Section */}
      <HeroSection>
        <ValuePropContainer>
          <div>
            <HeroTitle>{t('auth.userRegister.hero.title')}</HeroTitle>
            <HeroSubtitle>
              {t('auth.userRegister.hero.subtitle')}
              <br />
              <strong>{t('auth.userRegister.hero.free')}</strong>
            </HeroSubtitle>

            {/* Stats Section */}
            <StatsSection>
              <StatsGrid>
                <StatsCard>
                  <StatsNumber>{t('auth.userRegister.stats.venues.number')}</StatsNumber>
                  <StatsText>{t('auth.userRegister.stats.venues.text')}</StatsText>
                </StatsCard>
                <StatsCard>
                  <StatsNumber>{t('auth.userRegister.stats.experiences.number')}</StatsNumber>
                  <StatsText>{t('auth.userRegister.stats.experiences.text')}</StatsText>
                </StatsCard>
                <StatsCard>
                  <StatsNumber>{t('auth.userRegister.stats.savings.number')}</StatsNumber>
                  <StatsText>{t('auth.userRegister.stats.savings.text')}</StatsText>
                </StatsCard>
              </StatsGrid>
            </StatsSection>
          </div>

          {/* Mobile App Showcase */}
          <MobileAppShowcase>
            <MobileScreenshotWrapper>
              <ScreenshotImage
                alt='ReservApp - Aplicación Móvil para Reservas Premium'
                loading='eager'
                src='/images/brand/mobile-mockup.png'
              />
            </MobileScreenshotWrapper>
          </MobileAppShowcase>
        </ValuePropContainer>
      </HeroSection>

      {/* Form Section */}
      <FormSection>
        <FormContainer>
          <FormTitle>{t('auth.userRegister.form.title')}</FormTitle>
          <FormSubtitle>{t('auth.userRegister.form.subtitle')}</FormSubtitle>

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor='firstName'>Nombre *</Label>
                <Input
                  disabled={isLoading}
                  id='firstName'
                  name='firstName'
                  placeholder='Tu nombre'
                  required
                  type='text'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='lastName'>Apellido *</Label>
                <Input
                  disabled={isLoading}
                  id='lastName'
                  name='lastName'
                  placeholder='Tu apellido'
                  required
                  type='text'
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor='email'>{t('auth.userRegister.email')} *</Label>
              <Input
                disabled={isLoading}
                id='email'
                name='email'
                placeholder={t('auth.userRegister.emailPlaceholder')}
                required
                type='email'
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='phone'>{t('auth.userRegister.phone')}</Label>
              <Input
                disabled={isLoading}
                id='phone'
                name='phone'
                placeholder={t('auth.userRegister.phonePlaceholder')}
                type='tel'
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor='password'>{t('auth.userRegister.password')} *</Label>
                <Input
                  disabled={isLoading}
                  id='password'
                  name='password'
                  placeholder={t('auth.userRegister.passwordPlaceholder')}
                  required
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='confirmPassword'>{t('auth.userRegister.confirmPassword')} *</Label>
                <Input
                  disabled={isLoading}
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder={t('auth.userRegister.confirmPasswordPlaceholder')}
                  required
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button
              disabled={isLoading}
              fullWidth
              loading={isLoading}
              size='large'
              style={{ marginTop: '1rem' }}
              type='submit'
            >
              {isLoading
                ? t('auth.userRegister.creatingAccount')
                : t('auth.userRegister.createAccountButton')}
            </Button>
          </Form>

          <LinkContainer>
            <LinkText>
              {t('auth.userRegister.alreadyHaveAccount')}{' '}
              <StyledLink onClick={handleLoginRedirect}>
                {t('auth.userRegister.loginLink')}
              </StyledLink>
            </LinkText>
            <LinkText>
              {t('auth.userRegister.haveBusinessAccount')}{' '}
              <StyledLink onClick={handleBusinessRegister}>
                {t('auth.userRegister.businessRegisterLink')}
              </StyledLink>
            </LinkText>
          </LinkContainer>
        </FormContainer>
      </FormSection>

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay onClick={handleModalOverlayClick}>
          <ModalContainer>
            <ModalTitle>{t('auth.userRegister.success.title')}</ModalTitle>
            <ModalSubtitle>{t('auth.userRegister.success.subtitle')}</ModalSubtitle>

            <BenefitsList>
              <BenefitItem>{t('auth.userRegister.success.benefits.0')}</BenefitItem>
              <BenefitItem>{t('auth.userRegister.success.benefits.1')}</BenefitItem>
              <BenefitItem>{t('auth.userRegister.success.benefits.2')}</BenefitItem>
              <BenefitItem>{t('auth.userRegister.success.benefits.3')}</BenefitItem>
            </BenefitsList>

            <AppMessage>{t('auth.userRegister.success.appMessage')}</AppMessage>

            <ModalButtons>
              <Button size='large' variant='contained' onClick={handleModalClose}>
                {t('auth.userRegister.success.closeButton')}
              </Button>
            </ModalButtons>
          </ModalContainer>
        </ModalOverlay>
      )}
    </LandingContainer>
  );
};
