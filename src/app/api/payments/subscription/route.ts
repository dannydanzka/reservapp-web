import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { amount, businessName, currency, email, planType } = body;

    // For now, return a mock payment intent
    // In production, this would integrate with Stripe
    const mockClientSecret = `pi_mock_${Date.now()}_secret_mock${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      data: {
        amount,
        businessName,
        clientSecret: mockClientSecret,
        currency: currency.toUpperCase(),
        email,
        paymentIntentId: `pi_mock_${Date.now()}`,
        planType,
      },
      message: 'Payment intent creado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Payment subscription error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { message: 'Payment intent ID requerido', success: false },
        { status: 400 }
      );
    }

    // Mock payment verification - in production this would check with Stripe
    return NextResponse.json({
      data: {
        paymentIntentId,
        status: 'succeeded',
      },
      success: true,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  }
}
