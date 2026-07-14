import type { ReactNode } from 'react';
import { getMessages } from '@invitation/i18n';
import type { TemplateProps } from '../types';
import { Section } from '@/shared/ui/Section';
import { Reveal } from '@/shared/ui/Reveal';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { Countdown } from '@/widgets/countdown/Countdown';
import { Gallery } from '@/widgets/gallery/Gallery';
import { MapBlock } from '@/widgets/map/MapBlock';
import { RsvpForm } from '@/features/submit-rsvp/RsvpForm';

/** Klassik shablon — nafis, serif, iliq ranglar. */
export function ClassicTemplate({ invitation }: TemplateProps): ReactNode {
  const m = getMessages(invitation.locale);
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-cream font-serif text-ink">
      {/* Hero */}
      <header
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={
          invitation.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(44,38,32,0.45), rgba(44,38,32,0.55)), url(${invitation.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="animate-fade-up text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/80">Taklifnoma</p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">
            {invitation.groomName}
            <span className="mx-3 text-gold">&amp;</span>
            {invitation.brideName}
          </h1>
          <p className="mt-6 text-lg tracking-wide text-white/90">{dateLine}</p>
        </div>
      </header>

      {/* Countdown */}
      <Section title={m.web.countdownLabel}>
        <Reveal>
          <Countdown
            eventDate={invitation.eventDate}
            eventTime={invitation.eventTime}
            locale={invitation.locale}
          />
        </Reveal>
      </Section>

      {/* Story */}
      {invitation.story ? (
        <Section>
          <Reveal>
            <p className="text-center text-lg leading-relaxed text-ink/80">{invitation.story}</p>
          </Reveal>
        </Section>
      ) : null}

      {/* Map */}
      {invitation.venue ? (
        <Section>
          <Reveal>
            <MapBlock venue={invitation.venue} locale={invitation.locale} />
          </Reveal>
        </Section>
      ) : null}

      {/* Dress code */}
      {invitation.dressCode ? (
        <Section>
          <Reveal>
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-gold">{m.web.dressCode}</p>
              <p className="mt-2 text-lg text-ink/80">{invitation.dressCode}</p>
            </div>
          </Reveal>
        </Section>
      ) : null}

      {/* Gallery */}
      {invitation.gallery.length > 0 ? (
        <Section>
          <Gallery images={invitation.gallery} />
        </Section>
      ) : null}

      {/* RSVP */}
      <Section title={m.web.rsvpTitle} className="pb-20">
        <Reveal>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </Reveal>
      </Section>

      {!invitation.isPremium ? (
        <footer className="pb-10 text-center text-xs text-ink/40">
          taklif.uz orqali yaratilgan
        </footer>
      ) : null}
    </main>
  );
}
