import type { ApiResponse, PaginatedResponse } from './types/common.types';
import type {
  ContactForm,
  ContactFormCreateData,
  ContactFormUpdateData,
} from './types/contact.types';

export interface ContactFormFilters {
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  page?: number;
  limit?: number;
}

export class ContactService {
  private static readonly BASE_URL = '/api/contact';

  /**
   * Create a new contact form submission
   */
  static async createContactForm(data: ContactFormCreateData): Promise<ApiResponse<ContactForm>> {
    try {
      const response = await fetch(this.BASE_URL, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error,
          message: result.error || 'Error al enviar el formulario de contacto',
          success: false,
        };
      }

      return {
        data: result.data,
        message: result.message || 'Formulario enviado exitosamente',
        success: true,
      };
    } catch (error) {
      console.error('Error creating contact form:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error de conexión. Por favor verifica tu internet e inténtalo de nuevo.',
        success: false,
      };
    }
  }

  /**
   * Get contact forms (admin only)
   */
  static async getContactForms(
    filters: ContactFormFilters = {}
  ): Promise<ApiResponse<PaginatedResponse<ContactForm>>> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);

      const url = `${this.BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error,
          message: result.error || 'Error al obtener los formularios de contacto',
          success: false,
        };
      }

      return {
        data: {
          data: result.data,
          pagination: result.pagination,
        },
        success: true,
      };
    } catch (error) {
      console.error('Error fetching contact forms:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error de conexión al obtener los formularios',
        success: false,
      };
    }
  }

  /**
   * Update contact form status (admin only)
   */
  static async updateContactForm(
    id: string,
    data: ContactFormUpdateData
  ): Promise<ApiResponse<ContactForm>> {
    try {
      const response = await fetch(this.BASE_URL, {
        body: JSON.stringify({ id, ...data }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: result.error,
          message: result.error || 'Error al actualizar el formulario',
          success: false,
        };
      }

      return {
        data: result.data,
        message: 'Formulario actualizado exitosamente',
        success: true,
      };
    } catch (error) {
      console.error('Error updating contact form:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error de conexión al actualizar el formulario',
        success: false,
      };
    }
  }
}
