import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require auth
  const publicPaths = ['/', '/auth/signin', '/auth/signup', '/api/auth/login', '/api/auth/register', '/api/auth/google', '/api/properties', '/api/locations'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/_next');

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check auth for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Admin-only routes
  if (pathname.startsWith('/dashboard') && decoded.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
