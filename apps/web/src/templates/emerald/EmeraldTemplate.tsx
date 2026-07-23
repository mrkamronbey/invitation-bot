import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { EnvelopeCover } from './EnvelopeCover';
import { EmeraldHero } from './EmeraldHero';
import { EmeraldBody } from './EmeraldBody';

/**
 * Emerald — zumrad+oltin premium shablon (chungdoi uslubi):
 * konvert-ochilish animatsiyasi → real gulli hero → to'q mavzu bo'limlar.
 */
export function EmeraldTemplate({ invitation }: TemplateProps): ReactNode {
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');
  const kicker = ru ? 'Приглашение' : 'Taklifnoma';

  return (
    <EnvelopeCover
      groom={invitation.groomName}
      bride={invitation.brideName}
      dateLine={dateLine}
      kicker={kicker}
      openLabel={ru ? 'Открыть' : 'Ochish'}
      invitedPrefix={ru ? 'Уважаемый(ая)' : 'Hurmatli'}
      invitedSuffix={ru ? 'приглашаем вас на нашу свадьбу' : 'sizni to‘yimizga taklif qilamiz'}
    >
      <main className="min-h-screen bg-emerald-deep">
        <EmeraldHero
          groom={invitation.groomName}
          bride={invitation.brideName}
          dateLine={dateLine}
          kicker={kicker}
        />
        <div className="pattern-soft-dark">
          <EmeraldBody invitation={invitation} />
        </div>
      </main>
    </EnvelopeCover>
  );
}
