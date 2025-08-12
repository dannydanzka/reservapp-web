export interface ContactPageProps {}

export interface FormData {
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
}

export interface ContactPageState {
  formData: FormData;
  loading: boolean;
  success: boolean;
  error: string;
}
