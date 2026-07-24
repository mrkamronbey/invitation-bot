import { type NextRequest, NextResponse } from 'next/server';
import {
  SupabaseLoginCodeRepository,
  SupabaseUserRepository,
  createSupabaseClient,
} from '@invitation/infrastructure';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from '@/shared/auth/session';

/**
 * Bir martalik kod bilan kirish: bot bergan kodni tekshiradi → sessiya cookie.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  let code = '';
  try {
    const body = (await req.json()) as { code?: string };
    code = String(body.code ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'bad' }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const db = createSupabaseClient({ url, key });
  const codes = new SupabaseLoginCodeRepository(db);
  const users = new SupabaseUserRepository(db);

  const userId = await codes.consume(code);
  if (!userId) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  const user = await users.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    tid: user.telegramId,
    name: user.firstName,
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
