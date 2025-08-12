/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import bcrypt from 'bcryptjs';

import { PrismaClient, type User } from '@prisma/client';

import { jwtService } from './jwtService';

const prisma = new PrismaClient();

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user?.isActive) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = jwtService.generateToken({
      email: user.email,
      role: user.role,
      userId: user.id,
    });

    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      refreshToken,
      token,
      user: userWithoutPassword,
    };
  }

  static async register(data: RegisterData): Promise<AuthResult> {
    const { email, firstName, lastName, password, phone } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        password: hashedPassword,
        phone,
      },
    });

    // Generate tokens
    const token = jwtService.generateToken({
      email: user.email,
      role: user.role,
      userId: user.id,
    });

    const refreshToken = jwtService.generateRefreshToken({ userId: user.id });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      refreshToken,
      token,
      user: userWithoutPassword,
    };
  }

  static async refreshToken(refreshToken: string): Promise<string> {
    const payload = jwtService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user?.isActive) {
      throw new Error('Invalid refresh token');
    }

    return jwtService.generateToken({
      email: user.email,
      role: user.role,
      userId: user.id,
    });
  }

  static async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = AuthService;
