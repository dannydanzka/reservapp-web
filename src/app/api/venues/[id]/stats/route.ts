import { NextRequest, NextResponse } from 'next/server';

import { VenueRepository } from '@libs/data/repositories/VenueRepository';

const venueRepository = new VenueRepository();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stats = await venueRepository.getVenueStats(id);

    if (!stats) {
      return NextResponse.json(
        {
          error: 'The requested venue does not exist',
          message: 'Venue not found',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: stats,
      message: 'Venue stats retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching venue stats:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching venue stats',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
