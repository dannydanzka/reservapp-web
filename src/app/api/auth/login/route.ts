import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos', success: false },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas', success: false },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas', success: false },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Cuenta desactivada. Contacta al soporte.', success: false },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        userId: user.id,
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return success with user data and token
    return NextResponse.json({
      data: {
        token,
        user: {
          email: user.email,
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          role: user.role,
        },
      },
      message: 'Inicio de sesión exitoso',
      success: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
