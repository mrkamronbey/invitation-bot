import { type NextRequest, NextResponse } from 'next/server';
import { verifyTelegramLogin } from '@/shared/auth/telegram';
import { ensureWebUser } from '@/shared/auth/user';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from '@/shared/auth/session';

/**
 * Telegram Login Widget callback (data-auth-url).
 * Imzoni tekshiradi → foydalanuvchini yaratadi/topadi → sessiya cookie o'rnatadi
 * → dashboard'ga yo'naltiradi.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const params: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const tg = verifyTelegramLogin(params);
  if (!tg) {
    return NextResponse.redirect(new URL('/login?error=auth', req.url));
  }

  let userId: string;
  let firstName: string;
  try {
    const user = await ensureWebUser(tg);
    userId = user.id;
    firstName = user.firstName;
  } catch {
    return NextResponse.redirect(new URL('/login?error=server', req.url));
  }

  const token = await createSessionToken({ sub: userId, tid: tg.id, name: firstName });
  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
