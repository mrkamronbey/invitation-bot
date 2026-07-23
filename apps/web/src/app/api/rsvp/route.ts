import { NextResponse } from 'next/server';
import { rsvpInputSchema } from '@invitation/contracts';
import type { Notifier } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';
import { SubmitRsvpUseCase } from '@invitation/application';
import {
  CryptoIdGenerator,
  type RsvpMessageFormatter,
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  SupabaseUserRepository,
  SystemClock,
  TelegramNotifier,
  createSupabaseClient,
} from '@invitation/infrastructure';

/** RSVP xabari matni — tarjima (i18n) shu yerda, presentation qatlamida. */
const formatRsvp =
  (siteUrl: string): RsvpMessageFormatter =>
  (owner, rsvp, slug) => {
    const m = getMessages(owner.locale).bot;
    const notice = m.rsvpNotice(rsvp.guestName, rsvp.attending, rsvp.guestsCount);
    return `${notice}\n${siteUrl}/i/${slug}`;
  };

/** BOT_TOKEN bo'lsa egaga Telegram xabari yuboriladi, aks holda no-op. */
function buildNotifier(): Notifier {
  const botToken = process.env.BOT_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  if (botToken) return new TelegramNotifier(botToken, formatRsvp(siteUrl));
  return { async notifyRsvp() {} };
}

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
    notifier: buildNotifier(),
    ids: new CryptoIdGenerator(),
    clock: new SystemClock(),
  });

  const result = await useCase.execute(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error.code }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
