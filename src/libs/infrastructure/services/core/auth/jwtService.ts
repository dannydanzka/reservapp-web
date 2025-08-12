import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface JWTTokens {
  accessToken: string;
  refreshToken?: string;
}

export class JWTService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    return (jwt.sign as any)(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): TokenPayload {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      return (jwt.verify as any)(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error) {
        if (error.name === 'JsonWebTokenError') {
          throw new Error('Token inválido');
        }
        if (error.name === 'TokenExpiredError') {
          throw new Error('Token expirado');
        }
      }
      throw new Error('Error verificando token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Generate tokens for user authentication
   */
  static generateAuthTokens(user: { id: string; email: string; role: string }): JWTTokens {
    const accessToken = this.generateToken({
      email: user.email,
      role: user.role,
      userId: user.id,
    });

    return {
      accessToken,
    };
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: { userId: string }): string {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    return (jwt.sign as any)(payload, this.JWT_SECRET, {
      expiresIn: '7d', // Refresh tokens last longer
    });
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): { userId: string } {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      return (jwt.verify as any)(token, this.JWT_SECRET) as { userId: string };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Validate user credentials format
   */
  static validateCredentials(credentials: UserCredentials): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.email?.trim()) {
      errors.push('Email es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.push('Email debe tener un formato válido');
    }

    if (!credentials.password?.trim()) {
      errors.push('Contraseña es requerida');
    } else if (credentials.password.length < 8) {
      errors.push('Contraseña debe tener al menos 8 caracteres');
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  }

  /**
   * Get token expiration date
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      if (decoded?.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;
    return expiration < new Date();
  }
}

// Export an instance for easier use
export const jwtService = JWTService;
