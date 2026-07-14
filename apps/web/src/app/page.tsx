import type { ReactNode } from 'react';
import Link from 'next/link';

/** Landing — mahsulotni tanishtirish va namuna taklifnoma. */
export default function LandingPage(): ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center font-serif text-ink">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">taklif.uz</p>
      <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
        Chiroyli to‘y taklifnomasi — <span className="text-gold">Telegramda 2 daqiqada</span>
      </h1>
      <p className="mt-6 max-w-md text-ink/70">
        Kuyov-kelin bot orqali ma’lumot kiritadi, mehmonlar chiroyli sahifada javob beradi.
      </p>
      <Link
        href="/aziz-va-malika"
        className="mt-10 rounded-full bg-gold px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
      >
        Namunani ko‘rish
      </Link>
    </main>
  );
}
