import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { VenueRepository } from '@libs/data/repositories/VenueRepository';

const venueRepository = new VenueRepository();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const venue = await venueRepository.findById(id);

    if (!venue) {
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
      data: venue,
      message: 'Venue retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching venue',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Prisma.VenueUpdateInput = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.latitude !== undefined) updateData.latitude = new Prisma.Decimal(body.latitude);
    if (body.longitude !== undefined) updateData.longitude = new Prisma.Decimal(body.longitude);
    if (body.rating !== undefined) updateData.rating = new Prisma.Decimal(body.rating);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const venue = await venueRepository.update(id, updateData);

    return NextResponse.json({
      data: venue,
      message: 'Venue updated successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error updating venue',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await venueRepository.delete(id);

    return NextResponse.json({
      message: 'Venue deleted successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error deleting venue',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
