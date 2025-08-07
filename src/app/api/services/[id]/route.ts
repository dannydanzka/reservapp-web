import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { ServiceRepository } from '@libs/data/repositories/ServiceRepository';

const serviceRepository = new ServiceRepository();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await serviceRepository.findById(id);

    if (!service) {
      return NextResponse.json(
        {
          error: 'The requested service does not exist',
          message: 'Service not found',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: service,
      message: 'Service retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching service',
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

    const updateData: Prisma.ServiceUpdateInput = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = new Prisma.Decimal(body.price);
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.capacity !== undefined) updateData.capacity = body.capacity;
    if (body.amenities !== undefined) updateData.amenities = body.amenities;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const service = await serviceRepository.update(id, updateData);

    return NextResponse.json({
      data: service,
      message: 'Service updated successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error updating service',
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
    await serviceRepository.delete(id);

    return NextResponse.json({
      message: 'Service deleted successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error deleting service',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
