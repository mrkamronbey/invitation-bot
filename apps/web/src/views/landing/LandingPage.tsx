import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Bell,
  Bot,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Link2,
  ListChecks,
  type LucideIcon,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Music,
  Palette,
  Send,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { Corners, Flourish, Monogram } from '@/shared/ui/ornaments';

const BOT_URL = 'https://t.me/weddingiinvitation_bot';
const DEMO_URL = '/aziz-va-malika';

const STEPS: ReadonlyArray<{ n: string; title: string; text: string; icon: LucideIcon }> = [
  {
    n: '01',
    icon: Bot,
    title: 'Botni oching',
    text: 'Telegramda botni oching va /start bosing. Ro‘yxatdan o‘tish, parol — hech narsa kerak emas.',
  },
  {
    n: '02',
    icon: Palette,
    title: 'Shablon tanlang',
    text: 'Klassik, Zamonaviy yoki Minimal — o‘zingizga yoqqan chiroyli dizaynni tanlaysiz.',
  },
  {
    n: '03',
    icon: MessageCircle,
    title: 'Ma’lumot kiriting',
    text: 'Bot savol beradi: ism, sana, joy, rasm, musiqa. Siz javob berasiz — 2 daqiqada tayyor.',
  },
  {
    n: '04',
    icon: Link2,
    title: 'Havolani ulashing',
    text: 'Bot noyob havola beradi. Uni mehmonlarga yuborasiz — ular chiroyli sahifada ko‘radi.',
  },
];

const BOT_FEATURES: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Palette,
    title: 'Shablon tanlash',
    text: '3 xil chiroyli dizayn — namuna bilan tanlaysiz.',
  },
  {
    icon: MapPin,
    title: 'Lokatsiya',
    text: 'To‘yxona joyini Telegramda “pin” qilib yuborasiz — qo‘lda yozish shart emas.',
  },
  {
    icon: ImageIcon,
    title: 'Rasm yuklash',
    text: 'Asosiy rasm va suratlarni to‘g‘ridan-to‘g‘ri botga tashlaysiz.',
  },
  {
    icon: Music,
    title: 'Fon musiqasi',
    text: 'O‘zingiz xohlagan qo‘shiqni yuklaysiz — sahifada jaranglaydi.',
  },
  {
    icon: FileText,
    title: 'Batafsil ma’lumot',
    text: 'Sana, vaqt, kiyim uslubi, qisqa hikoya — hammasini kiritasiz.',
  },
  { icon: Bell, title: 'Javob xabari', text: 'Mehmon “kelaman” bossa, botga darrov xabar keladi.' },
  {
    icon: ListChecks,
    title: 'Taklifnomalarim',
    text: '/myinvites — barcha taklifnomalaringiz va havolalari bir joyda.',
  },
  {
    icon: Zap,
    title: 'Tez va oson',
    text: 'Butun jarayon Telegram ichida — 2 daqiqada tayyor havola.',
  },
];

const WEB_FEATURES: ReadonlyArray<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Clock, title: 'Sanoq', text: 'To‘yga qolgan kun-soatni jonli sanaydi.' },
  { icon: MapIcon, title: 'Xarita', text: 'Yandex Maps + “Yo‘l ko‘rsatish” tugmasi.' },
  {
    icon: ImageIcon,
    title: 'Galereya',
    text: 'Suratlar chiroyli tarzda, bosilganda kattalashadi.',
  },
  {
    icon: CheckCircle,
    title: 'Javob formasi',
    text: 'Mehmon kelishini va necha kishi ekanini bildiradi.',
  },
  {
    icon: Smartphone,
    title: 'Telefonga mos',
    text: 'Asosan telefonda ochiladi — hamma joyda chiroyli.',
  },
  { icon: Sparkles, title: 'Animatsiya', text: 'Yumshoq, zamonaviy animatsiyalar bilan jonli.' },
];

const TEMPLATES: ReadonlyArray<{ name: string; desc: string; img: string }> = [
  {
    name: 'Klassik',
    desc: 'Nafis, iliq, an’anaviy',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75',
  },
  {
    name: 'Zamonaviy',
    desc: 'To‘q fon, oltin urg‘u',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=75',
  },
  {
    name: 'Minimal',
    desc: 'Sokin, keng, oddiy',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=75',
  },
];

function TelegramButton({
  label,
  variant = 'solid',
}: {
  label: string;
  variant?: 'solid' | 'ghost';
}): ReactNode {
  const base = 'inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-medium transition-all';
  const style =
    variant === 'solid'
      ? 'bg-gold text-white shadow-lg shadow-gold/20 hover:-translate-y-0.5 hover:shadow-xl'
      : 'border border-blush text-ink hover:border-gold';
  return (
    <a href={BOT_URL} target="_blank" rel="noreferrer" className={`${base} ${style}`}>
      <Send className="h-4 w-4" strokeWidth={2} />
      {label}
    </a>
  );
}

export function LandingPage(): ReactNode {
  return (
    <main className="bg-cream pattern-soft text-ink">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">
          taklif<span className="text-gold">.uz</span>
        </span>
        <TelegramButton label="Boshlash" />
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-10 text-center">
        <Reveal>
          <div className="animate-draw-in animate-float mx-auto mb-8 w-fit">
            <Monogram left="Aziz" right="Malika" />
          </div>
          <p className="mb-5 inline-block rounded-full border border-blush bg-white/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
            To‘y taklifnomasi · O‘zbekiston
          </p>
          <h1 className="mx-auto max-w-3xl font-display text-5xl font-medium leading-[1.05] sm:text-7xl">
            Chiroyli to‘y taklifnomasi
            <span className="mt-2 block text-gold">Telegramda 2 daqiqada</span>
          </h1>
          <Flourish className="mx-auto mt-6 w-48" />
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            Bot orqali savol-javob qilasiz, tizim chiroyli, animatsiyali web taklifnoma yaratadi va
            noyob havola beradi. Mehmonlar bir bosishda “kelaman” deydi.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <TelegramButton label="Telegramda yaratish" />
            <Link
              href={DEMO_URL}
              className="inline-flex items-center gap-2 rounded-full border border-blush px-8 py-3.5 font-medium text-ink transition-colors hover:border-gold"
            >
              <Eye className="h-4 w-4" strokeWidth={2} />
              Namunani ko‘rish
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Bu nima? */}
      <section className="border-y border-blush/60 bg-white/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">Bu nima?</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              <b>taklif.uz</b> — to‘y uchun <b>elektron taklifnoma</b> yaratish xizmati. Kuyov-kelin
              Telegram bot orqali ma’lumot kiritadi, biz esa chiroyli, mobil, animatsiyali web
              sahifa tayyorlab beramiz. Mehmonlar havolani ochib, to‘y haqidagi barcha ma’lumotni
              ko‘radi va kelishini bildiradi. Qog‘oz taklifnoma emas — zamonaviy, tez va tejamli.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Qanday ishlaydi? */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Taklifnomani qanday olaman?</h2>
            <p className="mt-3 text-ink/60">4 ta oddiy qadam — hammasi Telegram ichida.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-blush bg-white/60 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <s.icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-2xl font-bold text-blush">{s.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <TelegramButton label="Hoziroq boshlash" />
        </div>
      </section>

      {/* Bot imkoniyatlari */}
      <section className="border-y border-blush/60 bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <Bot className="mb-3 h-8 w-8 text-gold" strokeWidth={1.75} />
              <h2 className="font-display text-4xl sm:text-5xl">Bot imkoniyatlari</h2>
              <p className="mt-3 text-ink/60">Botda taklifnomangizni to‘liq sozlaysiz.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BOT_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05} variant="scale">
                <div className="h-full rounded-2xl border border-blush bg-cream/70 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <f.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Web taklifnoma imkoniyatlari */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <Sparkles className="mb-3 h-8 w-8 text-gold" strokeWidth={1.75} />
            <h2 className="text-2xl font-semibold sm:text-3xl">Web taklifnomada nima bor?</h2>
            <p className="mt-3 text-ink/60">Mehmon havolani ochganda ko‘radigan narsalar.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WEB_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05} variant="scale">
              <div className="flex h-full items-start gap-4 rounded-2xl border border-blush bg-white/60 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <f.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shablonlar */}
      <section className="border-y border-blush/60 bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-4xl sm:text-5xl">Shablonlar</h2>
              <p className="mt-3 text-ink/60">
                Botda birini tanlaysiz — keyin ham o‘zgartira olasiz.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TEMPLATES.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08} variant="scale">
                <div className="overflow-hidden rounded-2xl border border-blush bg-cream">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="mt-1 text-sm text-ink/60">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Reveal variant="scale">
          <div className="relative rounded-3xl border border-blush bg-white/50 px-6 py-16 text-center shadow-sm">
            <Corners className="text-gold/40" />
            <Flourish className="mx-auto mb-6 w-40" />
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              To‘yingizni <span className="text-gold">chiroyli boshlang</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-ink/70">
              Hoziroq botni oching va bir necha daqiqada tayyor, ulashishga tayyor taklifnomangizni
              oling.
            </p>
            <div className="mt-9">
              <TelegramButton label="Telegramda boshlash" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-blush/60 py-8 text-center text-sm text-ink/50">
        <p>
          taklif<span className="text-gold">.uz</span> — elektron to‘y taklifnomalari
        </p>
        <a
          href={BOT_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block hover:text-gold"
        >
          @weddingiinvitation_bot
        </a>
      </footer>
    </main>
  );
}
