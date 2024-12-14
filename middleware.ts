import { NextResponse, type NextRequest } from 'next/server';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';

const protectedRoutes = ['/'];
const publicRoutes = ['/sign-in', '/sign-up'];

async function isAuth(request: NextRequest): Promise<boolean> {
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return false;
  try {
    const authenticationService = getInjection('IAuthenticationService');
    await authenticationService.validateSession(sessionToken);
    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isUserAuth = await isAuth(request);

  // Redirect to /sign-in if the user is not authenticated
  if (isProtectedRoute && !isUserAuth) {
    return Response.redirect(new URL('/sign-in', request.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    isUserAuth
    // !request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return Response.redirect(new URL('/', request.nextUrl));
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
