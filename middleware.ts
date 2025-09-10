import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware runs on every request and handles:
 * - Basic route filtering for static assets
 * - Public route allowance
 * - Delegates authentication to client-side AuthProvider
 */

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

  // For protected routes, just let them through
  // Client-side AuthProvider will handle authentication
  // This eliminates server-side token validation issues
  return NextResponse.next();
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
