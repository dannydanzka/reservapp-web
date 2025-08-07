import {
  IAuthRepository,
  ILoginUseCase,
  LoginCredentials,
  LoginSession,
} from '../interfaces/auth.interfaces';

/**
 * Login use case implementation.
 * Handles the business logic for user authentication.
 */
export class LoginUseCase implements ILoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Executes the login process.
   *
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<LoginSession>} Authentication session
   * @throws {Error} When authentication fails
   */
  async execute(credentials: LoginCredentials): Promise<LoginSession> {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Check login attempts (rate limiting)
    const attempts = await this.authRepository.getLoginAttempts(credentials.email);
    if (attempts.isBlocked) {
      throw new Error('Account temporarily blocked due to too many failed attempts');
    }

    try {
      // Attempt authentication
      const session = await this.authRepository.authenticate(credentials);

      // Reset login attempts on successful login
      await this.authRepository.resetLoginAttempts(credentials.email);

      return session;
    } catch (error) {
      // Increment failed attempts
      await this.authRepository.incrementLoginAttempts(credentials.email);
      throw error;
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
}
