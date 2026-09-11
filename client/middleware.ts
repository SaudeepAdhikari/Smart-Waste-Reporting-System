import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register'];
const protectedRoutes = ['/report', '/reports', '/map', '/profile', '/notifications'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check protected routes
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    // TODO: Check authentication token/cookie when backend is ready
    // For now, allow access but the UI will handle auth state
    // The real protection will be implemented when backend auth is available
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
