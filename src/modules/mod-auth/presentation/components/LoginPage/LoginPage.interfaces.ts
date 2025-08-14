export interface LoginPageProps {}

export interface LoginPageState {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
}

export interface SubmitButtonProps {
  $isLoading: boolean;
}

export interface FormSectionProps {
  children: React.ReactNode;
}

export interface LoginFormContainerProps {
  children: React.ReactNode;
}
