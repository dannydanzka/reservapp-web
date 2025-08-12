import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout endpoint - invalidates user session
 */
export async function POST(request: NextRequest) {
  try {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token. Server-side logout could involve:
    // - Token blacklisting (if implemented)
    // - Session cleanup (if using sessions)

    return NextResponse.json({
      message: 'Sesión cerrada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  }
}
