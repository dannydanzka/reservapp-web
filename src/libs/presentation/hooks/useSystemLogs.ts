import { useCallback, useRef, useState } from 'react';

import { SystemLogCategory, SystemLogLevel } from '@prisma/client';
import type {
  SystemLogFilters,
  SystemLogItem,
  SystemLogStats,
} from '@modules/mod-admin/presentation/components/pages/SystemLogsPage/SystemLogsPage.interfaces';

interface UseSystemLogsReturn {
  // Data state
  logs: SystemLogItem[];
  stats: SystemLogStats | null;
  loading: boolean;
  error: string | null;

  // Pagination state
  total: number;
  totalPages: number;
  hasMore: boolean;

  // Actions
  fetchLogs: (filters?: SystemLogFilters, page?: number) => Promise<void>;
  fetchStats: (timeframe?: 'hour' | 'day' | 'week' | 'month') => Promise<void>;
  exportLogs: (filters?: SystemLogFilters) => Promise<void>;
  cleanupLogs: (retentionDays?: number) => Promise<void>;
  refreshLogs: () => Promise<void>;
}

interface SystemLogsResponse {
  success: boolean;
  data: {
    logs: SystemLogItem[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface SystemStatsResponse {
  success: boolean;
  data: SystemLogStats;
}

interface CleanupResponse {
  success: boolean;
  data: {
    deletedCount: number;
    retentionDays: number;
    message: string;
  };
}

/**
 * Custom hook for system logs management
 *
 * Provides functionality for:
 * - Fetching and filtering system logs
 * - Getting system statistics
 * - Exporting logs to CSV
 * - Cleaning up old logs
 * - Real-time refresh capabilities
 */
export const useSystemLogs = (): UseSystemLogsReturn => {
  // State management
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [stats, setStats] = useState<SystemLogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Store current filters and page for refresh
  const currentFiltersRef = useRef<SystemLogFilters>({
    category: [],
    dateFrom: '',
    dateTo: '',
    eventType: '',
    level: [],
    resourceId: '',
    resourceType: '',
    search: '',
    userId: '',
  });
  const currentPageRef = useRef<number>(1);

  /**
   * Fetch system logs with filtering and pagination
   */
  const fetchLogs = useCallback(async (filters?: SystemLogFilters, page = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Store current state for refresh
      currentFiltersRef.current = filters;
      currentPageRef.current = page;

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (page > 1) {
        queryParams.append('page', page.toString());
      }

      if (filters) {
        // Level filters
        filters.level.forEach((level) => {
          queryParams.append('level', level);
        });

        // Category filters
        filters.category.forEach((category) => {
          queryParams.append('category', category);
        });

        // Other filters
        if (filters.eventType) queryParams.append('eventType', filters.eventType);
        if (filters.userId) queryParams.append('userId', filters.userId);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
        if (filters.resourceId) queryParams.append('resourceId', filters.resourceId);
        if (filters.search) queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/admin/system-logs?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: SystemLogsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.data?.toString() || 'Failed to fetch system logs');
      }

      // Update state
      setLogs(data.data.logs);
      setTotal(data.data.total);
      setTotalPages(data.data.totalPages);
      setHasMore(data.data.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching system logs:', errorMessage);
      setError(errorMessage);

      // Reset data on error
      setLogs([]);
      setTotal(0);
      setTotalPages(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch system log statistics
   */
  const fetchStats = useCallback(
    async (timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<void> => {
      try {
        const queryParams = new URLSearchParams({ timeframe });

        const response = await fetch(`/api/admin/system-logs/stats?${queryParams.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data: SystemStatsResponse = await response.json();

        if (!data.success) {
          throw new Error('Failed to fetch system log statistics');
        }

        setStats(data.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
        console.error('Error fetching system log statistics:', errorMessage);
        // Don't set global error for stats, as it's not critical
      }
    },
    []
  );

  /**
   * Export system logs to CSV
   */
  const exportLogs = useCallback(async (filters?: SystemLogFilters): Promise<void> => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (filters) {
        // Level filters
        filters.level.forEach((level) => {
          queryParams.append('level', level);
        });

        // Category filters
        filters.category.forEach((category) => {
          queryParams.append('category', category);
        });

        // Other filters
        if (filters.eventType) queryParams.append('eventType', filters.eventType);
        if (filters.userId) queryParams.append('userId', filters.userId);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
        if (filters.resourceId) queryParams.append('resourceId', filters.resourceId);
        if (filters.search) queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/admin/system-logs/export?${queryParams.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'system-logs-export.csv';

      if (contentDisposition) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        if (matches) {
          filename = matches[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      console.error('Error exporting system logs:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clean up old system logs
   */
  const cleanupLogs = useCallback(async (retentionDays = 90): Promise<void> => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        retentionDays: retentionDays.toString(),
      });

      const response = await fetch(`/api/admin/system-logs/cleanup?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: CleanupResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to cleanup system logs');
      }

      // Show success message (could be handled by toast notification)
      console.info('System logs cleanup completed:', data.data.message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Cleanup failed';
      console.error('Error cleaning up system logs:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh logs with current filters and page
   */
  const refreshLogs = useCallback(async (): Promise<void> => {
    await fetchLogs(currentFiltersRef.current, currentPageRef.current);
  }, [fetchLogs]);

  return {
    cleanupLogs,

    error,

    exportLogs,

    // Actions
    fetchLogs,

    fetchStats,

    hasMore,

    loading,

    // Data state
    logs,

    refreshLogs,

    stats,
    // Pagination state
    total,
    totalPages,
  };
};
