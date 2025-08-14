import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient, UserRoleEnum } from '@prisma/client';
import { ResendService } from '@libs/infrastructure/services/core/email/resendService';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { businessData, email, firstName, lastName, password, phone } = body;

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

    // Determine role based on business data
    const userRole = businessData ? UserRoleEnum.ADMIN : UserRoleEnum.USER;

    // Create user (and business account if business data provided)
    const userData = {
      email,
      firstName,
      isActive: true,
      lastName,
      password: hashedPassword,
      phone,
      role: userRole,
    };

    let user;
    if (businessData && userRole === UserRoleEnum.ADMIN) {
      // Create user with business account in a transaction
      user = await prisma.user.create({
        data: {
          ...userData,
          businessAccount: {
            create: {
              businessName: businessData.businessName,
              businessType: businessData.businessType,
              contactEmail: email,
              contactPhone: phone,
            },
          },
        },
        include: {
          businessAccount: true,
        },
      });
    } else {
      // Create regular user
      user = await prisma.user.create({
        data: userData,
      });
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

    // Enviar email de bienvenida
    try {
      // Determinar si es registro de negocio o usuario
      const isBusinessRegistration = body.businessName && body.businessName.trim() !== '';

      await ResendService.sendWelcomeEmail({
        businessName: isBusinessRegistration ? body.businessName : undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        userEmail: user.email,
        userName: isBusinessRegistration ? body.businessName : `${user.firstName} ${user.lastName}`,
        userType: isBusinessRegistration ? 'BUSINESS' : 'USER',
      });

      console.log(
        `Email de bienvenida ${isBusinessRegistration ? 'de negocio' : 'de usuario'} enviado a ${user.email}`
      );
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No fallar el registro si el email falla
    }

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
