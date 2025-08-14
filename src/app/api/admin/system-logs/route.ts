import { NextRequest, NextResponse } from 'next/server';

import { authenticateAdmin } from '@libs/services/auth/AuthorizationService';
import { getClientInfo } from '@libs/core/utils/requestUtils';
import { SystemLogCategory, SystemLogLevel } from '@prisma/client';
import { SystemLoggingService } from '@libs/services/systemLogging/systemLoggingService';

/**
 * GET /api/admin/system-logs - Get system logs with filtering and pagination
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get logs with filters
    const result = await SystemLoggingService.getLogs({
      category: category.length > 0 ? category : undefined,
      dateFrom,
      dateTo,
      eventType,
      level: level.length > 0 ? level : undefined,
      limit,
      page,
      resourceId,
      resourceType,
      search,
      userId,
    });

    const duration = Date.now() - startTime;

    // Log this API request
    SystemLoggingService.logApiRequest({
      duration,
      ipAddress: clientInfo.ipAddress,
      method: 'GET',
      statusCode: 200,
      url: '/api/admin/system-logs',
      userAgent: clientInfo.userAgent,
      userId: user.id,
    });

    return NextResponse.json({
      data: result,
      success: true,
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
      url: '/api/admin/system-logs',
      userAgent: clientInfo.userAgent,
    });

    console.error('System logs API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve system logs',
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
