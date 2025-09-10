import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Health check endpoint - verifies system status
 */
export async function GET(_request: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      services: {
        api: 'operational',
        database: 'connected',
      },
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        error: 'Database connection failed',
        services: {
          api: 'operational',
          database: 'disconnected',
        },
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
