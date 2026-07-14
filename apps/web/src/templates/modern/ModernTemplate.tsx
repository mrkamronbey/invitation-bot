import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { Corners, Flourish, Monogram } from '@/shared/ui/ornaments';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Zamonaviy shablon — to'q fon, nafis serif, oltin naqsh urg'usi. */
export function ModernTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-night text-cream">
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {invitation.coverImageUrl ? (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `url(${invitation.coverImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : null}
        <span className="pointer-events-none absolute inset-4 border border-gold/20 sm:inset-6" />
        <Corners className="text-gold/50" />

        <div className="relative flex flex-col items-center animate-fade-up">
          <div className="animate-draw-in animate-float">
            <Monogram left={invitation.groomName} right={invitation.brideName} />
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.4em] text-gold">Muborak kun</p>
          <h1 className="mt-6 font-display text-6xl font-medium leading-[1.05] sm:text-8xl">
            {invitation.groomName}
            <br />
            <span className="text-gold">&amp;</span>
            <br />
            {invitation.brideName}
          </h1>
          <Flourish className="mt-6 text-gold/70" />
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-cream/80">{dateLine}</p>
        </div>
      </header>

      <div className="pattern-soft-dark">
        <InvitationBody invitation={invitation} />
      </div>
    </main>
  );
}
