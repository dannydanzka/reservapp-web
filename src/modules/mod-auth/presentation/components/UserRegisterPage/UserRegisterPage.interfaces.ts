export interface UserRegisterPageProps {}

export interface UserRegisterPageState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
}

export interface ButtonProps {
  $isLoading?: boolean;
  $variant?: 'primary' | 'secondary';
}

export interface PlanInfoProps {
  $isPremium: boolean;
}

export interface PlanPriceProps {
  $isPremium: boolean;
}
