// Reports Types - Basic type definitions for report functionality
export type ReportType =
  | 'revenue_analysis'
  | 'reservations_summary'
  | 'user_activity'
  | 'venue_performance';

export type ReportFormat = 'pdf' | 'csv' | 'json' | 'excel';

export interface ReportParameters {
  dateFrom?: string;
  dateTo?: string;
  venueId?: string;
  userId?: string;
  includeDetails?: boolean;
  groupBy?: string;
}

export interface ReportBase {
  id: string;
  type: ReportType;
  name: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  format: ReportFormat;
  parameters: ReportParameters;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  error?: string;
}

export interface ReportInsight {
  id: string;
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
  impact?: 'high' | 'medium' | 'low';
  metrics?: Array<{
    label: string;
    name: string;
    value: string | number;
    unit?: string;
  }>;
  actionItems?: string[];
}

export interface ReportWithInsights extends ReportBase {
  insights: ReportInsight[];
  data: any;
}

export interface GenerateReportRequest {
  type: ReportType;
  name: string;
  description?: string;
  format: ReportFormat;
  parameters: ReportParameters;
}

export interface ReportFilters {
  type?: ReportType;
  status?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginatedReports {
  data: ReportBase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ReportStats {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  pendingReports: number;
  averageGenerationTime: number;
  totalDownloads: number;
}

export interface ReportSchedule {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType;
  parameters: ReportParameters;
  format: ReportFormat;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  hour: number;
  recipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportConfig {
  includeCharts?: boolean;
  includeRawData?: boolean;
  templateId?: string;
  customHeaders?: Record<string, string>;
  watermark?: string;
  companyInfo?: {
    name: string;
    address: string;
    contact: string;
  };
  customStyling?: {
    fontFamily: string;
    primaryColor: string;
  };
}

// Report Data Types
export interface RevenueAnalysisData {
  totalRevenue: number;
  averageOrderValue: number;
  revenueByPeriod: Array<{ period: string; revenue: number }>;
  revenueByVenue: Array<{ venueId: string; venueName: string; revenue: number }>;
  topServices: Array<{ serviceId: string; serviceName: string; revenue: number }>;
}

export interface ReservationsSummaryData {
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  averagePartySize: number;
  reservationsByPeriod: Array<{ period: string; count: number }>;
  reservationsByVenue: Array<{ venueId: string; venueName: string; count: number }>;
  peakHours: Array<{ hour: number; count: number }>;
}

export interface UserActivityData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByPeriod: Array<{ period: string; newUsers: number; activeUsers: number }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    reservationCount: number;
    totalSpent: number;
  }>;
  userEngagement: {
    averageSessionDuration: number;
    bounceRate: number;
    returningUserRate: number;
  };
}

export interface VenuePerformanceData {
  totalVenues: number;
  activeVenues: number;
  averageRating: number;
  occupancyRate: number;
  venuesByPerformance: Array<{
    venueId: string;
    venueName: string;
    reservationCount: number;
    revenue: number;
    rating: number;
    occupancyRate: number;
  }>;
  topPerformingVenues: Array<{ venueId: string; venueName: string; score: number }>;
}
