import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function extractAndVerifyJWT(request: NextRequest): JWTPayload {
  // Get auth token
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Token de autorización requerido');
  }

  const token = authHeader.substring(7);

  if (!token || token.trim() === '') {
    throw new Error('Token vacío');
  }

  try {
    // Use the exact same secret as login
    const JWT_SECRET =
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024-reservapp';
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (!decoded.userId || !decoded.email || !decoded.role) {
      throw new Error('Token payload inválido');
    }

    return decoded;
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    throw new Error(`Error verificando token: ${error.message}`);
  }
}
