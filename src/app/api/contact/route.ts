import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { ResendService } from '@libs/infrastructure/services/core/email/resendService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message, name, phone, subject } = body;

    // Validaciones básicas
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido' },
        { status: 400 }
      );
    }

    // Guardar en base de datos
    const contactForm = await prisma.contactForm.create({
      data: {
        email: email.trim().toLowerCase(),
        message: message.trim(),
        name: name.trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
      },
    });

    // Enviar email al admin
    const emailHtml = `
      <h2>Nuevo formulario de contacto recibido</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Asunto:</strong> ${subject}</p>
      <hr />
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
      <hr />
      <p><small>ID del formulario: ${contactForm.id}</small></p>
      <p><small>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</small></p>
    `;

    // Enviar a tu email personal (configurado para MVP)
    const targetEmail = process.env.RESEND_TARGET_EMAIL || 'danny.danzka21@gmail.com';

    // Enviar a la dirección especificada
    await ResendService.sendEmail({
      html: emailHtml,
      replyTo: email,
      subject: `[ReservApp] Nuevo contacto: ${subject}`,
      to: targetEmail,
    });

    // También enviar confirmación al usuario
    const confirmationHtml = `
      <h2>Hemos recibido tu mensaje</h2>
      <p>Hola ${name},</p>
      <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
      <hr />
      <p><strong>Resumen de tu mensaje:</strong></p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
      <hr />
      <p>Saludos,<br />El equipo de ReservApp</p>
    `;

    await ResendService.sendEmail({
      html: confirmationHtml,
      subject: 'Confirmación de recepción - ReservApp',
      to: email,
    });

    return NextResponse.json(
      {
        data: { id: contactForm.id },
        message: 'Tu mensaje ha sido enviado exitosamente',
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario de contacto' },
      { status: 500 }
    );
  }
}

// GET endpoint para admin
export async function GET(request: NextRequest) {
  try {
    // TODO: Agregar autenticación y verificación de rol ADMIN
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [contactForms, total] = await Promise.all([
      prisma.contactForm.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        where,
      }),
      prisma.contactForm.count({ where }),
    ]);

    return NextResponse.json({
      data: contactForms,
      pagination: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return NextResponse.json(
      { error: 'Error al obtener los formularios de contacto' },
      { status: 500 }
    );
  }
}

// PATCH endpoint para actualizar estado
export async function PATCH(request: NextRequest) {
  try {
    // TODO: Agregar autenticación y verificación de rol ADMIN
    const body = await request.json();
    const { id, notes, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const updatedForm = await prisma.contactForm.update({
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
      where: { id },
    });

    return NextResponse.json({
      data: updatedForm,
      success: true,
    });
  } catch (error) {
    console.error('Error updating contact form:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el formulario de contacto' },
      { status: 500 }
    );
  }
}
