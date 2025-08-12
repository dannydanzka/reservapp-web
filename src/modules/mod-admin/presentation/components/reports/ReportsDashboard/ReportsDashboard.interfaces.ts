import React from 'react';

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'REVENUE_ANALYSIS' | 'RESERVATIONS_SUMMARY' | 'USER_ACTIVITY' | 'VENUE_PERFORMANCE';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultParams: any;
  estimatedTime: string;
}

export interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
  size?: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
}

export interface ReportStats {
  totalReports: number;
  reportsThisMonth: number;
  pendingReports: number;
  averageGenerationTime: number;
}

export interface GenerateParams {
  dateFrom: string;
  dateTo: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  includeDetails: boolean;
  venueIds: string[];
}

export interface ReportsDashboardProps {
  className?: string;
}

export interface ReportsDashboardState {
  reports: GeneratedReport[];
  stats: ReportStats;
  loading: boolean;
  selectedTemplate: ReportTemplate | null;
  showGenerateModal: boolean;
  generateParams: GenerateParams;
}

export interface ReportsDashboardHandlers {
  handleGenerateReport: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleDownloadReport: (fileUrl: string) => void;
  handleSendReport: (reportId: string) => void;
  handleSelectTemplate: (template: ReportTemplate) => void;
  handleCloseModal: () => void;
}

export type ReportStatus = 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV';
