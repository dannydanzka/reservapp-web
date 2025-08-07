import { authService } from '@/libs/services/api/authService';

import {
  IAuthRepository,
  LoginAttempt,
  LoginCredentials,
  LoginSession,
  RegisterData,
  User,
} from '../../domain/interfaces/auth.interfaces';

/**
 * Authentication repository implementation for client-side HTTP API calls.
 * Uses authService to communicate with server-side authentication endpoints.
 */
export class AuthRepository implements IAuthRepository {
  private readonly loginAttempts: Map<string, LoginAttempt> = new Map();

  /**
   * Authenticates user with credentials via HTTP API.
   *
   * @param {LoginCredentials} credentials - User credentials
   * @returns {Promise<LoginSession>} Authentication session
   */
  async authenticate(credentials: LoginCredentials): Promise<LoginSession> {
    // Use authService to make HTTP call to API
    const response = await authService.login(credentials);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Credenciales inválidas');
    }

    return response.data;
  }

  /**
   * Registers a new user via HTTP API.
   *
   * @param {RegisterData} data - Registration data
   * @returns {Promise<LoginSession>} Authentication session
   */
  async register(data: RegisterData): Promise<LoginSession> {
    // Use authService to make HTTP call to API
    const response = await authService.register(data);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error en el registro');
    }

    return response.data;
  }

  /**
   * Logs out user via HTTP API.
   */
  async logout(): Promise<void> {
    const response = await authService.logout();

    if (!response.success) {
      throw new Error(response.message || 'Error cerrando sesión');
    }
  }

  /**
   * Validates a token and returns user data via HTTP API.
   *
   * @returns {Promise<User>} User data
   */
  async validateToken(): Promise<User> {
    const response = await authService.getProfile();

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Token inválido o expirado');
    }

    return response.data;
  }

  /**
   * Refreshes authentication token via HTTP API.
   *
   * @returns {Promise<LoginSession>} New session
   */
  async refreshToken(): Promise<LoginSession> {
    // For now, refresh token functionality would be implemented on the server side
    // This is a placeholder implementation
    throw new Error('Refresh token functionality not yet implemented');
  }

  /**
   * Gets login attempts for a user.
   *
   * @param {string} email - User email
   * @returns {Promise<LoginAttempt>} Login attempts data
   */
  async getLoginAttempts(email: string): Promise<LoginAttempt> {
    const existing = this.loginAttempts.get(email);
    if (existing) {
      return existing;
    }

    const newAttempt: LoginAttempt = {
      attempts: 0,
      email,
      isBlocked: false,
      maxAttempts: 5,
    };

    this.loginAttempts.set(email, newAttempt);
    return newAttempt;
  }

  /**
   * Increments login attempts for a user.
   *
   * @param {string} email - User email
   * @returns {Promise<LoginAttempt>} Updated login attempts data
   */
  async incrementLoginAttempts(email: string): Promise<LoginAttempt> {
    const attempt = await this.getLoginAttempts(email);
    attempt.attempts += 1;

    if (attempt.attempts >= attempt.maxAttempts) {
      attempt.isBlocked = true;
      attempt.blockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
    }

    this.loginAttempts.set(email, attempt);
    return attempt;
  }

  /**
   * Resets login attempts for a user.
   *
   * @param {string} email - User email
   */
  async resetLoginAttempts(email: string): Promise<void> {
    const attempt = await this.getLoginAttempts(email);
    attempt.attempts = 0;
    attempt.isBlocked = false;
    delete attempt.blockedUntil;

    this.loginAttempts.set(email, attempt);
  }
}
