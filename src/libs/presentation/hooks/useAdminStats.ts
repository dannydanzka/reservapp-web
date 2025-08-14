import { useEffect, useState } from 'react';

import { AdminStats, AdminStatsService } from '@libs/services/api/adminStatsService';
import { DASHBOARD_CONFIG, getRefreshInterval } from '@libs/shared/constants/dashboard.constants';

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await AdminStatsService.getStats();

      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Only set up auto-refresh if enabled
    if (!DASHBOARD_CONFIG.AUTO_REFRESH_ENABLED) {
      return;
    }

    // Use configured refresh interval with development adjustments
    const refreshInterval = getRefreshInterval(DASHBOARD_CONFIG.STATS_REFRESH_INTERVAL);

    const interval = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(interval);
  }, []);

  return {
    error,
    loading,
    refetch: fetchStats,
    stats,
  };
};
