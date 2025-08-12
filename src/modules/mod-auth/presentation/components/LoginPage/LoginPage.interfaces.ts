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
