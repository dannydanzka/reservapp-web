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

  // Invoice Management Functions
  static async createInvoice(
    customerId: string,
    params: {
      description?: string;
      dueDate?: Date;
      metadata?: Record<string, string>;
      autoFinalize?: boolean;
      collectionMethod?: 'charge_automatically' | 'send_invoice';
    }
  ): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.create({
        auto_advance: params.autoFinalize || true,
        collection_method: params.collectionMethod || 'send_invoice',
        customer: customerId,
        description: params.description,
        due_date: params.dueDate ? Math.floor(params.dueDate.getTime() / 1000) : undefined,
        metadata: params.metadata || {},
        pending_invoice_items_behavior: 'exclude',
      });

      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error(
        `Failed to create invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async addInvoiceItem(
    customerId: string,
    invoiceId: string,
    params: {
      amount: number;
      currency?: string;
      description?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<Stripe.InvoiceItem> {
    try {
      const invoiceItem = await stripe.invoiceItems.create({
        amount: Math.round(params.amount * 100),
        // Convert to cents
        currency: params.currency || 'usd',

        customer: customerId,
        description: params.description,
        invoice: invoiceId,
        metadata: params.metadata || {},
      });

      return invoiceItem;
    } catch (error) {
      console.error('Error adding invoice item:', error);
      throw new Error(
        `Failed to add invoice item: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.finalizeInvoice(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error finalizing invoice:', error);
      throw new Error(
        `Failed to finalize invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async sendInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.sendInvoice(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw new Error(
        `Failed to send invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async retrieveInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      throw new Error(
        `Failed to retrieve invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async listInvoices(
    customerId?: string,
    params?: {
      status?: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
      limit?: number;
      startingAfter?: string;
      endingBefore?: string;
    }
  ): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        ending_before: params?.endingBefore,
        limit: params?.limit || 10,
        starting_after: params?.startingAfter,
        status: params?.status,
      });

      return invoices.data;
    } catch (error) {
      console.error('Error listing invoices:', error);
      throw new Error(
        `Failed to list invoices: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async voidInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.voidInvoice(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error voiding invoice:', error);
      throw new Error(
        `Failed to void invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async markInvoiceUncollectible(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.markUncollectible(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error marking invoice as uncollectible:', error);
      throw new Error(
        `Failed to mark invoice as uncollectible: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async payInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.pay(invoiceId);
      return invoice;
    } catch (error) {
      console.error('Error paying invoice:', error);
      throw new Error(
        `Failed to pay invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Billing and Subscription Invoice Methods
  static async createSubscriptionInvoice(
    subscriptionId: string,
    params?: {
      description?: string;
      metadata?: Record<string, string>;
      daysUntilDue?: number;
    }
  ): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.create({
        days_until_due: params?.daysUntilDue,
        description: params?.description,
        metadata: params?.metadata || {},
        subscription: subscriptionId,
      });

      return invoice;
    } catch (error) {
      console.error('Error creating subscription invoice:', error);
      throw new Error(
        `Failed to create subscription invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async retrieveUpcomingInvoice(
    customerId: string,
    subscriptionId?: string
  ): Promise<Stripe.Invoice> {
    try {
      // Note: Upcoming invoices require different API call
      const upcomingParams: any = { customer: customerId };
      if (subscriptionId) {
        upcomingParams.subscription = subscriptionId;
      }
      const invoice = await (stripe.invoices as any).retrieveUpcoming(upcomingParams);

      return invoice;
    } catch (error) {
      console.error('Error retrieving upcoming invoice:', error);
      throw new Error(
        `Failed to retrieve upcoming invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
