import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
  reservationId: string;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface UpdateCustomerParams {
  customerId: string;
  email?: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface CreateSetupIntentParams {
  customerId: string;
  usage?: 'on_session' | 'off_session';
  paymentMethodTypes?: string[];
}

export interface ConfirmPaymentParams {
  paymentIntentId: string;
  paymentMethodId: string;
}

export class StripeService {
  static async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100),
        automatic_payment_methods: {
          enabled: true,
        },
        // Convert to cents
        currency: params.currency || 'usd',
        customer: params.customerId,
        description: params.description || 'Service reservation payment',
        metadata: {
          reservationId: params.reservationId,
          ...params.metadata,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(
        `Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new Error(
        `Failed to retrieve payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async confirmPaymentIntent(params: ConfirmPaymentParams): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(params.paymentIntentId, {
        payment_method: params.paymentMethodId,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error(
        `Failed to confirm payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error canceling payment intent:', error);
      throw new Error(
        `Failed to cancel payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: params.email,
        metadata: params.metadata || {},
        name: params.name,
        phone: params.phone,
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(
        `Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        throw new Error('Customer has been deleted');
      }

      return customer as Stripe.Customer;
    } catch (error) {
      console.error('Error retrieving customer:', error);
      throw new Error(
        `Failed to retrieve customer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async updateCustomer(params: UpdateCustomerParams): Promise<Stripe.Customer> {
    try {
      const updateData: Stripe.CustomerUpdateParams = {};

      if (params.email) updateData.email = params.email;
      if (params.name) updateData.name = params.name;
      if (params.phone) updateData.phone = params.phone;
      if (params.metadata) updateData.metadata = params.metadata;

      const customer = await stripe.customers.update(params.customerId, updateData);
      return customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error(
        `Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
    try {
      const deletedCustomer = await stripe.customers.del(customerId);
      return deletedCustomer;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw new Error(
        `Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async createSetupIntent(params: CreateSetupIntentParams): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: params.customerId,
        payment_method_types: params.paymentMethodTypes || ['card'],
        usage: params.usage || 'off_session',
      });

      return setupIntent;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw new Error(
        `Failed to create setup intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async listPaymentMethods(
    customerId: string,
    type: string = 'card'
  ): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: type as Stripe.PaymentMethodListParams.Type,
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing payment methods:', error);
      throw new Error(
        `Failed to list payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
      return paymentMethod;
    } catch (error) {
      console.error('Error detaching payment method:', error);
      throw new Error(
        `Failed to detach payment method: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
      }

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return event;
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      throw new Error(
        `Failed to construct webhook event: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundParams.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      const refund = await stripe.refunds.create(refundParams);
      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error(
        `Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async retrieveRefund(refundId: string): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.retrieve(refundId);
      return refund;
    } catch (error) {
      console.error('Error retrieving refund:', error);
      throw new Error(
        `Failed to retrieve refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async listCharges(customerId?: string, limit: number = 10): Promise<Stripe.Charge[]> {
    try {
      const charges = await stripe.charges.list({
        customer: customerId,
        limit,
      });

      return charges.data;
    } catch (error) {
      console.error('Error listing charges:', error);
      throw new Error(
        `Failed to list charges: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static getStripeInstance(): Stripe {
    return stripe;
  }
}
