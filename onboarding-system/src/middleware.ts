import { NextRequest, NextResponse } from 'next/server';

const AUTH_PASSWORD = process.env.DASHBOARD_PASSWORD || '';
const COOKIE_NAME = 'dashboard_auth';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const salted = `ooc-v2-${hash}-${str.length}-${str.charCodeAt(0) || 0}`;
  let hash2 = 0;
  for (let i = 0; i < salted.length; i++) {
    hash2 = ((hash2 << 5) - hash2 + salted.charCodeAt(i)) | 0;
  }
  return `ooc_${Math.abs(hash).toString(36)}_${Math.abs(hash2).toString(36)}`;
}

const AUTH_TOKEN = AUTH_PASSWORD
  ? simpleHash(`ooc-auth:${AUTH_PASSWORD}`)
  : '__no_password_set__';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes — everything else is public
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie) {
    const cookieValue = decodeURIComponent(authCookie.value);
    if (cookieValue === AUTH_TOKEN) {
      return NextResponse.next();
    }
  }

  // Redirect to login
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
