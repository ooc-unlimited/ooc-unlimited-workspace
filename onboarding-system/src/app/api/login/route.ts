import { NextRequest, NextResponse } from 'next/server';

const AUTH_PASSWORD = process.env.DASHBOARD_PASSWORD || '';
const COOKIE_NAME = 'dashboard_auth';

// Must match middleware's simpleHash exactly
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

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === AUTH_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, AUTH_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
