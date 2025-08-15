import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { ResendService } from '@libs/infrastructure/services/core/email/resendService';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

// Initialize Stripe with sandbox/test environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

export const POST = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { billingDetails, planType = 'PREMIUM' } = body;
    let { paymentMethodId } = body;

    // Validate required fields
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Método de pago requerido', success: false },
        { status: 400 }
      );
    }

    // Check if user is already premium
    if (user.isPremium) {
      return NextResponse.json(
        { error: 'El usuario ya tiene una suscripción premium activa', success: false },
        { status: 400 }
      );
    }

    // Get user details from database
    const dbUser = await prisma.user.findUnique({
      include: {
        subscriptions: {
          where: {
            status: {
              in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
            },
          },
        },
      },
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado', success: false }, { status: 404 });
    }

    // Check for existing active subscriptions
    if (dbUser.subscriptions.length > 0) {
      return NextResponse.json(
        { error: 'El usuario ya tiene una suscripción activa', success: false },
        { status: 400 }
      );
    }

    // Define plan pricing - Only PREMIUM exists (FREE is default)
    const planPricing = {
      PREMIUM: {
        amount: 180.0,
        // $10 USD (~$180 MXN per month at current exchange rate)
        currency: 'MXN',
        name: 'ReservApp Premium',
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly_mx',
      },
    };

    const selectedPlan = planPricing[planType as keyof typeof planPricing];
    if (!selectedPlan) {
      return NextResponse.json(
        {
          error: 'Plan de suscripción no válido. Solo está disponible el plan PREMIUM.',
          success: false,
        },
        { status: 400 }
      );
    }

    // Ensure the price exists in Stripe, create if it doesn't
    let { priceId } = selectedPlan;
    try {
      await stripe.prices.retrieve(priceId);
    } catch (priceError: any) {
      if (priceError.code === 'resource_missing') {
        console.log(`Creating price for ${selectedPlan.name}...`);

        // Create a product first
        const product = await stripe.products.create({
          description: `${selectedPlan.name} subscription plan`,
          metadata: {
            planType: planType,
          },
          name: selectedPlan.name,
        });

        // Create the price
        const price = await stripe.prices.create({
          // Convert to cents
          currency: selectedPlan.currency.toLowerCase(),

          metadata: {
            planType: planType,
          },
          product: product.id,
          recurring: {
            interval: 'month',
          },
          unit_amount: Math.round(selectedPlan.amount * 100),
        });

        priceId = price.id;
        console.log(`Created new price: ${priceId}`);
      } else {
        throw priceError;
      }
    }

    let { stripeCustomerId } = dbUser;

    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          userId: dbUser.id,
        },
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        phone: dbUser.phone || undefined,
      });

      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        data: { stripeCustomerId },
        where: { id: dbUser.id },
      });
    }

    // Attach payment method to customer
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });
    } catch (attachError: any) {
      // If the payment method doesn't exist or can't be attached, create a test payment method
      if (
        attachError.code === 'resource_missing' ||
        attachError.code === 'payment_method_not_available'
      ) {
        console.log('Creating test payment method for sandbox...');
        const testPaymentMethod = await stripe.paymentMethods.create({
          card: {
            cvc: '123',
            exp_month: 12,
            exp_year: 2034,
            number: '4242424242424242',
          },
          type: 'card',
        });

        await stripe.paymentMethods.attach(testPaymentMethod.id, {
          customer: stripeCustomerId,
        });

        // Update paymentMethodId to use the newly created test method
        paymentMethodId = testPaymentMethod.id;
      } else {
        throw attachError;
      }
    }

    // Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
      items: [
        {
          price: priceId,
        },
      ],
      metadata: {
        planType: planType,
        userId: dbUser.id,
      },
    });

    // Calculate billing period
    const currentPeriodStart = new Date((subscription as any).current_period_start * 1000);
    const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

    // Save subscription to database
    const dbSubscription = await prisma.subscription.create({
      data: {
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        currentPeriodEnd,
        currentPeriodStart,
        paymentMethodId,
        planType: planType as SubscriptionPlan,
        priceId: priceId,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        stripeSubscriptionId: subscription.id,
        userId: dbUser.id,
      },
    });

    // Update user to premium status
    const updatedUser = await prisma.user.update({
      data: { isPremium: true },
      select: {
        email: true,
        firstName: true,
        id: true,
        isPremium: true,
        lastName: true,
      },
      where: { id: dbUser.id },
    });

    // Send welcome email for premium subscription
    try {
      await ResendService.sendTemplateEmail({
        data: {
          amount: selectedPlan.amount.toLocaleString('es-MX', {
            currency: 'MXN',
            style: 'currency',
          }),
          billingPeriod: 'mensual',
          nextBillingDate: currentPeriodEnd.toLocaleDateString('es-MX'),
          planName: selectedPlan.name,
          premiumFeatures: [
            'Reservaciones ilimitadas',
            'Soporte prioritario 24/7',
            'Acceso a ofertas exclusivas',
            'Cancelaciones flexibles',
            'Dashboard avanzado',
            'Notificaciones personalizadas',
          ],
          userEmail: dbUser.email,
          userName: `${dbUser.firstName} ${dbUser.lastName}`,
        },
        subject: '🎉 ¡Bienvenido a ReservApp Premium!',
        template: 'premium-welcome',
        to: dbUser.email,
      });
    } catch (emailError) {
      console.error('Error sending premium welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      data: {
        stripeSubscription: {
          current_period_end: (subscription as any).current_period_end,
          current_period_start: (subscription as any).current_period_start,
          id: subscription.id,
          latest_invoice: subscription.latest_invoice,
          status: subscription.status,
        },
        subscription: {
          amount: dbSubscription.amount,
          currency: dbSubscription.currency,
          currentPeriodEnd: dbSubscription.currentPeriodEnd,
          currentPeriodStart: dbSubscription.currentPeriodStart,
          id: dbSubscription.id,
          planType: dbSubscription.planType,
          status: dbSubscription.status,
          stripeSubscriptionId: dbSubscription.stripeSubscriptionId,
        },
        user: updatedUser,
      },
      message: 'Suscripción premium activada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Error upgrading to premium:', error);

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      let errorMessage = 'Error procesando el pago';

      switch (error.code) {
        case 'card_declined':
          errorMessage = 'Tu tarjeta fue rechazada. Verifica los datos e intenta nuevamente.';
          break;
        case 'insufficient_funds':
          errorMessage = 'Fondos insuficientes en la tarjeta.';
          break;
        case 'invalid_cvc':
          errorMessage = 'Código de seguridad inválido.';
          break;
        case 'expired_card':
          errorMessage = 'La tarjeta ha expirado.';
          break;
        case 'incorrect_number':
          errorMessage = 'Número de tarjeta incorrecto.';
          break;
        default:
          errorMessage = `Error de pago: ${error.message}`;
      }

      return NextResponse.json(
        { code: error.code, error: errorMessage, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  }
});
