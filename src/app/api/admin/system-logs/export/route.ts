import { NextRequest, NextResponse } from 'next/server';

import { authenticateAdmin } from '@libs/services/auth/AuthorizationService';
import { getClientInfo } from '@libs/core/utils/requestUtils';
import { SystemLogCategory, SystemLogLevel } from '@prisma/client';
import { SystemLoggingService } from '@libs/services/systemLogging/systemLoggingService';

/**
 * GET /api/admin/system-logs/export - Export system logs to CSV
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const clientInfo = getClientInfo(request);

  try {
    // Authenticate user and ensure SUPER_ADMIN role
    const { user } = await authenticateAdmin(request, ['SUPER_ADMIN']);

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    const level = searchParams.getAll('level') as SystemLogLevel[];
    const category = searchParams.getAll('category') as SystemLogCategory[];
    const eventType = searchParams.get('eventType') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const dateFrom = searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom'))
      : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')) : undefined;
    const resourceType = searchParams.get('resourceType') || undefined;
    const resourceId = searchParams.get('resourceId') || undefined;
    const search = searchParams.get('search') || undefined;

    // Export logs to CSV
    const csvContent = await SystemLoggingService.exportLogs({
      category: category.length > 0 ? category : undefined,
      dateFrom,
      dateTo,
      eventType,
      level: level.length > 0 ? level : undefined,
      resourceId,
      resourceType,
      search,
      userId,
    });

    const duration = Date.now() - startTime;

    // Log this admin action
    SystemLoggingService.logAdminAction('system_logs_export', {
      adminUserEmail: user.email,
      adminUserId: user.id,
      adminUserName: `${user.firstName} ${user.lastName}`,
      adminUserRole: user.role,
      ipAddress: clientInfo.ipAddress,
      metadata: {
        duration,
        filters: {
          category,
          dateFrom: dateFrom?.toISOString(),
          dateTo: dateTo?.toISOString(),
          eventType,
          level,
          resourceId,
          resourceType,
          search,
          userId,
        },
      },
      resourceId: 'export',
      resourceType: 'system_logs',
      userAgent: clientInfo.userAgent,
    });

    // Log this API request
    SystemLoggingService.logApiRequest({
      duration,
      ipAddress: clientInfo.ipAddress,
      method: 'GET',
      statusCode: 200,
      url: '/api/admin/system-logs/export',
      userAgent: clientInfo.userAgent,
      userId: user.id,
    });

    // Generate filename with current date
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `system-logs-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'text/csv',
      },
      status: 200,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Log the error
    SystemLoggingService.logApiRequest({
      duration,
      errorMessage,
      ipAddress: clientInfo.ipAddress,
      method: 'GET',
      statusCode: 500,
      url: '/api/admin/system-logs/export',
      userAgent: clientInfo.userAgent,
    });

    console.error('System logs export API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to export system logs',
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
