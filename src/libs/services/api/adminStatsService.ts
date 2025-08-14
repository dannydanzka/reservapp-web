import { ApiResponse } from './types/common.types';

export interface AdminStats {
  totalReservations: number;
  activeVenues: number;
  monthlyRevenue: number;
  totalUsers: number;
  recentReservations: Array<{
    id: string;
    userName: string;
    userEmail: string;
    venueName: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  popularVenues: Array<{
    id: string;
    name: string;
    category: string;
    reservationsCount: number;
    rating: number;
  }>;
  revenueChartData: Array<{
    month: string;
    revenue: number;
  }>;
  reservationsChartData: Array<{
    month: string;
    reservations: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  }>;
}

export class AdminStatsService {
  private static readonly BASE_PATH = '/api/admin/stats';

  static async getStats(): Promise<ApiResponse<AdminStats>> {
    try {
      // Get the token from localStorage (using the correct key)
      let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Remove quotes if present (localStorage sometimes stores with quotes)
      token = token.replace(/^"(.*)"$/, '$1');

      const response = await fetch(this.BASE_PATH, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas');
      }

      const data = await response.json();

      return {
        data: data.data as AdminStats,
        success: true,
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
        success: false,
      };
    }
  }
}
