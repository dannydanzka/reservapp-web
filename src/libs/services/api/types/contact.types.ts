export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactFormStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ContactFormStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED',
}

export interface ContactFormCreateData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactFormUpdateData {
  status?: ContactFormStatus;
  notes?: string;
}

export interface ContactFormFilters {
  status?: ContactFormStatus;
  page?: number;
  limit?: number;
}
