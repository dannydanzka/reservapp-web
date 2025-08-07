'use client';

import React, { useState } from 'react';

import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { BusinessRegistrationData } from '@/modules/mod-auth/domain/interfaces/auth.interfaces';
import { GooglePlacesAutocomplete } from '@/libs/ui/components/GooglePlacesAutocomplete';
import { LoadingSpinner } from '@/libs/ui/components/LoadingSpinner';
import { StripePaymentForm } from '@/libs/ui/components/StripePaymentForm/StripePaymentForm';
import { StripeProvider } from '@/libs/ui/providers/StripeProvider';
import { useAuth } from '@/libs/ui/providers/AuthProvider';
import { useToast } from '@/libs/ui/providers/ToastProvider';
import { useTranslation } from '@/libs/i18n';

const FormContainer = styled.div`
  width: 100%;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Step = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ $isActive, $isCompleted, theme }) => {
    if ($isCompleted) {
      return `
        background-color: ${theme.colors.success[100]};
        color: ${theme.colors.success[700]};
      `;
    }
    if ($isActive) {
      return `
        background-color: ${theme.colors.primary[100]};
        color: ${theme.colors.primary[700]};
      `;
    }
    return `
      background-color: transparent;
      color: ${theme.colors.secondary[500]};
    `;
  }}
`;

const StepSeparator = styled.div`
  width: ${({ theme }) => theme.spacing[8]};
  height: 2px;
  background-color: ${({ theme }) => theme.colors.secondary[200]};
  margin: 0 ${({ theme }) => theme.spacing[2]};
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

const _Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
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

const BusinessInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const BusinessInfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const BusinessInfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1.5;
`;

const PricingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const PricingAmount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PricingPeriod = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const _PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const _PricingFeature = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[700]};
  padding: ${({ theme }) => theme.spacing[1]} 0;

  &:before {
    content: '✓';
    color: ${({ theme }) => theme.colors.success[500]};
    font-weight: bold;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
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

const PaymentContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const PackageSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PackageCard = styled.div<{ $selected: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary[500] : theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  ${({ $selected, theme }) =>
    $selected &&
    `
    background-color: ${theme.colors.primary[50]};
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.secondary[500]};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
`;

const PackageName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PackagePrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PackagePeriod = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PackageFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const PackageFeature = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[700]};
  padding: ${({ theme }) => theme.spacing[1]} 0;
  display: flex;
  align-items: center;

  &:before {
    content: '✓';
    color: ${({ theme }) => theme.colors.success[500]};
    font-weight: bold;
    margin-right: ${({ theme }) => theme.spacing[2]};
    flex-shrink: 0;
  }
`;

const PackageSelectorTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

/**
 * Business registration page component with multi-step flow and payment integration.
 */
export const RegisterPage: React.FC = () => {
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
  const SUBSCRIPTION_PACKAGES = {
    enterprise: {
      amount: 4999,
      // $4,999 MXN/month
      currency: 'mxn',
      features: [
        'Todo lo del Plan Profesional',
        'Empleados ilimitados',
        'Multi-sucursal',
        'API personalizada',
        'Integración con sistemas externos',
        'Gerente de cuenta dedicado',
        'Capacitación personalizada',
        'SLA garantizado 99.9%',
      ],
      interval: 'month' as const,
      name: 'Plan Enterprise',
    },
    inicial: {
      amount: 1299,
      // $1,299 MXN/month
      currency: 'mxn',
      features: [
        'Panel administrativo completo',
        'Gestión de hasta 100 reservaciones/mes',
        'Hasta 3 empleados',
        'Reportes básicos',
        'Soporte técnico por email',
      ],
      interval: 'month' as const,
      name: 'Plan Inicial',
    },
    profesional: {
      amount: 2499,
      // $2,499 MXN/month
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
      interval: 'month' as const,
      name: 'Plan Profesional',
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
        variant: 'error', // Longer duration for payment errors
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
      variant: 'error', // Longer duration for payment errors
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
