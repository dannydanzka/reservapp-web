// Removed authFetch import - using direct fetch like dashboard

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
  category?: 'email' | 'system';
  startDate?: string;
  endDate?: string;
  userId?: string;
  level?: 'all' | 'unread' | 'read';
  search?: string;
}

export interface NotificationStatsFilters {
  period?: 'today' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  emailSent: boolean;
  emailType?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  venue?: {
    id: string;
    name: string;
    category: string;
  };
  service?: {
    id: string;
    name: string;
    category: string;
    venue?: {
      id: string;
      name: string;
    };
  };
  reservation?: {
    id: string;
    confirmationId: string;
    status: string;
    checkInDate: string;
  };
  metadata?: any;
}

export interface PaginatedNotifications {
  success: boolean;
  data: {
    notifications: AdminNotification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      totalNotifications: number;
      unreadCount: number;
      emailCount: number;
      systemCount: number;
    };
    filters: {
      appliedFilters: NotificationFilters;
      userRole: string;
      userId: string;
    };
  };
}

export interface NotificationStats {
  success: boolean;
  data: {
    period: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    overview: {
      totalNotifications: number;
      emailNotifications: number;
      systemNotifications: number;
      unreadCount: number;
      readCount: number;
    };
    byType: Record<string, number>;
    byDay: Array<{
      date: string;
      count: number;
      emailCount: number;
      systemCount: number;
      unreadCount: number;
    }>;
    topUsers: Array<{
      userId: string;
      notificationCount: number;
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }>;
    recentActivity: Array<{
      id: string;
      type: string;
      title: string;
      isRead: boolean;
      emailSent: boolean;
      createdAt: string;
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      venue?: {
        id: string;
        name: string;
      };
    }>;
    emailTypes: Record<string, number>;
    userRole: string;
    adminVenuesCount: number | null;
  };
}

export interface BulkUpdateNotificationsRequest {
  notificationIds: string[];
  isRead: boolean;
}

export interface BulkUpdateNotificationsResponse {
  success: boolean;
  data: {
    updatedCount: number;
    isRead: boolean;
    notificationIds: string[];
  };
}

class AdminNotificationService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Get auth token from localStorage (same pattern as AdminStatsService)
   */
  private getAuthToken(): string {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Remove quotes if present (localStorage sometimes stores with quotes)
    return token.replace(/^"(.*)"$/, '$1');
  }

  /**
   * Get paginated notifications with filters
   * Supports different visibility based on user role:
   * - SUPER_ADMIN: See all notifications
   * - ADMIN: See only notifications related to their venues/services
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<PaginatedNotifications> {
    const token = this.getAuthToken();

    const searchParams = new URLSearchParams();

    // Add pagination parameters
    if (filters.page) searchParams.append('page', filters.page.toString());
    if (filters.limit) searchParams.append('limit', filters.limit.toString());

    // Add filter parameters
    if (filters.isRead !== undefined) searchParams.append('isRead', filters.isRead.toString());
    if (filters.type) searchParams.append('type', filters.type);
    if (filters.category) searchParams.append('category', filters.category);
    if (filters.startDate) searchParams.append('startDate', filters.startDate);
    if (filters.endDate) searchParams.append('endDate', filters.endDate);
    if (filters.userId) searchParams.append('userId', filters.userId);
    if (filters.level) searchParams.append('level', filters.level);
    if (filters.search) searchParams.append('search', filters.search);

    const response = await fetch(`${this.baseUrl}/admin/notifications?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get notification statistics for dashboard
   * Role-based statistics:
   * - SUPER_ADMIN: Statistics for all notifications
   * - ADMIN: Statistics for notifications related to their venues only
   */
  async getNotificationStats(filters: NotificationStatsFilters = {}): Promise<NotificationStats> {
    const token = this.getAuthToken();

    const searchParams = new URLSearchParams();

    if (filters.period) searchParams.append('period', filters.period);
    if (filters.startDate) searchParams.append('startDate', filters.startDate);
    if (filters.endDate) searchParams.append('endDate', filters.endDate);

    const response = await fetch(
      `${this.baseUrl}/admin/notifications/stats?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch notification stats: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Bulk update notifications (mark as read/unread)
   * Respects user permissions - ADMIN can only update notifications related to their venues
   */
  async bulkUpdateNotifications(
    data: BulkUpdateNotificationsRequest
  ): Promise<BulkUpdateNotificationsResponse> {
    const token = this.getAuthToken();

    const response = await fetch(`${this.baseUrl}/admin/notifications`, {
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update notifications: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Mark a single notification as read/unread
   */
  async updateNotificationStatus(
    notificationId: string,
    isRead: boolean
  ): Promise<BulkUpdateNotificationsResponse> {
    return this.bulkUpdateNotifications({
      isRead,
      notificationIds: [notificationId],
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(filters: NotificationFilters = {}): Promise<BulkUpdateNotificationsResponse> {
    // First get all unread notification IDs based on current filters
    const notifications = await this.getNotifications({
      ...filters,
      isRead: false,
      limit: 1000, // Get a large batch
    });

    const notificationIds = notifications.data.notifications.map((n) => n.id);

    if (notificationIds.length === 0) {
      return {
        data: {
          isRead: true,
          notificationIds: [],
          updatedCount: 0,
        },
        success: true,
      };
    }

    return this.bulkUpdateNotifications({
      isRead: true,
      notificationIds,
    });
  }

  /**
   * Get notification types available for filtering
   */
  getNotificationTypes(): Array<{ value: string; label: string }> {
    return [
      { label: 'Usuario Registrado', value: 'USER_REGISTERED' },
      { label: 'Negocio Registrado', value: 'BUSINESS_REGISTERED' },
      { label: 'Reserva Creada', value: 'RESERVATION_CREATED' },
      { label: 'Reserva Cancelada', value: 'RESERVATION_CANCELLED' },
      { label: 'Pago Recibido', value: 'PAYMENT_RECEIVED' },
      { label: 'Pago Fallido', value: 'PAYMENT_FAILED' },
      { label: 'Formulario de Contacto', value: 'CONTACT_FORM' },
      { label: 'Venue Creado', value: 'VENUE_CREATED' },
      { label: 'Servicio Creado', value: 'SERVICE_CREATED' },
      { label: 'Alerta del Sistema', value: 'SYSTEM_ALERT' },
    ];
  }

  /**
   * Get email types available for filtering
   */
  getEmailTypes(): Array<{ value: string; label: string }> {
    return [
      { label: 'Bienvenida', value: 'welcome' },
      { label: 'Confirmación de Reserva', value: 'reservation_confirmation' },
      { label: 'Bienvenida Empresarial', value: 'business_welcome' },
      { label: 'Consulta de Contacto', value: 'contact_inquiry' },
      { label: 'Recibo de Pago', value: 'payment_receipt' },
      { label: 'Recordatorio de Reserva', value: 'reservation_reminder' },
      { label: 'Aviso de Cancelación', value: 'cancellation_notice' },
    ];
  }
}

export const adminNotificationService = new AdminNotificationService();
export default adminNotificationService;
