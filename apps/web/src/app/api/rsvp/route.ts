import { NextResponse } from 'next/server';
import { rsvpInputSchema } from '@invitation/contracts';
import type { Notifier } from '@invitation/domain';
import { SubmitRsvpUseCase } from '@invitation/application';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  SupabaseUserRepository,
  SystemClock,
  createSupabaseClient,
} from '@invitation/infrastructure';

/** Bosqich 1: Telegram xabari Bosqich 2 da ulanadi — hozircha no-op. */
const noopNotifier: Notifier = {
  async notifyRsvp() {
    /* Bosqich 2: TelegramNotifier */
  },
};

function serviceEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function POST(request: Request): Promise<Response> {
  const json: unknown = await request.json().catch(() => null);
  const parsed = rsvpInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'INVALID_INPUT' }, { status: 400 });
  }

  const env = serviceEnv();
  if (!env) {
    // Env yo'q (demo/preview) — validatsiya o'tdi, saqlashsiz muvaffaqiyat qaytaramiz.
    return NextResponse.json({ ok: true, demo: true });
  }

  const db = createSupabaseClient(env);
  const useCase = new SubmitRsvpUseCase({
    invitations: new SupabaseInvitationRepository(db),
    rsvps: new SupabaseRsvpRepository(db),
    users: new SupabaseUserRepository(db),
    notifier: noopNotifier,
    ids: new CryptoIdGenerator(),
    clock: new SystemClock(),
  });

  const result = await useCase.execute(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error.code }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
