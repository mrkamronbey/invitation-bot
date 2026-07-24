import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Bell,
  Bot,
  CalendarClock,
  Clock,
  Eye,
  Gift,
  Images,
  Link2,
  type LucideIcon,
  MapPin,
  MessageCircle,
  Music,
  PenLine,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/button';

const BOT_URL = 'https://t.me/weddingiinvitation_bot';
const DEMO_URL = '/i/aziz-va-malika';

const STEPS: ReadonlyArray<{ n: string; title: string; text: string; icon: LucideIcon }> = [
  {
    n: '01',
    icon: Bot,
    title: 'Boshlang',
    text: 'Telegram bot orqali yoki saytga kirib yangi taklifnoma yarating. Ro‘yxatdan o‘tish oson — parol kerak emas.',
  },
  {
    n: '02',
    icon: PenLine,
    title: "Ma'lumot kiriting",
    text: 'Kuyov-kelin ismi, sana, joy, ota-onalar, kun tartibi, rasm — bot savol beradi yoki saytda to‘ldirasiz.',
  },
  {
    n: '03',
    icon: Share2,
    title: 'Ulashing',
    text: 'Tayyor taklifnomaga noyob havola beriladi. Uni mehmonlarga yuborasiz — ular chiroyli sahifada ko‘radi.',
  },
];

const INVITE_FEATURES: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Clock, title: 'Teskari sanoq', text: 'To‘yga qolgan kun, soat, daqiqani jonli sanaydi.' },
  { icon: MapPin, title: 'Manzil va xarita', text: 'To‘yxona joyi — “Yo‘l ko‘rsatish” tugmasi bilan.' },
  { icon: Images, title: 'Galereya', text: 'Suratlaringiz nafis ko‘rinishda, bosilganda kattalashadi.' },
  { icon: CalendarClock, title: 'Kun tartibi', text: 'Marosim jadvali — mehmon nima qachon bo‘lishini biladi.' },
  { icon: Bell, title: 'RSVP javoblar', text: 'Mehmon “kelaman” bossa — sizga darrov xabar keladi.' },
  { icon: Gift, title: 'Sovg‘a va tilaklar', text: 'Karta ma’lumoti va mehmonlar tilaklari devori.' },
];

const WHY: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Clock, title: '2 daqiqada tayyor', text: 'Tez va oson — dizayn ustida bosh qotirmaysiz.' },
  { icon: Eye, title: 'Premium dizayn', text: 'Nafis animatsiyali, mobil uchun mukammal sahifa.' },
  { icon: Link2, title: 'Noyob havola', text: 'Har taklifnoma faqat o‘zining maxsus havolasida.' },
];

const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Qog‘oz taklifnoma kerakmi?',
    a: 'Yo‘q. Bu to‘liq elektron taklifnoma — havolani WhatsApp, Telegram yoki SMS orqali yuborasiz.',
  },
  {
    q: 'Botsiz, saytdan ham yarata olamanmi?',
    a: 'Ha. Ham botdan, ham saytdan yaratasiz. Ikkalasi bir tizim — taklifnomalaringiz bitta kabinetda saqlanadi.',
  },
  {
    q: 'Keyin o‘zgartira olamanmi?',
    a: 'Albatta. Kabinetda istalgan vaqtda tahrirlaysiz — havola o‘zgarmaydi, mehmonlar yangilangan sahifani ko‘radi.',
  },
  {
    q: 'Mehmon javobini qanday bilaman?',
    a: 'Mehmon “kelaman / kelmayman” va necha kishi ekanini belgilaydi — bularning barchasi kabinetda statistikada ko‘rinadi.',
  },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
}): ReactNode {
  return (
    <div className="text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

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
            Chiroyli to‘y taklifnomasi, <span className="text-primary">2 daqiqada</span>
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

      {/* Bu nima? */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal>
            <SectionHeading eyebrow="taklif.uz nima?" title="Zamonaviy elektron taklifnoma" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              <b className="text-foreground">taklif.uz</b> — to‘y uchun chiroyli web
              taklifnoma yaratish xizmati. Kuyov-kelin bot yoki sayt orqali ma’lumot
              kiritadi, tizim esa mobil, animatsiyali sahifa tayyorlaydi. Mehmonlar
              havolani ochib, to‘y haqidagi hamma narsani ko‘radi va kelishini bildiradi.
              Qog‘oz emas — tez, chiroyli va tejamli.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Qanday ishlaydi */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <SectionHeading title="Qanday ishlaydi?" subtitle="Uch oddiy qadam." />
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-primary">
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
      </section>

      {/* Taklifnomada nima bor? */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Mehmon nimani ko‘radi"
              title="Taklifnomada nima bor?"
              subtitle="Havola ochilganda mehmonni kutayotgan narsalar."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INVITE_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-background p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Music className="h-4 w-4 text-primary" strokeWidth={1.7} /> Fon musiqasi ·{' '}
              <MessageCircle className="h-4 w-4 text-primary" strokeWidth={1.7} /> Tilaklar devori ·{' '}
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.7} /> Yumshoq animatsiyalar
            </p>
          </Reveal>
        </div>
      </section>

      {/* Nega taklif.uz */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <SectionHeading title="Nega taklif.uz?" />
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {WHY.map((f, i) => (
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

      {/* Namuna */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal variant="scale">
            <SectionHeading
              eyebrow="Namuna"
              title="O‘z ko‘zingiz bilan ko‘ring"
              subtitle="Tayyor taklifnoma qanday ko‘rinishini oching — konvert ochilishi, gullar, sanoq va boshqalar."
            />
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={DEMO_URL}>
                  <Eye className="h-4 w-4" strokeWidth={2} />
                  Namunani ochish
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <SectionHeading title="Savol-javob" />
        </Reveal>
        <div className="mt-12 space-y-4">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
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
        <a
          href={BOT_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block hover:text-primary"
        >
          @weddingiinvitation_bot
        </a>
      </footer>
    </main>
  );
}
