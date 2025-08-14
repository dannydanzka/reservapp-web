import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware runs on every request and handles:
 * - Token validation for protected routes
 * - Automatic redirects for expired tokens
 * - Role-based access control
 * - Admin route protection
 */

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin'];

// Routes that require specific roles
const ADMIN_ROUTES = ['/admin'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/user-register',
  '/business',
  '/contact',
  '/about',
  '/help',
  '/privacy',
  '/terms',
  '/api/auth/login',
  '/api/auth/register',
  '/api/contact',
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.includes('._next') ||
    pathname.includes('/favicon') ||
    pathname.includes('/images/') ||
    pathname.includes('/icons/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Get auth token from cookie or localStorage (we'll check cookie first)
  const authToken =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!authToken) {
    // No token found, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(authToken, JWT_SECRET) as any;

    // Check if token has required fields
    if (!decoded?.userId || !decoded?.role) {
      throw new Error('Invalid token structure');
    }

    // Check role-based access for admin routes
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

    if (isAdminRoute) {
      const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
      if (!allowedRoles.includes(decoded.role)) {
        // User doesn't have admin access, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Token is valid, continue with request
    const response = NextResponse.next();

    // Add user info to request headers for API routes
    response.headers.set('X-User-Id', decoded.userId);
    response.headers.set('X-User-Role', decoded.role);
    response.headers.set('X-User-Email', decoded.email || '');

    return response;
  } catch (jwtError: any) {
    console.error('JWT verification failed in middleware:', jwtError.message);

    // Token is invalid or expired, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'session_expired');

    // Clear the invalid token cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - api/health (health check)
     * - api/contact (public contact form)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/health|api/contact|_next/static|_next/image|favicon.ico).*)',
  ],
};
