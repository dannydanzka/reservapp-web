/**
 * Stripe Service
 * Handles payment processing with Stripe API
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

interface CreatePaymentIntentOptions {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface CreateCustomerOptions {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export class StripeService {
  static async createPaymentIntent(
    options: CreatePaymentIntentOptions
  ): Promise<Stripe.PaymentIntent> {
    const { amount, currency = 'mxn', customerId, metadata } = options;

    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to centavos
      currency,
      ...(customerId && { customer: customerId }),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'reservapp-web',
        ...metadata,
      },
    });
  }

  static async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.confirm(paymentIntentId);
  }

  static async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }

  static async createCustomer(options: CreateCustomerOptions): Promise<Stripe.Customer> {
    const { email, metadata, name } = options;

    return await stripe.customers.create({
      email,
      ...(name && { name }),
      metadata: {
        source: 'reservapp-web',
        ...metadata,
      },
    });
  }

  static async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    return (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
  }

  static async createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
    });
  }

  static async constructWebhookEvent(body: string, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  }
}

export const stripeService = StripeService;
