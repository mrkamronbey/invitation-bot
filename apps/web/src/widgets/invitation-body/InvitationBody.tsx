import type { ReactNode } from 'react';
import type { Invitation } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';
import { Section } from '@/shared/ui/Section';
import { Reveal } from '@/shared/ui/Reveal';
import { Countdown } from '@/widgets/countdown/Countdown';
import { Gallery } from '@/widgets/gallery/Gallery';
import { MapBlock } from '@/widgets/map/MapBlock';
import { MusicToggle } from '@/widgets/music/MusicToggle';
import { WishesWall } from '@/widgets/wishes/WishesWall';
import { RsvpForm } from '@/features/submit-rsvp/RsvpForm';

interface InvitationBodyProps {
  readonly invitation: Invitation;
}

/**
 * Taklifnoma tanasi — barcha shablonlar uchun umumiy bloklar (DRY).
 * Shablonlar faqat Hero va tashqi uslub (fon/shrift) bilan farq qiladi,
 * tana esa shu yerda bir marta yig'ilgan.
 */
export function InvitationBody({ invitation }: InvitationBodyProps): ReactNode {
  const m = getMessages(invitation.locale);

  return (
    <>
      <Section title={m.web.countdownLabel}>
        <Reveal>
          <Countdown
            eventDate={invitation.eventDate}
            eventTime={invitation.eventTime}
            locale={invitation.locale}
          />
        </Reveal>
      </Section>

      {invitation.story ? (
        <Section>
          <Reveal>
            <p className="text-center font-display text-2xl italic leading-relaxed opacity-90 sm:text-3xl">
              “{invitation.story}”
            </p>
          </Reveal>
        </Section>
      ) : null}

      {invitation.venue ? (
        <Section>
          <Reveal>
            <MapBlock venue={invitation.venue} locale={invitation.locale} />
          </Reveal>
        </Section>
      ) : null}

      {invitation.dressCode ? (
        <Section>
          <Reveal>
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-gold">{m.web.dressCode}</p>
              <p className="mt-2 text-lg opacity-80">{invitation.dressCode}</p>
            </div>
          </Reveal>
        </Section>
      ) : null}

      {invitation.gallery.length > 0 ? (
        <Section>
          <Gallery images={invitation.gallery} />
        </Section>
      ) : null}

      <WishesWall slug={invitation.slug} locale={invitation.locale} />

      <Section title={m.web.rsvpTitle} className="pb-20">
        <Reveal>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </Reveal>
      </Section>

      {invitation.musicUrl ? <MusicToggle src={invitation.musicUrl} /> : null}

      {!invitation.isPremium ? (
        <footer className="pb-10 text-center text-xs opacity-40">
          taklif.uz orqali yaratilgan
        </footer>
      ) : null}
    </>
  );
}
