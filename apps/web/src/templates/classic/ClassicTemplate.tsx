import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { Flourish, Monogram } from '@/shared/ui/ornaments';
import { FloralFrame } from '@/shared/ui/floral';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Klassik shablon — naqshinkor, nafis serif ismlar, iliq krem ranglar. */
export function ClassicTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={
          invitation.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(28,24,20,0.5), rgba(28,24,20,0.62)), url(${invitation.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {/* Naqshli ramka */}
        <span className="pointer-events-none absolute inset-4 rounded-[2px] border border-white/20 sm:inset-6" />
        <span className="pointer-events-none absolute inset-6 rounded-[2px] border border-white/10 sm:inset-8" />
        <FloralFrame />

        <div className="relative flex flex-col items-center text-white">
          <div className="animate-draw-in animate-float">
            <Monogram
              left={invitation.groomName}
              right={invitation.brideName}
              className="!text-white !border-white/60"
            />
          </div>
          <p className="mt-8 animate-fade-in text-xs uppercase tracking-[0.4em] text-white/80">
            Taklifnoma
          </p>
          <h1 className="mt-4 animate-fade-up font-display text-6xl font-medium leading-[1.05] sm:text-7xl">
            {invitation.groomName}
            <span className="mx-3 text-gold">&amp;</span>
            {invitation.brideName}
          </h1>
          <Flourish className="mt-6 animate-fade-up text-white/70" />
          <p className="mt-6 animate-fade-up text-sm uppercase tracking-[0.25em] text-white/90">
            {dateLine}
          </p>
        </div>

        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float text-white/50">
          ⌄
        </span>
      </header>

      <div className="pattern-soft">
        <InvitationBody invitation={invitation} />
      </div>
    </main>
  );
}
