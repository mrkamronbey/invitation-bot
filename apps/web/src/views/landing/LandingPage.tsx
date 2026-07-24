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
  PenLine,
  Send,
  Share2,
} from 'lucide-react';
import type { SiteDict, SiteLang } from '@/shared/i18n/site';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/button';
import { LangSwitcher } from '@/features/i18n/LangSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

const BOT_URL = 'https://t.me/weddingiinvitation_bot';
const DEMO_URL = '/i/aziz-va-malika';

const STEP_ICONS: readonly LucideIcon[] = [Bot, PenLine, Share2];
const INVITE_ICONS: readonly LucideIcon[] = [Clock, MapPin, Images, CalendarClock, Bell, Gift];
const WHY_ICONS: readonly LucideIcon[] = [Clock, Eye, Link2];

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
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

interface LandingProps {
  readonly lang: SiteLang;
  readonly dict: SiteDict;
}

export function LandingPage({ lang, dict: d }: LandingProps): ReactNode {
  return (
    <main className="bg-background text-foreground">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">
          taklif<span className="text-primary">.uz</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitcher current={lang} />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">{d.nav.login}</Link>
          </Button>
          <Button asChild size="sm">
            <a href={BOT_URL} target="_blank" rel="noreferrer">
              {d.nav.start}
            </a>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <Reveal>
          <p className="mb-6 inline-block rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            {d.hero.badge}
          </p>
          <h1 className="mx-auto max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            {d.hero.title1} <span className="text-primary">{d.hero.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {d.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={BOT_URL} target="_blank" rel="noreferrer">
                <Send className="h-4 w-4" strokeWidth={2} />
                {d.hero.create}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={DEMO_URL}>
                <Eye className="h-4 w-4" strokeWidth={2} />
                {d.hero.demo}
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Bu nima? */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal>
            <SectionHeading eyebrow={d.about.eyebrow} title={d.about.title} />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{d.about.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Qanday ishlaydi */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <SectionHeading title={d.how.title} subtitle={d.how.subtitle} />
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {d.how.steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? Bot;
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-primary">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <p className="mt-5 text-xs font-medium tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Taklifnomada nima bor? */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <SectionHeading eyebrow={d.invite.eyebrow} title={d.invite.title} subtitle={d.invite.subtitle} />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.invite.items.map((f, i) => {
              const Icon = INVITE_ICONS[i] ?? Clock;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-background p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-semibold">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <p className="mt-8 text-center text-sm text-muted-foreground">{d.invite.more}</p>
          </Reveal>
        </div>
      </section>

      {/* Nega taklif.uz */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <SectionHeading title={d.why.title} />
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {d.why.items.map((f, i) => {
            const Icon = WHY_ICONS[i] ?? Clock;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="rounded-2xl border border-border bg-card p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Namuna */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal variant="scale">
            <SectionHeading eyebrow={d.sample.eyebrow} title={d.sample.title} subtitle={d.sample.subtitle} />
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={DEMO_URL}>
                  <Eye className="h-4 w-4" strokeWidth={2} />
                  {d.sample.open}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <SectionHeading title={d.faq.title} />
        </Reveal>
        <div className="mt-12 space-y-4">
          {d.faq.items.map((item, i) => (
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
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{d.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">{d.cta.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={BOT_URL} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" strokeWidth={2} />
                  {d.cta.tg}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">{d.cta.site}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>
          taklif<span className="text-primary">.uz</span> — {d.footer}
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
