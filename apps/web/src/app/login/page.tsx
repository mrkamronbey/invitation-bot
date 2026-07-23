import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { TelegramLoginButton } from '@/features/auth/TelegramLoginButton';

interface PageProps {
  readonly searchParams: Promise<{ readonly error?: string }>;
}

/** Kirish sahifasi — Telegram Login Widget orqali. */
export default async function LoginPage({ searchParams }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (session) redirect('/dashboard');

  const { error } = await searchParams;
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const authUrl = `${siteUrl}/api/auth/telegram`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-deep px-6 text-ivory">
      <div className="w-full max-w-sm rounded-2xl border border-gold-light/25 bg-emerald/40 p-8 text-center backdrop-blur-md">
        <h1 className="font-display text-3xl text-gold-light">Xush kelibsiz</h1>
        <p className="mt-3 text-sm text-ivory/75">
          Taklifnomalaringizni boshqarish uchun Telegram orqali kiring.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {error === 'server'
              ? 'Serverda xatolik. Birozdan so‘ng qayta urinib ko‘ring.'
              : 'Kirish tasdiqlanmadi. Qayta urinib ko‘ring.'}
          </p>
        ) : null}

        <div className="mt-7 flex justify-center">
          {botUsername ? (
            <TelegramLoginButton botUsername={botUsername} authUrl={authUrl} />
          ) : (
            <p className="text-xs text-ivory/50">
              Login sozlanmagan (NEXT_PUBLIC_TELEGRAM_BOT_USERNAME kerak).
            </p>
          )}
        </div>

        <p className="mt-6 text-xs text-ivory/45">
          Botda ro‘yxatdan o‘tgan bo‘lsangiz — o‘sha akkaunt bilan kiraverasiz.
        </p>
      </div>
    </main>
  );
}
