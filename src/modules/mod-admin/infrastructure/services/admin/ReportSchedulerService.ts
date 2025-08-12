import type {
  GenerateReportRequest,
  ReportFormat,
  ReportParameters,
  ReportSchedule,
  ReportType,
} from '@shared/types/reports';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

import { adminAuditService } from './AdminAuditService';
import { reportExportService } from './ReportExportService';
import { reportsService } from './ReportsService';

export interface CreateScheduleData {
  reportType: ReportType;
  name: string;
  description?: string;
  parameters: ReportParameters;
  format: ReportFormat;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  hour: number; // 0-23
  recipients: string[];
  createdBy: string;
}

export interface UpdateScheduleData {
  name?: string;
  description?: string;
  parameters?: ReportParameters;
  format?: ReportFormat;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  hour?: number;
  recipients?: string[];
  isActive?: boolean;
}

export class ReportSchedulerService {
  async createSchedule(data: CreateScheduleData): Promise<ReportSchedule> {
    try {
      const nextRun = this.calculateNextRun(
        data.frequency,
        data.hour,
        data.dayOfWeek,
        data.dayOfMonth
      );

      // In production, this would create a record in the database
      const schedule: ReportSchedule = {
        createdAt: new Date().toISOString(),
        createdBy: data.createdBy,
        dayOfMonth: data.dayOfMonth,
        dayOfWeek: data.dayOfWeek,
        description: data.description,
        format: data.format,
        frequency: data.frequency,
        hour: data.hour,
        id: `schedule_${Date.now()}`,
        isActive: true,
        name: data.name,
        nextRun: nextRun.toISOString(),
        parameters: data.parameters,
        recipients: data.recipients,
        reportType: data.reportType,
        updatedAt: new Date().toISOString(),
      };

      // Track schedule creation in audit log
      await adminAuditService.trackAction(
        { adminUserId: data.createdBy },
        {
          action: 'BULK_PAYMENT_UPDATE',

          metadata: {
            action: 'SCHEDULE_CREATE',
            frequency: data.frequency,
            recipients: data.recipients,
            reportType: data.reportType,
          },

          // Using existing type, ideally REPORT_SCHEDULE
          resourceId: schedule.id,
          // Using existing action, ideally SCHEDULE_CREATE
          resourceType: 'SYSTEM' as any,
        }
      );

      return schedule;
    } catch (error) {
      throw new Error(
        `Error creating schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async updateSchedule(
    scheduleId: string,
    data: UpdateScheduleData,
    updatedBy: string
  ): Promise<ReportSchedule> {
    try {
      // Get existing schedule (mock implementation)
      const existingSchedule = await this.getScheduleById(scheduleId);
      if (!existingSchedule) {
        throw new Error('Schedule not found');
      }

      // Update schedule data
      const updatedSchedule: ReportSchedule = {
        ...existingSchedule,
        dayOfMonth: data.dayOfMonth ?? existingSchedule.dayOfMonth,
        dayOfWeek: data.dayOfWeek ?? existingSchedule.dayOfWeek,
        description: data.description ?? existingSchedule.description,
        format: data.format ?? existingSchedule.format,
        frequency: data.frequency ?? existingSchedule.frequency,
        hour: data.hour ?? existingSchedule.hour,
        isActive: data.isActive ?? existingSchedule.isActive,
        name: data.name ?? existingSchedule.name,
        parameters: data.parameters ?? existingSchedule.parameters,
        recipients: data.recipients ?? existingSchedule.recipients,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate next run if schedule changed
      if (
        data.frequency ||
        data.hour !== undefined ||
        data.dayOfWeek !== undefined ||
        data.dayOfMonth !== undefined
      ) {
        const nextRun = this.calculateNextRun(
          updatedSchedule.frequency,
          updatedSchedule.hour,
          updatedSchedule.dayOfWeek,
          updatedSchedule.dayOfMonth
        );
        updatedSchedule.nextRun = nextRun.toISOString();
      }

      // Track schedule update in audit log
      await adminAuditService.trackAction(
        { adminUserId: updatedBy },
        {
          action: 'BULK_PAYMENT_UPDATE',

          metadata: {
            action: 'SCHEDULE_UPDATE',
            changes: Object.keys(data),
          },

          newValues: {
            frequency: updatedSchedule.frequency,
            isActive: updatedSchedule.isActive,
            recipients: updatedSchedule.recipients,
          },

          oldValues: {
            frequency: existingSchedule.frequency,
            isActive: existingSchedule.isActive,
            recipients: existingSchedule.recipients,
          },

          // Using existing type, ideally REPORT_SCHEDULE
          resourceId: scheduleId,
          // Using existing action, ideally SCHEDULE_UPDATE
          resourceType: 'SYSTEM' as any,
        }
      );

      return updatedSchedule;
    } catch (error) {
      throw new Error(
        `Error updating schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteSchedule(scheduleId: string, deletedBy: string): Promise<void> {
    try {
      const schedule = await this.getScheduleById(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // In production, this would delete from database

      // Track schedule deletion in audit log
      await adminAuditService.trackAction(
        { adminUserId: deletedBy },
        {
          action: 'BULK_PAYMENT_UPDATE',

          metadata: {
            action: 'SCHEDULE_DELETE',
            reportType: schedule.reportType,
            scheduleName: schedule.name,
          },

          // Using existing type, ideally REPORT_SCHEDULE
          resourceId: scheduleId,
          // Using existing action, ideally SCHEDULE_DELETE
          resourceType: 'SYSTEM' as any,
        }
      );
    } catch (error) {
      throw new Error(
        `Error deleting schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getSchedules(
    filters: {
      isActive?: boolean;
      reportType?: ReportType;
      createdBy?: string;
    } = {}
  ): Promise<ReportSchedule[]> {
    try {
      // Mock implementation - in production would query database
      const mockSchedules: ReportSchedule[] = [
        {
          createdAt: '2025-01-01T10:00:00Z',
          createdBy: 'admin_user_1',
          dayOfMonth: 1,
          description: 'Análisis de ingresos generado automáticamente cada mes',
          format: 'pdf',
          frequency: 'monthly',
          hour: 9,
          id: 'schedule_1',
          isActive: true,
          name: 'Reporte Mensual de Ingresos',
          nextRun: this.calculateNextRun('monthly', 9, undefined, 1).toISOString(),
          parameters: {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            dateTo: new Date().toISOString(),
            includeDetails: true,
          },
          recipients: ['admin@reservapp.com', 'finance@reservapp.com'],
          reportType: 'revenue_analysis',
          updatedAt: '2025-01-01T10:00:00Z',
        },
        {
          createdAt: '2025-01-05T14:00:00Z',
          createdBy: 'manager_user_1',
          dayOfWeek: 1,
          description: 'Reporte de reservaciones todos los lunes',
          format: 'excel',
          frequency: 'weekly',
          // Monday
          hour: 8,

          id: 'schedule_2',

          isActive: true,

          name: 'Resumen Semanal de Reservaciones',

          nextRun: this.calculateNextRun('weekly', 8, 1).toISOString(),
          parameters: {
            dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            dateTo: new Date().toISOString(),
            includeDetails: false,
          },
          recipients: ['operations@reservapp.com'],
          reportType: 'reservations_summary',
          updatedAt: '2025-01-05T14:00:00Z',
        },
      ];

      // Apply filters
      return mockSchedules.filter((schedule) => {
        if (filters.isActive !== undefined && schedule.isActive !== filters.isActive) {
          return false;
        }
        if (filters.reportType && schedule.reportType !== filters.reportType) {
          return false;
        }
        if (filters.createdBy && schedule.createdBy !== filters.createdBy) {
          return false;
        }
        return true;
      });
    } catch (error) {
      throw new Error(
        `Error fetching schedules: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getScheduleById(scheduleId: string): Promise<ReportSchedule | null> {
    try {
      const schedules = await this.getSchedules();
      return schedules.find((s) => s.id === scheduleId) || null;
    } catch (error) {
      return null;
    }
  }

  async getDueSchedules(): Promise<ReportSchedule[]> {
    try {
      const now = new Date();
      const schedules = await this.getSchedules({ isActive: true });

      return schedules.filter((schedule) => {
        const nextRun = new Date(schedule.nextRun);
        return nextRun <= now;
      });
    } catch (error) {
      throw new Error(
        `Error fetching due schedules: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async processScheduledReports(): Promise<{
    processed: number;
    successful: number;
    failed: Array<{ scheduleId: string; error: string }>;
  }> {
    const results = {
      failed: [] as Array<{ scheduleId: string; error: string }>,
      processed: 0,
      successful: 0,
    };

    try {
      const dueSchedules = await this.getDueSchedules();
      results.processed = dueSchedules.length;

      for (const schedule of dueSchedules) {
        try {
          await this.executeScheduledReport(schedule);
          results.successful++;

          // Update last run and calculate next run
          await this.updateScheduleAfterExecution(schedule);
        } catch (error) {
          results.failed.push({
            error: error instanceof Error ? error.message : 'Unknown error',
            scheduleId: schedule.id,
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(
        `Error processing scheduled reports: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async executeScheduledReport(schedule: ReportSchedule): Promise<void> {
    try {
      // Adjust parameters for current period
      const adjustedParameters = this.adjustParametersForSchedule(schedule);

      // Generate report request
      const reportRequest: GenerateReportRequest = {
        format: schedule.format,
        name: `Scheduled ${schedule.name}`,
        parameters: adjustedParameters,
        type: schedule.reportType,
      };

      // Generate the report
      const report = await reportsService.generateReport(reportRequest);

      // Send report to recipients
      if (schedule.recipients.length > 0) {
        await this.sendReportToRecipients(schedule, report);
      }
    } catch (error) {
      throw new Error(
        `Error executing scheduled report: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private adjustParametersForSchedule(schedule: ReportSchedule): ReportParameters {
    const now = new Date();
    let dateFrom: Date;
    let dateTo = now;

    switch (schedule.frequency) {
      case 'daily':
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 1);
        break;
      case 'weekly':
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case 'monthly':
        dateFrom = new Date(now);
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        break;
      case 'quarterly':
        dateFrom = new Date(now);
        dateFrom.setMonth(dateFrom.getMonth() - 3);
        break;
      default:
        dateFrom = new Date(schedule.parameters.dateFrom);
        dateTo = new Date(schedule.parameters.dateTo);
    }

    return {
      ...schedule.parameters,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    };
  }

  private async sendReportToRecipients(schedule: ReportSchedule, report: any): Promise<void> {
    try {
      // Mock email sending - in production would use email service
      console.log(`Sending report ${report.name} to:`, schedule.recipients);

      // Here you would integrate with your email service (e.g., Resend, SendGrid, etc.)
      // Example:
      // await emailService.sendEmail({
      //   to: schedule.recipients,
      //   subject: `Scheduled Report: ${schedule.name}`,
      //   body: `Your scheduled report "${schedule.name}" is ready.`,
      //   attachments: [{ url: report.fileUrl, name: `${report.name}.pdf` }]
      // });
    } catch (error) {
      console.error('Error sending report to recipients:', error);
      throw error;
    }
  }

  private async updateScheduleAfterExecution(schedule: ReportSchedule): Promise<void> {
    try {
      const nextRun = this.calculateNextRun(
        schedule.frequency,
        schedule.hour,
        schedule.dayOfWeek,
        schedule.dayOfMonth
      );

      // In production, update database record
      // await prisma.reportSchedule.update({
      //   where: { id: schedule.id },
      //   data: {
      //     lastRun: new Date(),
      //     nextRun: nextRun,
      //   },
      // });

      console.log(`Updated schedule ${schedule.id} - next run: ${nextRun.toISOString()}`);
    } catch (error) {
      console.error('Error updating schedule after execution:', error);
    }
  }

  private calculateNextRun(
    frequency: string,
    hour: number,
    dayOfWeek?: number,
    dayOfMonth?: number
  ): Date {
    const now = new Date();
    const nextRun = new Date();

    // Set the hour
    nextRun.setHours(hour, 0, 0, 0);

    switch (frequency) {
      case 'daily':
        // If the time has passed today, schedule for tomorrow
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;

      case 'weekly':
        if (dayOfWeek !== undefined) {
          // Calculate next occurrence of the specified day of week
          const currentDay = nextRun.getDay();
          let daysToAdd = dayOfWeek - currentDay;

          if (daysToAdd < 0 || (daysToAdd === 0 && nextRun <= now)) {
            daysToAdd += 7;
          }

          nextRun.setDate(nextRun.getDate() + daysToAdd);
        }
        break;

      case 'monthly':
        if (dayOfMonth !== undefined) {
          // Set to the specified day of month
          nextRun.setDate(dayOfMonth);

          // If the day has passed this month, go to next month
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
            nextRun.setDate(dayOfMonth);
          }
        }
        break;

      case 'quarterly': {
        // Set to first day of next quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const nextQuarter = (currentQuarter + 1) % 4;
        const nextQuarterMonth = nextQuarter * 3;

        nextRun.setMonth(nextQuarterMonth, 1);

        // If we're already in the future, it's for next year
        if (nextRun <= now) {
          nextRun.setFullYear(nextRun.getFullYear() + 1);
        }
        break;
      }
    }

    return nextRun;
  }

  async pauseSchedule(scheduleId: string, pausedBy: string): Promise<ReportSchedule> {
    return this.updateSchedule(scheduleId, { isActive: false }, pausedBy);
  }

  async resumeSchedule(scheduleId: string, resumedBy: string): Promise<ReportSchedule> {
    return this.updateSchedule(scheduleId, { isActive: true }, resumedBy);
  }

  async testSchedule(scheduleId: string, testedBy: string): Promise<void> {
    try {
      const schedule = await this.getScheduleById(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      await this.executeScheduledReport(schedule);

      // Track test execution in audit log
      await adminAuditService.trackAction(
        { adminUserId: testedBy },
        {
          action: 'BULK_PAYMENT_UPDATE',

          metadata: {
            action: 'SCHEDULE_TEST',
            reportType: schedule.reportType,
            scheduleName: schedule.name,
          },

          // Using existing type, ideally REPORT_SCHEDULE
          resourceId: scheduleId,
          // Using existing action, ideally SCHEDULE_TEST
          resourceType: 'SYSTEM' as any,
        }
      );
    } catch (error) {
      throw new Error(
        `Error testing schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Cron job simulation - would be replaced with actual cron job or task scheduler
  startScheduler(): void {
    console.log('Report scheduler started');

    // Check for due reports every hour
    setInterval(
      async () => {
        try {
          const results = await this.processScheduledReports();
          console.log('Scheduled reports processed:', results);
        } catch (error) {
          console.error('Error in scheduled report processing:', error);
        }
      },
      60 * 60 * 1000
    ); // 1 hour
  }
}

export const reportSchedulerService = new ReportSchedulerService();
