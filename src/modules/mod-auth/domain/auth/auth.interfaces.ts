/**
 * Authentication domain interfaces following Clean Architecture principles.
 * These interfaces define the contracts for authentication-related operations.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  subscriptionStatus?: SubscriptionStatus;
  permissions?: string[];
  avatar?: string;
  isActive: boolean;
  businessName?: string;
  phone?: string;
  address?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

export interface LoginSession {
  token: string;
  user: User;
  expiresAt: string;
  refreshToken?: string;
}

export interface LoginAttempt {
  email: string;
  attempts: number;
  maxAttempts: number;
  isBlocked: boolean;
  blockedUntil?: string;
}

// Use Cases Interfaces
export interface ILoginUseCase {
  execute(credentials: LoginCredentials): Promise<LoginSession>;
}

export interface IRegisterUseCase {
  execute(data: RegisterData): Promise<LoginSession>;
}

export interface ILogoutUseCase {
  execute(token: string): Promise<void>;
}

export interface ILoginAttemptsUseCase {
  check(email: string): Promise<LoginAttempt>;
  increment(email: string): Promise<LoginAttempt>;
  reset(email: string): Promise<void>;
}

// Repository Interfaces
export interface IAuthRepository {
  authenticate(credentials: LoginCredentials): Promise<LoginSession>;
  register(data: RegisterData): Promise<LoginSession>;
  logout(token: string): Promise<void>;
  validateToken(token: string): Promise<User>;
  refreshToken(refreshToken: string): Promise<LoginSession>;
  getLoginAttempts(email: string): Promise<LoginAttempt>;
  incrementLoginAttempts(email: string): Promise<LoginAttempt>;
  resetLoginAttempts(email: string): Promise<void>;
}

// State Management
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;
  isLoading: boolean;
}

// Business Registration Interfaces
export enum SubscriptionStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export interface BusinessRegistrationData extends RegisterData {
  businessName: string;
  phone: string;
  address: string;
  subscriptionPlan: string;
  paymentIntentId?: string;
}

export interface SubscriptionData {
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  paymentIntentId?: string;
  nextBillingDate?: string;
}

export interface PaymentIntegrationData {
  paymentIntentId: string;
  clientSecret: string;
  customerId?: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  metadata?: Record<string, string>;
}

export interface BusinessRegistrationWithPayment {
  registrationData: BusinessRegistrationData;
  paymentData: PaymentIntegrationData;
  subscriptionData: SubscriptionData;
}
