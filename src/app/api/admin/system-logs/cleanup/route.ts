import { NextRequest, NextResponse } from 'next/server';

import { authenticateAdmin } from '@libs/services/auth/AuthorizationService';
import { getClientInfo } from '@libs/core/utils/requestUtils';
import { SystemLoggingService } from '@libs/services/systemLogging/systemLoggingService';

/**
 * DELETE /api/admin/system-logs/cleanup - Clean up old system logs
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now();
  const clientInfo = getClientInfo(request);

  try {
    // Authenticate user and ensure SUPER_ADMIN role
    const { user } = await authenticateAdmin(request, ['SUPER_ADMIN']);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const retentionDays = parseInt(searchParams.get('retentionDays') || '90');

    // Validate retention days (minimum 7 days, maximum 365 days)
    if (retentionDays < 7 || retentionDays > 365) {
      return NextResponse.json(
        {
          error: 'Invalid retention period',
          message: 'Retention days must be between 7 and 365',
          success: false,
        },
        { status: 400 }
      );
    }

    // Clean up old logs
    const deletedCount = await SystemLoggingService.cleanupOldLogs(retentionDays);

    const duration = Date.now() - startTime;

    // Log this admin action
    SystemLoggingService.logAdminAction('system_logs_cleanup', {
      adminUserEmail: user.email,
      adminUserId: user.id,
      adminUserName: `${user.firstName} ${user.lastName}`,
      adminUserRole: user.role,
      ipAddress: clientInfo.ipAddress,
      metadata: {
        deletedCount,
        duration,
        retentionDays,
      },
      resourceId: 'cleanup',
      resourceType: 'system_logs',
      userAgent: clientInfo.userAgent,
    });

    // Log this API request
    SystemLoggingService.logApiRequest({
      duration,
      ipAddress: clientInfo.ipAddress,
      method: 'DELETE',
      statusCode: 200,
      url: '/api/admin/system-logs/cleanup',
      userAgent: clientInfo.userAgent,
      userId: user.id,
    });

    return NextResponse.json({
      data: {
        deletedCount,
        message: `Successfully deleted ${deletedCount} old log entries`,
        retentionDays,
      },
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
      method: 'DELETE',
      statusCode: 500,
      url: '/api/admin/system-logs/cleanup',
      userAgent: clientInfo.userAgent,
    });

    console.error('System logs cleanup API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to clean up system logs',
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
