import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { RoyalCover } from './RoyalCover';
import { RoyalHero } from './RoyalHero';
import { RoyalBody } from './RoyalBody';

/**
 * Royal — to'q zumrad + oltin + oq atirgul premium shablon (chungdoi
 * royal-v2-green uslubi): konvert ochilishi → parallax gulli hero (miltillovchi
 * yulduzchalar) → to'q mavzu bo'limlar.
 * Bezaklar: apps/web/public/images/royal/flower-1..7.webp (RoyalFlora.tsx).
 */
export function RoyalTemplate({ invitation }: TemplateProps): ReactNode {
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');
  const kicker = ru ? 'Приглашение' : 'Taklifnoma';
  const eyebrow = ru ? 'Приглашаем вас на нашу свадьбу' : 'Sizni to‘yimizga taklif qilamiz';

  return (
    <RoyalCover
      groom={invitation.groomName}
      bride={invitation.brideName}
      dateLine={dateLine}
      kicker={kicker}
      openLabel={ru ? 'Открыть' : 'Ochish'}
      invitedPrefix={ru ? 'Уважаемый(ая)' : 'Hurmatli'}
      invitedSuffix={ru ? 'приглашаем вас на нашу свадьбу' : 'sizni to‘yimizga taklif qilamiz'}
    >
      <main className="min-h-screen bg-emerald-deep text-ivory">
        <RoyalHero groom={invitation.groomName} bride={invitation.brideName} eyebrow={eyebrow} />
        <div className="pattern-soft-dark">
          <RoyalBody invitation={invitation} />
        </div>
      </main>
    </RoyalCover>
  );
}
