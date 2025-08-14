import { NextRequest, NextResponse } from 'next/server';

import { authenticateAdmin } from '@libs/services/auth/AuthorizationService';
import { getClientInfo } from '@libs/core/utils/requestUtils';
import { SystemLoggingService } from '@libs/services/systemLogging/systemLoggingService';

/**
 * GET /api/admin/system-logs/stats - Get system log statistics
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const clientInfo = getClientInfo(request);

  try {
    // Authenticate user and ensure SUPER_ADMIN role
    const { user } = await authenticateAdmin(request, ['SUPER_ADMIN']);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') as 'hour' | 'day' | 'week' | 'month') || 'day';

    // Get log statistics
    const stats = await SystemLoggingService.getLogStats(timeframe);

    const duration = Date.now() - startTime;

    // Log this API request
    SystemLoggingService.logApiRequest({
      duration,
      ipAddress: clientInfo.ipAddress,
      method: 'GET',
      statusCode: 200,
      url: '/api/admin/system-logs/stats',
      userAgent: clientInfo.userAgent,
      userId: user.id,
    });

    return NextResponse.json({
      data: stats,
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
      url: '/api/admin/system-logs/stats',
      userAgent: clientInfo.userAgent,
    });

    console.error('System logs stats API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve system log statistics',
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
