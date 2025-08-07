import { NextRequest, NextResponse } from 'next/server';

import { StripeService } from '@/libs/services/stripe/stripeService';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    error,
    message,
    success,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: customerId } = await params;

    if (!customerId) {
      return createResponse(false, 'Missing customer ID', undefined, 'Customer ID is required');
    }

    const customer = await StripeService.retrieveCustomer(customerId);

    return createResponse(true, 'Customer retrieved successfully', {
      created: new Date(customer.created * 1000).toISOString(),
      customerId: customer.id,
      email: customer.email,
      metadata: customer.metadata,
      name: customer.name,
      phone: customer.phone,
    });
  } catch (error) {
    console.error(`GET /api/payments/customers/${params} error:`, error);
    return createResponse(
      false,
      'Failed to retrieve customer',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

interface UpdateCustomerRequest {
  email?: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: customerId } = await params;
    const body: UpdateCustomerRequest = await request.json();

    if (!customerId) {
      return createResponse(false, 'Missing customer ID', undefined, 'Customer ID is required');
    }

    const updatedCustomer = await StripeService.updateCustomer({
      customerId,
      ...body,
    });

    return createResponse(true, 'Customer updated successfully', {
      customerId: updatedCustomer.id,
      email: updatedCustomer.email,
      metadata: updatedCustomer.metadata,
      name: updatedCustomer.name,
      phone: updatedCustomer.phone,
    });
  } catch (error) {
    console.error(`PUT /api/payments/customers/${params} error:`, error);
    return createResponse(
      false,
      'Failed to update customer',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    if (!customerId) {
      return createResponse(false, 'Missing customer ID', undefined, 'Customer ID is required');
    }

    await StripeService.deleteCustomer(customerId);

    return createResponse(true, 'Customer deleted successfully');
  } catch (error) {
    console.error(`DELETE /api/payments/customers/${params} error:`, error);
    return createResponse(
      false,
      'Failed to delete customer',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
