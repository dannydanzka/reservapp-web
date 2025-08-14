// Component exports
export { LoginPage } from './LoginPage';
export { UserRegisterPage } from './UserRegisterPage';
export { BusinessRegisterPage } from './BusinessRegisterPage';

// Legacy component for backward compatibility - DEPRECATED
// Use BusinessRegisterPage for new code
export { RegisterPage } from './RegisterPage';

// Type exports - LoginPage
export type {
  LoginPageProps,
  LoginPageState,
  SubmitButtonProps,
  FormSectionProps,
  LoginFormContainerProps,
} from './LoginPage';

// Type exports - UserRegisterPage
export type {
  UserRegisterPageProps,
  UserRegisterFormData,
  RegisterApiRequest,
  RegisterApiResponse,
} from './UserRegisterPage';

// Type exports - BusinessRegisterPage
export type {
  BusinessRegisterPageProps,
  BusinessRegisterPageState,
  StepProps,
  ButtonProps,
  PackageCardProps,
  SubscriptionPackage,
  SubscriptionPackages,
} from './BusinessRegisterPage';

// Type exports - RegisterPage (legacy)
export type { RegisterPageProps, RegisterPageState } from './RegisterPage';
