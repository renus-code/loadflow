import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/api/loads', '/api/pods', '/api/users'];
// Paths that should not be accessible if already authenticated
const authPaths = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  const token = request.cookies.get('token')?.value;
  let isValidToken = false;
  let userPayload = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
      );
      const { payload } = await jwtVerify(token, secret);
      isValidToken = true;
      userPayload = payload;
    } catch (error) {
      isValidToken = false;
    }
  }

  // If the user is trying to access a protected route without a valid token
  if (isProtectedPath && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is trying to access login/register while already authenticated
  if (isAuthPath && isValidToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Config to specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder images (e.g., hero-bg.jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|hero-bg|truck).*)',
  ],
};
