import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bot, Clock, Eye, Link2, type LucideIcon, PenLine, Send, Share2 } from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/button';

const BOT_URL = 'https://t.me/weddingiinvitation_bot';
const DEMO_URL = '/i/aziz-va-malika';

const STEPS: ReadonlyArray<{ n: string; title: string; text: string; icon: LucideIcon }> = [
  {
    n: '01',
    icon: Bot,
    title: 'Boshlang',
    text: 'Telegram bot orqali yoki saytga kirib yangi taklifnoma yarating.',
  },
  {
    n: '02',
    icon: PenLine,
    title: "Ma'lumot kiriting",
    text: 'Ism, sana, joy, ota-onalar, kun tartibi — bir necha daqiqada to‘ldiriladi.',
  },
  {
    n: '03',
    icon: Share2,
    title: 'Ulashing',
    text: 'Har bir taklifnomaga noyob havola — mehmonlarga yuborasiz, xolos.',
  },
];

const FEATURES: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Clock, title: '2 daqiqada', text: 'Tez va oson — ro‘yxatdan o‘tish, parol shart emas.' },
  { icon: Eye, title: 'Premium dizayn', text: 'Nafis animatsiyali, mobil uchun mukammal sahifa.' },
  { icon: Link2, title: 'Noyob havola', text: 'Har taklifnoma faqat o‘zining maxsus havolasida.' },
];

export function LandingPage(): ReactNode {
  return (
    <main className="bg-background text-foreground">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">
          taklif<span className="text-primary">.uz</span>
        </span>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Kirish</Link>
          </Button>
          <Button asChild size="sm">
            <a href={BOT_URL} target="_blank" rel="noreferrer">
              Boshlash
            </a>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <Reveal>
          <p className="mb-6 inline-block rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            To‘y taklifnomasi · O‘zbekiston
          </p>
          <h1 className="mx-auto max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Chiroyli to‘y taklifnomasi,{' '}
            <span className="text-primary">2 daqiqada</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Botdan yoki saytdan yarating — tizim nafis, animatsiyali web taklifnoma
            tayyorlaydi va har biriga noyob havola beradi.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={BOT_URL} target="_blank" rel="noreferrer">
                <Send className="h-4 w-4" strokeWidth={2} />
                Telegramda yaratish
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={DEMO_URL}>
                <Eye className="h-4 w-4" strokeWidth={2} />
                Namunani ko‘rish
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Qanday ishlaydi */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Qanday ishlaydi?
            </h2>
            <p className="mt-3 text-center text-muted-foreground">Uch oddiy qadam.</p>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-primary">
                    <s.icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <p className="mt-5 text-xs font-medium tracking-[0.2em] text-muted-foreground">
                    {s.n}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nega taklif.uz */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Reveal variant="scale">
          <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              To‘yingizni chiroyli boshlang
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Hoziroq yaratib, ulashishga tayyor taklifnomangizni oling.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={BOT_URL} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" strokeWidth={2} />
                  Telegramda boshlash
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Saytga kirish</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>
          taklif<span className="text-primary">.uz</span> — elektron to‘y taklifnomalari
        </p>
        <a href={BOT_URL} target="_blank" rel="noreferrer" className="mt-1 inline-block hover:text-primary">
          @weddingiinvitation_bot
        </a>
      </footer>
    </main>
  );
}
