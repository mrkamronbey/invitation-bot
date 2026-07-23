import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, type SessionPayload, verifySessionToken } from './session';

/**
 * Joriy sessiyani cookie'dan o'qib tekshiradi (server component/action uchun).
 * Sessiya yo'q yoki noto'g'ri bo'lsa null.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
