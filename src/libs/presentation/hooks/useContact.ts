import { useState } from 'react';

import type { ContactFormCreateData } from '@libs/services/api/types/contact.types';
import { ContactService } from '@libs/services/api/contactService';

interface UseContactFormState {
  loading: boolean;
  success: boolean;
  error: string;
}

interface UseContactFormReturn extends UseContactFormState {
  submitContactForm: (data: ContactFormCreateData) => Promise<boolean>;
  resetState: () => void;
}

/**
 * Hook for managing contact form submission
 */
export const useContactForm = (): UseContactFormReturn => {
  const [state, setState] = useState<UseContactFormState>({
    error: '',
    loading: false,
    success: false,
  });

  const submitContactForm = async (data: ContactFormCreateData): Promise<boolean> => {
    setState({ error: '', loading: true, success: false });

    try {
      const result = await ContactService.createContactForm(data);

      if (result.success) {
        setState({ error: '', loading: false, success: true });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setState((prev) => ({ ...prev, success: false }));
        }, 5000);

        return true;
      } else {
        setState({
          error: result.message || 'Error al enviar el formulario',
          loading: false,
          success: false,
        });
        return false;
      }
    } catch (error) {
      setState({
        error: 'Error de conexión. Por favor verifica tu internet e inténtalo de nuevo.',
        loading: false,
        success: false,
      });
      return false;
    }
  };

  const resetState = () => {
    setState({ error: '', loading: false, success: false });
  };

  return {
    ...state,
    resetState,
    submitContactForm,
  };
};
