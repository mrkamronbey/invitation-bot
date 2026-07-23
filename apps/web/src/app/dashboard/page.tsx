import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';

/**
 * Dashboard (vaqtinchalik minimal) — sessiyani tekshiradi va foydalanuvchini
 * ko'rsatadi. To'liq boshqaruv (taklifnomalar ro'yxati, yaratish/tahrir)
 * 7–8-bosqichda quriladi.
 */
export default async function DashboardPage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-emerald-deep px-6 py-16 text-ivory">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light/80">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-ivory">Salom, {session.name}! 👋</h1>
        <p className="mt-3 text-ivory/70">
          Bu yer — sizning shaxsiy kabinetingiz. Tez orada shu yerda barcha
          taklifnomalaringiz ro‘yxati, yaratish va tahrirlash bo‘ladi.
        </p>

        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded-full border border-gold-light/40 px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold-light transition hover:bg-gold-light/10"
          >
            Chiqish
          </button>
        </form>
      </div>
    </main>
  );
}
