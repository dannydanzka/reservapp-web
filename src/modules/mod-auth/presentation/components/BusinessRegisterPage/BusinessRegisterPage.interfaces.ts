export interface BusinessRegisterPageProps {}

export interface BusinessRegisterPageState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  phone: string;
  address: string;
  selectedPlace: {
    placeId: string;
    coordinates?: { lat: number; lng: number };
  } | null;
  selectedPackage: 'inicial' | 'profesional' | 'enterprise';
  error: string;
  isLoading: boolean;
  currentStep: 'registration' | 'payment';
  paymentIntentId: string | null;
  clientSecret: string | null;
}

export interface StepProps {
  $isActive: boolean;
  $isCompleted: boolean;
}

export interface ButtonProps {
  $isLoading?: boolean;
  $variant?: 'primary' | 'secondary' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
}

export interface PackageCardProps {
  $selected: boolean;
}

export interface SubscriptionPackage {
  amount: number;
  currency: string;
  features: string[];
  name: string;
  period: string;
  popular?: boolean;
}

export interface SubscriptionPackages {
  inicial: SubscriptionPackage;
  profesional: SubscriptionPackage;
  enterprise: SubscriptionPackage;
}
