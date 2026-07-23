import { SignJWT, jwtVerify } from 'jose';

/**
 * Sessiya (httpOnly JWT). jose Edge-runtime'da ham ishlaydi — shuning uchun
 * middleware ham shu yerdan tekshiradi. Node crypto import qilinmaydi.
 */
export const SESSION_COOKIE = 'taklif_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 kun

export interface SessionPayload {
  readonly sub: string; // user id (uuid)
  readonly tid: number; // telegram id
  readonly name: string; // first name
}

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('SESSION_SECRET sozlanmagan (kamida 16 belgi).');
  }
  return new TextEncoder().encode(s);
}

/** Sessiya tokenini imzolaydi (HS256, 30 kun). */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ tid: payload.tid, name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

/** Tokenni tekshiradi; noto'g'ri/eskirgan bo'lsa null. */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== 'string') return null;
    return {
      sub: payload.sub,
      tid: Number(payload.tid),
      name: String(payload.name ?? ''),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
};
