import {
  BusinessRegistrationData,
  IAuthRepository,
  IRegisterUseCase,
  LoginSession,
  RegisterData,
} from '../interfaces/auth.interfaces';

/**
 * Registration use case implementation.
 * Handles the business logic for user registration.
 */
export class RegisterUseCase implements IRegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Executes the registration process.
   *
   * @param {RegisterData | BusinessRegistrationData} data - User registration data
   * @returns {Promise<LoginSession>} Authentication session
   * @throws {Error} When registration fails
   */
  async execute(data: RegisterData | BusinessRegistrationData): Promise<LoginSession> {
    // Validate input
    this.validateRegistrationData(data);

    // Additional validation for business registration
    if (this.isBusinessRegistration(data)) {
      this.validateBusinessData(data);
      await this.validatePayment(data);
    }

    try {
      // Register user
      const session = await this.authRepository.register(data);
      return session;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  /**
   * Validates registration data.
   *
   * @param {RegisterData} data - Registration data to validate
   * @throws {Error} When validation fails
   */
  private validateRegistrationData(data: RegisterData): void {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Email, password, and name are required');
    }

    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!this.isValidPassword(data.password)) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }

    if (data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  }

  /**
   * Validates email format.
   *
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength.
   *
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets requirements
   */
  private isValidPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers;
  }

  /**
   * Checks if the registration data is for a business.
   *
   * @param {RegisterData | BusinessRegistrationData} data - Registration data
   * @returns {boolean} True if business registration
   */
  private isBusinessRegistration(
    data: RegisterData | BusinessRegistrationData
  ): data is BusinessRegistrationData {
    return 'businessName' in data && 'subscriptionPlan' in data;
  }

  /**
   * Validates business-specific registration data.
   *
   * @param {BusinessRegistrationData} data - Business registration data
   * @throws {Error} When validation fails
   */
  private validateBusinessData(data: BusinessRegistrationData): void {
    if (!data.businessName || data.businessName.trim().length < 2) {
      throw new Error('Business name is required and must be at least 2 characters long');
    }

    if (!data.phone || data.phone.trim().length < 10) {
      throw new Error('Valid phone number is required');
    }

    if (!data.address || data.address.trim().length < 10) {
      throw new Error('Complete business address is required');
    }

    if (!data.subscriptionPlan) {
      throw new Error('Subscription plan is required');
    }
  }

  /**
   * Validates payment for business registration.
   *
   * @param {BusinessRegistrationData} data - Business registration data
   * @throws {Error} When payment validation fails
   */
  private async validatePayment(data: BusinessRegistrationData): Promise<void> {
    if (!data.paymentIntentId) {
      throw new Error('Payment validation is required for business registration');
    }

    try {
      // Verify payment intent status with Stripe
      const response = await fetch(
        `/api/payments/subscription?payment_intent_id=${data.paymentIntentId}`
      );

      if (!response.ok) {
        throw new Error('Failed to validate payment');
      }

      const paymentData = await response.json();

      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Payment validation failed');
      }

      if (paymentData.data.status !== 'succeeded') {
        throw new Error('Payment has not been completed. Please complete the payment process.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Payment validation failed: ${error.message}`);
      }
      throw new Error('Payment validation failed');
    }
  }
}
