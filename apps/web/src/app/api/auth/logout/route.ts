import { type NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/shared/auth/session';

/** Sessiyani o'chiradi va bosh sahifaga qaytaradi. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
