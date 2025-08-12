'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { BusinessRegistrationData } from '@mod-auth/domain/auth/auth.interfaces';
import { GooglePlacesAutocomplete } from '@ui/GooglePlacesAutocomplete';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { StripePaymentForm } from '@ui/StripePaymentForm';
import { StripeProvider } from '@providers/StripeProvider';
import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import { RegisterPageProps, SubscriptionPackages } from './RegisterPage.interfaces';

import {
  AuthLink,
  BusinessInfo,
  BusinessInfoText,
  BusinessInfoTitle,
  Button,
  ButtonGroup,
  ErrorMessage,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  LinkContainer,
  PackageCard,
  PackageFeature,
  PackageFeaturesList,
  PackageName,
  PackagePeriod,
  PackagePrice,
  PackageSelector,
  PackageSelectorTitle,
  PasswordRequirements,
  PaymentContainer,
  PopularBadge,
  PricingAmount,
  PricingCard,
  PricingPeriod,
  Step,
  StepIndicator,
  StepSeparator,
} from './RegisterPage.styled';

/**
 * Business registration page component with multi-step flow and payment integration.
 */
export const RegisterPage: React.FC<RegisterPageProps> = () => {
  const { t: _t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [_selectedPlace, setSelectedPlace] = useState<{
    placeId: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'inicial' | 'profesional' | 'enterprise'>(
    'inicial'
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'registration' | 'payment'>('registration');
  const [_paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Business subscription packages
  const SUBSCRIPTION_PACKAGES: SubscriptionPackages = {
    enterprise: {
      amount: 4999,
      currency: 'mxn',
      features: [
        'Todo lo del Plan Profesional',
        '3% comisión por venta realizada',
        'Hasta 100,000 visitas mensuales',
        'Múltiples ubicaciones',
        'Soporte 24/7',
        'Empleados ilimitados',
        'Multi-sucursal',
        'API personalizada',
        'Integración con sistemas externos',
        'Gerente de cuenta dedicado',
        'Capacitación personalizada',
        'SLA garantizado 99.9%',
      ],
      name: 'Plan Enterprise',
      period: 'por mes',
    },
    inicial: {
      amount: 1299,
      currency: 'mxn',
      features: [
        'Panel administrativo completo',
        'Gestión de hasta 100 reservaciones/mes',
        'Hasta 3 empleados',
        'Reportes básicos',
        'Soporte técnico por email',
      ],
      name: 'Plan Inicial',
      period: 'por mes',
    },
    profesional: {
      amount: 2499,
      currency: 'mxn',
      features: [
        'Todo lo del Plan Inicial',
        'Reservaciones ilimitadas',
        'Hasta 10 empleados',
        'Reportes avanzados y estadísticas',
        'Integración con redes sociales',
        'Soporte telefónico prioritario',
        'Personalización avanzada',
      ],
      name: 'Plan Profesional',
      period: 'por mes',
      popular: true,
    },
  };

  const selectedPlan = SUBSCRIPTION_PACKAGES[selectedPackage];

  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const validateRegistrationForm = (): boolean => {
    if (!name.trim()) {
      setError('El nombre del responsable es requerido');
      return false;
    }

    if (!businessName.trim()) {
      setError('El nombre del negocio es requerido');
      return false;
    }

    if (!phone.trim()) {
      setError('El teléfono de contacto es requerido');
      return false;
    }

    if (!address.trim()) {
      setError('La dirección del negocio es requerida');
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

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateRegistrationForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent for subscription
      const response = await fetch('/api/payments/subscription', {
        body: JSON.stringify({
          amount: selectedPlan.amount,
          businessName,
          currency: selectedPlan.currency,
          email,
          planType: selectedPackage,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago. Intenta nuevamente.');
      }

      const data = await response.json();

      if (data.success) {
        setPaymentIntentId(data.data.paymentIntentId);
        setClientSecret(data.data.clientSecret);
        setCurrentStep('payment');
      } else {
        throw new Error(data.message || 'Error al iniciar el proceso de pago');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error del servidor';
      setError(errorMessage);
      showToast({ title: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Verify payment was successful with backend
      const paymentVerification = await fetch(
        `/api/payments/subscription?payment_intent_id=${paymentIntentId}`
      );
      const verificationData = await paymentVerification.json();

      if (!verificationData.success || verificationData.data?.status !== 'succeeded') {
        throw new Error('Payment verification failed. Please contact support.');
      }

      const registrationData: BusinessRegistrationData = {
        address,
        businessName,
        email,
        name,
        password,
        paymentIntentId,
        phone,
        subscriptionPlan: selectedPackage,
      };

      await register(
        registrationData.email,
        registrationData.password,
        registrationData.name,
        registrationData
      );

      showToast({
        title: '¡Bienvenido! Tu cuenta empresarial ha sido creada exitosamente.',
        variant: 'success',
      });

      // Small delay to show success message
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear la cuenta después del pago';
      setError(errorMessage);
      showToast({
        duration: 8000,
        title: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (paymentError: string) => {
    setError(`Error de pago: ${paymentError}`);
    showToast({
      duration: 10000,
      title: `Error de pago: ${paymentError}`,
      variant: 'error',
    });
    setIsLoading(false);
  };

  const goBackToRegistration = () => {
    setCurrentStep('registration');
    setPaymentIntentId(null);
    setClientSecret(null);
    setError('');
  };

  const handlePlaceSelected = (place: {
    address: string;
    placeId: string;
    coordinates?: { lat: number; lng: number };
  }) => {
    setSelectedPlace({
      coordinates: place.coordinates,
      placeId: place.placeId,
    });
  };

  return (
    <FormContainer>
      <BusinessInfo>
        <BusinessInfoTitle>🏢 Registro de Negocio</BusinessInfoTitle>
        <BusinessInfoText>
          Crea tu cuenta empresarial para gestionar las reservaciones de tu negocio. Incluye acceso
          completo al panel administrativo y herramientas de gestión.
        </BusinessInfoText>
        <BusinessInfoText>
          Los usuarios finales realizan reservaciones a través de nuestra aplicación móvil.
        </BusinessInfoText>
      </BusinessInfo>

      <StepIndicator>
        <Step $isActive={currentStep === 'registration'} $isCompleted={currentStep === 'payment'}>
          1. Datos del Negocio
        </Step>
        <StepSeparator />
        <Step $isActive={currentStep === 'payment'} $isCompleted={false}>
          2. Suscripción y Pago
        </Step>
      </StepIndicator>

      {currentStep === 'registration' && (
        <>
          <PackageSelectorTitle>Selecciona tu Plan Empresarial</PackageSelectorTitle>
          <PackageSelector>
            {Object.entries(SUBSCRIPTION_PACKAGES).map(([key, pkg]) => (
              <PackageCard
                $selected={selectedPackage === key}
                key={key}
                onClick={() => setSelectedPackage(key as 'inicial' | 'profesional' | 'enterprise')}
              >
                {'popular' in pkg && pkg.popular && <PopularBadge>Más Popular</PopularBadge>}
                <PackageName>{pkg.name}</PackageName>
                <PackagePrice>${pkg.amount.toLocaleString('es-MX')} MXN</PackagePrice>
                <PackagePeriod>por mes</PackagePeriod>
                <PackageFeaturesList>
                  {pkg.features.map((feature, index) => (
                    <PackageFeature key={index}>{feature}</PackageFeature>
                  ))}
                </PackageFeaturesList>
              </PackageCard>
            ))}
          </PackageSelector>

          <Form onSubmit={handleRegistrationSubmit}>
            <FormGroup>
              <Label htmlFor='businessName'>Nombre del Negocio *</Label>
              <Input
                disabled={isLoading}
                id='businessName'
                placeholder='Ej: Restaurante Casa Salazar'
                required
                type='text'
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='name'>Nombre del Responsable *</Label>
              <Input
                disabled={isLoading}
                id='name'
                placeholder='Tu nombre completo'
                required
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='email'>Correo Electrónico del Negocio *</Label>
              <Input
                disabled={isLoading}
                id='email'
                placeholder='contacto@tunegocio.com'
                required
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='phone'>Teléfono de Contacto *</Label>
              <Input
                disabled={isLoading}
                id='phone'
                placeholder='33-1234-5678'
                required
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor='address'>Dirección del Negocio *</Label>
              <GooglePlacesAutocomplete
                disabled={isLoading}
                id='address'
                name='address'
                placeholder='Buscar dirección del negocio en México...'
                required
                value={address}
                onChange={setAddress}
                onPlaceSelected={handlePlaceSelected}
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button $isLoading={isLoading} disabled={isLoading} type='submit'>
              {isLoading && <LoadingSpinner color='#ffffff' size='small' />}
              {isLoading ? 'Procesando...' : 'Continuar al Pago'}
            </Button>
          </Form>
        </>
      )}

      {currentStep === 'payment' && clientSecret && (
        <PaymentContainer>
          <BusinessInfoTitle>💳 Procesar Suscripción</BusinessInfoTitle>
          <BusinessInfoText>
            Completa el pago de tu suscripción mensual para activar tu cuenta empresarial.
          </BusinessInfoText>

          <PricingCard>
            <PricingAmount>${selectedPlan.amount.toLocaleString('es-MX')} MXN</PricingAmount>
            <PricingPeriod>
              {selectedPlan.name} - {businessName}
            </PricingPeriod>
            <div style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '1rem' }}>
              Facturación mensual • Cancela cuando quieras
            </div>
          </PricingCard>

          {isLoading ? (
            <div
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                margin: '1rem 0',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <LoadingSpinner size='large' />
              <p style={{ color: '#374151', marginTop: '1rem' }}>
                Creando tu cuenta empresarial...
              </p>
            </div>
          ) : (
            <StripeProvider clientSecret={clientSecret}>
              <StripePaymentForm
                amount={selectedPlan.amount}
                billingDetails={{
                  address: {
                    country: 'MX',
                    line1: address,
                  },
                  email: email,
                  name: businessName,
                }}
                clientSecret={clientSecret}
                currency={selectedPlan.currency.toUpperCase()}
                disabled={isLoading}
                onError={handlePaymentError}
                onSuccess={(paymentIntent) => handlePaymentSuccess(paymentIntent.id)}
              />
            </StripeProvider>
          )}

          <ButtonGroup>
            <Button $variant='secondary' disabled={isLoading} onClick={goBackToRegistration}>
              Regresar
            </Button>
          </ButtonGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </PaymentContainer>
      )}

      <LinkContainer>
        <p>
          ¿Ya tienes cuenta empresarial? <AuthLink href='/auth/login'>Iniciar sesión</AuthLink>
        </p>
      </LinkContainer>
    </FormContainer>
  );
};
