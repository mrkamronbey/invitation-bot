import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { TelegramLoginButton } from '@/features/auth/TelegramLoginButton';
import { Card, CardContent } from '@/shared/ui/card';

interface PageProps {
  readonly searchParams: Promise<{ readonly error?: string }>;
}

/** Kirish sahifasi — Telegram Login Widget orqali (och, minimal, premium). */
export default async function LoginPage({ searchParams }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (session) redirect('/dashboard');

  const { error } = await searchParams;
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const authUrl = `${siteUrl}/api/auth/telegram`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="mb-8 inline-block text-lg font-bold tracking-tight text-foreground"
        >
          taklif<span className="text-primary">.uz</span>
        </Link>

        <Card>
          <CardContent className="px-8 py-10">
            <h1 className="text-2xl font-bold tracking-tight">Xush kelibsiz</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Taklifnomalaringizni boshqarish uchun Telegram orqali kiring.
            </p>

            {error ? (
              <p className="mt-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error === 'server'
                  ? 'Serverda xatolik. Birozdan so‘ng qayta urinib ko‘ring.'
                  : 'Kirish tasdiqlanmadi. Qayta urinib ko‘ring.'}
              </p>
            ) : null}

            <div className="mt-7 flex justify-center">
              {botUsername ? (
                <TelegramLoginButton botUsername={botUsername} authUrl={authUrl} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Login sozlanmagan (NEXT_PUBLIC_TELEGRAM_BOT_USERNAME kerak).
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Botda ro‘yxatdan o‘tgan bo‘lsangiz — o‘sha akkaunt bilan kiraverasiz.
        </p>
      </div>
    </main>
  );
}
