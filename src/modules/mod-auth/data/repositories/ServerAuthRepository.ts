import { JWTService } from '@infrastructure/services/core/auth/jwtService';
import { PrismaService } from '@infrastructure/services/core/database/prismaService';

import {
  IAuthRepository,
  LoginAttempt,
  LoginCredentials,
  LoginSession,
  RegisterData,
  User,
  UserRole,
} from '../../domain/auth/auth.interfaces';

/**
 * Server-side authentication repository implementation with real JWT authentication.
 * Uses PrismaService for secure authentication and password hashing.
 * This should ONLY be used in API routes, never in client-side code.
 */
export class ServerAuthRepository implements IAuthRepository {
  private readonly prismaService: PrismaService;
  private readonly loginAttempts: Map<string, LoginAttempt> = new Map();

  constructor() {
    this.prismaService = PrismaService.getInstance();
  }

  private get prisma() {
    return this.prismaService.getClient();
  }

  /**
   * Authenticates user with credentials using real JWT.
   */
  async authenticate(credentials: LoginCredentials): Promise<LoginSession> {
    // Validate credentials format
    const validation = JWTService.validateCredentials(credentials);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Find user by email in database
    const dbUser = await this.prisma.user.findUnique({
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        password: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
      where: {
        email: credentials.email,
        isActive: true,
      },
    });

    if (!dbUser?.password) {
      throw new Error('Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await JWTService.comparePassword(credentials.password, dbUser.password);
    if (!isPasswordValid) {
      await this.incrementLoginAttempts(credentials.email);
      throw new Error('Credenciales inválidas');
    }

    // Reset login attempts on successful login
    await this.resetLoginAttempts(credentials.email);

    // Generate JWT token
    const tokens = JWTService.generateAuthTokens({
      email: dbUser.email,
      id: dbUser.id,
      role: dbUser.role,
    });

    // Map Prisma user to domain User interface
    const mappedUser: User = {
      createdAt: dbUser.createdAt.toISOString(),
      email: dbUser.email,
      firstName: dbUser.firstName,
      id: dbUser.id,
      isActive: dbUser.isActive,
      lastName: dbUser.lastName,
      name: `${dbUser.firstName} ${dbUser.lastName}`,
      role: dbUser.role.toLowerCase() as UserRole,
      updatedAt: dbUser.updatedAt.toISOString(),
    };

    const expiresAt =
      JWTService.getTokenExpiration(tokens.accessToken)?.toISOString() ??
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      expiresAt,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      user: mappedUser,
    };
  }

  /**
   * Registers a new user with real JWT authentication.
   */
  async register(data: RegisterData): Promise<LoginSession> {
    // Validate credentials format
    const validation = JWTService.validateCredentials({
      email: data.email,
      password: data.password,
    });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }

    // Hash password
    const passwordHash = await JWTService.hashPassword(data.password);

    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || 'Usuario';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create new user in database
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName,
        isActive: true,
        lastName,
        password: passwordHash,
        role: 'USER',
      },
    });

    // Generate JWT token
    const tokens = JWTService.generateAuthTokens({
      email: newUser.email,
      id: newUser.id,
      role: newUser.role,
    });

    // Map Prisma user to domain User interface
    const mappedUser: User = {
      createdAt: newUser.createdAt.toISOString(),
      email: newUser.email,
      firstName: newUser.firstName,
      id: newUser.id,
      isActive: newUser.isActive,
      lastName: newUser.lastName,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role.toLowerCase() as UserRole,
      updatedAt: newUser.updatedAt.toISOString(),
    };

    const expiresAt =
      JWTService.getTokenExpiration(tokens.accessToken)?.toISOString() ??
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      expiresAt,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      user: mappedUser,
    };
  }

  /**
   * Validates a token and returns user data using real JWT.
   */
  async validateToken(token: string): Promise<User> {
    try {
      // Verify JWT token
      const payload = JWTService.verifyToken(token);

      // Find user by ID in database
      const dbUser = await this.prisma.user.findUnique({
        select: {
          createdAt: true,
          email: true,
          firstName: true,
          id: true,
          isActive: true,
          lastName: true,
          phone: true,
          role: true,
          updatedAt: true,
        },
        where: {
          id: payload.userId,
          isActive: true,
        },
      });

      if (!dbUser) {
        throw new Error('Usuario no encontrado');
      }

      // Map Prisma user to domain User interface
      const mappedUser: User = {
        createdAt: dbUser.createdAt.toISOString(),
        email: dbUser.email,
        firstName: dbUser.firstName,
        id: dbUser.id,
        isActive: dbUser.isActive,
        lastName: dbUser.lastName,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        role: dbUser.role.toLowerCase() as UserRole,
        updatedAt: dbUser.updatedAt.toISOString(),
      };

      return mappedUser;
    } catch {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Logs out user by invalidating token.
   */
  async logout(): Promise<void> {
    // In a real implementation, this would invalidate the token in a blacklist
    // For now, this is a no-op as JWT tokens are stateless
  }

  /**
   * Refreshes authentication token.
   */
  async refreshToken(refreshToken: string): Promise<LoginSession> {
    try {
      // Verify refresh token
      const payload = JWTService.verifyToken(refreshToken);

      // Find user by ID
      const dbUser = await this.prisma.user.findUnique({
        select: {
          createdAt: true,
          email: true,
          firstName: true,
          id: true,
          isActive: true,
          lastName: true,
          phone: true,
          role: true,
          updatedAt: true,
        },
        where: {
          id: payload.userId,
          isActive: true,
        },
      });

      if (!dbUser) {
        throw new Error('Usuario no encontrado');
      }

      // Generate new tokens
      const tokens = JWTService.generateAuthTokens({
        email: dbUser.email,
        id: dbUser.id,
        role: dbUser.role,
      });

      // Map user
      const mappedUser: User = {
        createdAt: dbUser.createdAt.toISOString(),
        email: dbUser.email,
        firstName: dbUser.firstName,
        id: dbUser.id,
        isActive: dbUser.isActive,
        lastName: dbUser.lastName,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        role: dbUser.role.toLowerCase() as UserRole,
        updatedAt: dbUser.updatedAt.toISOString(),
      };

      const expiresAt =
        JWTService.getTokenExpiration(tokens.accessToken)?.toISOString() ??
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      return {
        expiresAt,
        refreshToken: tokens.refreshToken,
        token: tokens.accessToken,
        user: mappedUser,
      };
    } catch {
      throw new Error('Token de actualización inválido');
    }
  }

  /**
   * Gets login attempts for a user.
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
   */
  async resetLoginAttempts(email: string): Promise<void> {
    const attempt = await this.getLoginAttempts(email);
    attempt.attempts = 0;
    attempt.isBlocked = false;
    delete attempt.blockedUntil;

    this.loginAttempts.set(email, attempt);
  }
}
