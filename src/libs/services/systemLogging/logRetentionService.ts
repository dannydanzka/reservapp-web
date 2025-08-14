import { SystemLogCategory, SystemLogLevel } from '@prisma/client';

import { SystemLoggingService } from './systemLoggingService';

export interface LogRetentionPolicy {
  level: SystemLogLevel;
  category?: SystemLogCategory;
  retentionDays: number;
  description: string;
}

export interface LogRetentionStats {
  totalLogsProcessed: number;
  logsDeleted: number;
  bytesFreed: number;
  oldestLogDate: Date;
  newestLogDate: Date;
  averageLogsPerDay: number;
}

/**
 * Service for managing log retention policies and system optimizations
 */
export class LogRetentionService {
  // Default retention policies
  private static readonly DEFAULT_POLICIES: LogRetentionPolicy[] = [
    {
      description: 'Debug logs kept for 7 days for development troubleshooting',
      level: SystemLogLevel.DEBUG,
      retentionDays: 7,
    },
    {
      description: 'Info logs kept for 30 days for operational monitoring',
      level: SystemLogLevel.INFO,
      retentionDays: 30,
    },
    {
      description: 'Warning logs kept for 90 days for pattern analysis',
      level: SystemLogLevel.WARN,
      retentionDays: 90,
    },
    {
      description: 'Error logs kept for 180 days for incident analysis',
      level: SystemLogLevel.ERROR,
      retentionDays: 180,
    },
    {
      description: 'Critical logs kept for 1 year for compliance and security',
      level: SystemLogLevel.CRITICAL,
      retentionDays: 365,
    },
  ];

  // Category-specific retention policies
  private static readonly CATEGORY_POLICIES: LogRetentionPolicy[] = [
    {
      category: SystemLogCategory.AUDIT_TRAIL,
      // 7 years for compliance
      description: 'Audit trail logs kept for 7 years for regulatory compliance',

      level: SystemLogLevel.INFO,
      retentionDays: 2555,
    },
    {
      category: SystemLogCategory.PAYMENT_PROCESSING,
      // 7 years
      description: 'Payment logs kept for 7 years for financial compliance',

      level: SystemLogLevel.INFO,
      retentionDays: 2555,
    },
    {
      category: SystemLogCategory.SECURITY_EVENT,
      description: 'Security events kept for 1 year for incident response',
      level: SystemLogLevel.INFO,
      retentionDays: 365,
    },
    {
      category: SystemLogCategory.AUTHENTICATION,
      description: 'Authentication logs kept for 90 days for security monitoring',
      level: SystemLogLevel.INFO,
      retentionDays: 90,
    },
    {
      category: SystemLogCategory.API_REQUEST,
      description: 'API request logs kept for 30 days for performance monitoring',
      level: SystemLogLevel.INFO,
      retentionDays: 30,
    },
    {
      category: SystemLogCategory.PERFORMANCE,
      description: 'Performance logs kept for 30 days for optimization',
      level: SystemLogLevel.INFO,
      retentionDays: 30,
    },
  ];

  /**
   * Get all applicable retention policies
   */
  static getRetentionPolicies(): LogRetentionPolicy[] {
    return [...this.DEFAULT_POLICIES, ...this.CATEGORY_POLICIES];
  }

  /**
   * Get retention policy for specific log level and category
   */
  static getRetentionPeriod(level: SystemLogLevel, category?: SystemLogCategory): number {
    // First check for category-specific policies
    if (category) {
      const categoryPolicy = this.CATEGORY_POLICIES.find(
        (policy) => policy.level === level && policy.category === category
      );
      if (categoryPolicy) {
        return categoryPolicy.retentionDays;
      }
    }

    // Fall back to level-based policies
    const levelPolicy = this.DEFAULT_POLICIES.find((policy) => policy.level === level);
    return levelPolicy?.retentionDays || 90; // Default to 90 days
  }

  /**
   * Execute automatic log cleanup based on retention policies
   */
  static async executeRetentionPolicies(): Promise<LogRetentionStats> {
    const startTime = Date.now();
    let totalLogsProcessed = 0;
    let logsDeleted = 0;

    try {
      // Log the start of retention process
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        eventType: 'log_retention_start',
        level: SystemLogLevel.INFO,
        message: 'Starting automated log retention process',
        metadata: {
          policies: this.getRetentionPolicies(),
        },
      });

      // Execute cleanup for each retention policy
      for (const policy of this.getRetentionPolicies()) {
        try {
          const deleted = await SystemLoggingService.cleanupOldLogs(policy.retentionDays);
          logsDeleted += deleted;
          totalLogsProcessed += deleted;

          // Log policy execution
          await SystemLoggingService.createLog({
            category: SystemLogCategory.SYSTEM_ERROR,
            eventType: 'log_retention_policy_executed',
            level: SystemLogLevel.INFO,
            message: `Executed retention policy: ${policy.description}`,
            metadata: {
              deletedCount: deleted,
              policy,
            },
          });
        } catch (error) {
          // Log policy execution error
          await SystemLoggingService.createLog({
            category: SystemLogCategory.SYSTEM_ERROR,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            eventType: 'log_retention_policy_error',
            level: SystemLogLevel.ERROR,
            message: `Failed to execute retention policy: ${policy.description}`,
            metadata: {
              policy,
            },
          });
        }
      }

      // Calculate stats
      const duration = Date.now() - startTime;
      const stats: LogRetentionStats = {
        averageLogsPerDay: Math.round(totalLogsProcessed / 30),
        bytesFreed: logsDeleted * 1024,

        logsDeleted,

        // 1 year ago
        newestLogDate: new Date(),

        // Rough estimate
        oldestLogDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),

        totalLogsProcessed, // 30-day average
      };

      // Log completion
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        duration,
        eventType: 'log_retention_completed',
        level: SystemLogLevel.INFO,
        message: 'Automated log retention process completed successfully',
        metadata: stats,
      });

      return stats;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Log critical error
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        duration,
        errorMessage,
        eventType: 'log_retention_failed',
        level: SystemLogLevel.CRITICAL,
        message: 'Automated log retention process failed critically',
        metadata: {
          logsDeleted,
          totalLogsProcessed,
        },
      });

      throw error;
    }
  }

  /**
   * Monitor log growth and alert if thresholds are exceeded
   */
  static async monitorLogGrowth(): Promise<void> {
    try {
      const stats = await SystemLoggingService.getLogStats('day');

      // Define thresholds
      const ERROR_THRESHOLD = 1000; // More than 1000 errors per day
      const CRITICAL_THRESHOLD = 10; // More than 10 critical logs per day
      const TOTAL_LOGS_THRESHOLD = 50000; // More than 50k logs per day

      // Check error threshold
      if (stats.recentErrors > ERROR_THRESHOLD) {
        await SystemLoggingService.createLog({
          category: SystemLogCategory.PERFORMANCE,
          eventType: 'high_error_rate_detected',
          level: SystemLogLevel.WARN,
          message: `High error rate detected: ${stats.recentErrors} errors in last 24 hours`,
          metadata: {
            errorCount: stats.recentErrors,
            stats,
            threshold: ERROR_THRESHOLD,
          },
        });
      }

      // Check critical threshold
      if (stats.criticalAlerts > CRITICAL_THRESHOLD) {
        await SystemLoggingService.createLog({
          category: SystemLogCategory.SECURITY_EVENT,
          eventType: 'high_critical_alert_rate',
          level: SystemLogLevel.CRITICAL,
          message: `High critical alert rate: ${stats.criticalAlerts} critical logs in last 24 hours`,
          metadata: {
            criticalCount: stats.criticalAlerts,
            stats,
            threshold: CRITICAL_THRESHOLD,
          },
        });
      }

      // Check total logs threshold
      if (stats.totalLogs > TOTAL_LOGS_THRESHOLD) {
        await SystemLoggingService.createLog({
          category: SystemLogCategory.PERFORMANCE,
          eventType: 'high_log_volume_detected',
          level: SystemLogLevel.WARN,
          message: `High log volume detected: ${stats.totalLogs} logs in last 24 hours`,
          metadata: {
            stats,
            threshold: TOTAL_LOGS_THRESHOLD,
            totalLogs: stats.totalLogs,
          },
        });
      }

      // Check performance
      if (stats.averageResponseTime > 5000) {
        // More than 5 seconds
        await SystemLoggingService.createLog({
          category: SystemLogCategory.PERFORMANCE,
          eventType: 'slow_response_time_detected',
          level: SystemLogLevel.WARN,
          message: `Slow average response time detected: ${stats.averageResponseTime}ms`,
          metadata: {
            averageResponseTime: stats.averageResponseTime,
            stats,
            threshold: 5000,
          },
        });
      }
    } catch (error) {
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        eventType: 'log_monitoring_error',
        level: SystemLogLevel.ERROR,
        message: 'Failed to monitor log growth',
      });
    }
  }

  /**
   * Optimize log storage by analyzing patterns and suggesting improvements
   */
  static async optimizeLogStorage(): Promise<void> {
    try {
      // Get log statistics for optimization analysis
      const stats = await SystemLoggingService.getLogStats('week');

      // Analyze log patterns
      const optimizations = [];

      // Check for excessive debug logs
      if (stats.byLevel.DEBUG > stats.totalLogs * 0.5) {
        optimizations.push({
          description: 'Excessive DEBUG logs detected. Consider reducing log level in production.',
          impact: 'High',
          recommendation: 'Set log level to INFO or higher in production environment',
          type: 'debug_optimization',
        });
      }

      // Check for excessive API request logs
      if (stats.byCategory.API_REQUEST > stats.totalLogs * 0.7) {
        optimizations.push({
          description: 'High volume of API request logs. Consider sampling or filtering.',
          impact: 'Medium',
          recommendation: 'Implement log sampling for successful API requests',
          type: 'api_log_optimization',
        });
      }

      // Check for missing categories
      const expectedCategories = Object.values(SystemLogCategory);
      const missingCategories = expectedCategories.filter(
        (category) => stats.byCategory[category] === 0
      );

      if (missingCategories.length > 0) {
        optimizations.push({
          description: 'Some log categories have no entries. Verify logging implementation.',
          impact: 'Low',
          recommendation: `Review logging for categories: ${missingCategories.join(', ')}`,
          type: 'missing_categories',
        });
      }

      // Log optimization analysis
      await SystemLoggingService.createLog({
        category: SystemLogCategory.PERFORMANCE,
        eventType: 'log_optimization_analysis',
        level: SystemLogLevel.INFO,
        message: `Log storage optimization analysis completed. Found ${optimizations.length} recommendations.`,
        metadata: {
          analysisDate: new Date(),
          optimizations,
          stats,
        },
      });
    } catch (error) {
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        eventType: 'log_optimization_error',
        level: SystemLogLevel.ERROR,
        message: 'Failed to perform log storage optimization analysis',
      });
    }
  }

  /**
   * Schedule automated maintenance tasks
   */
  static async scheduleMaintenanceTasks(): Promise<void> {
    try {
      // This would typically be called by a cron job or scheduled task

      // Daily tasks
      await this.monitorLogGrowth();

      // Weekly tasks (every Sunday)
      const now = new Date();
      if (now.getDay() === 0) {
        // Sunday
        await this.executeRetentionPolicies();
        await this.optimizeLogStorage();
      }

      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        eventType: 'log_maintenance_scheduled',
        level: SystemLogLevel.INFO,
        message: 'Log maintenance tasks scheduled and executed successfully',
        metadata: {
          executionTime: now,
          tasksExecuted: [
            'monitorLogGrowth',
            ...(now.getDay() === 0 ? ['executeRetentionPolicies', 'optimizeLogStorage'] : []),
          ],
        },
      });
    } catch (error) {
      await SystemLoggingService.createLog({
        category: SystemLogCategory.SYSTEM_ERROR,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        eventType: 'log_maintenance_error',
        level: SystemLogLevel.CRITICAL,
        message: 'Failed to execute scheduled log maintenance tasks',
      });

      throw error;
    }
  }
}
