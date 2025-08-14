export interface UserRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface UserRegisterPageProps {
  // Props específicas del componente (si las hay en el futuro)
}

export interface RegisterApiRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterApiResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  };
}
