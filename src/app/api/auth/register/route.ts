import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, firstName, lastName, password, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos', success: false },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado', success: false },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        isActive: true,
        lastName,
        password: hashedPassword,
        phone,
        role: 'USER',
      },
    });

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
      message: 'Usuario registrado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
