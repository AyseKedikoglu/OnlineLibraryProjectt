import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  // Auth rotalarına giriş yapmış kullanıcılar erişemez
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  // Public API rotaları
  const publicApiRoutes = [
    '/api/auth',
    '/api/register'
  ];
  const isPublicApiRoute = publicApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // API rotaları için token kontrolü (public API'ler hariç)
  if (isApiRoute && !isPublicApiRoute && !token) {
    return NextResponse.json(
      { message: 'Oturum açmanız gerekiyor!' },
      { status: 401 }
    );
  }

  // Korumalı rotalar için token kontrolü
  const protectedRoutes = ['/books', '/profile', '/messages', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin rotaları için rol kontrolü
  if (request.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/books/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/login',
    '/register'
  ],
};
