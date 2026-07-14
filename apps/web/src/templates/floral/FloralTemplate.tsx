import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { Flourish, Monogram } from '@/shared/ui/ornaments';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/**
 * Gulli ramka shabloni — Canva'da yaratilgan floral ramka (oq atirgul + oltin)
 * kartochka fonida, markazida kuyov-kelin ismi va sana.
 */
export function FloralTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-cream pattern-soft text-ink">
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="relative flex aspect-[900/1268] w-full max-w-[440px] flex-col items-center justify-center bg-contain bg-center bg-no-repeat px-10 text-center sm:px-12"
          style={{ backgroundImage: 'url(/images/frame-floral.png)' }}
        >
          <div className="animate-draw-in animate-float">
            <Monogram left={invitation.groomName} right={invitation.brideName} />
          </div>
          <p className="mt-6 animate-fade-in text-[0.65rem] uppercase tracking-[0.35em] text-gold">
            Taklifnoma
          </p>
          <h1 className="mt-3 animate-fade-up font-display text-3xl font-medium leading-tight sm:text-4xl">
            {invitation.groomName}
            <span className="mx-2 text-gold">&amp;</span>
            {invitation.brideName}
          </h1>
          <Flourish className="mt-4 w-28 animate-fade-up" />
          <p className="mt-4 animate-fade-up text-[0.7rem] uppercase tracking-[0.2em] text-ink/70">
            {dateLine}
          </p>
        </div>
      </section>

      <InvitationBody invitation={invitation} />
    </main>
  );
}
