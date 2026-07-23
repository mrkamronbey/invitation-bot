import { type NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/shared/auth/session';

/**
 * /dashboard/* — faqat kirgan foydalanuvchi uchun. Sessiya cookie tekshiriladi
 * (jose Edge-runtime'da ishlaydi); noto'g'ri bo'lsa /login'ga yo'naltiriladi.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
