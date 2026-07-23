import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { RoyalCover } from './RoyalCover';
import { RoyalHero } from './RoyalHero';
import { RoyalBody } from './RoyalBody';

const WEEKDAYS: Record<string, readonly string[]> = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
};
const MONTHS: Record<string, readonly string[]> = {
  uz: [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
  ru: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
};

/** eventDate (YYYY-MM-DD) → hafta kuni / kun / oy / yil (til bo'yicha). */
function dateParts(eventDate: string, locale: string): {
  weekday: string;
  day: string;
  month: string;
  year: string;
} {
  const loc = locale === 'ru' ? 'ru' : 'uz';
  const parts = eventDate.split('-');
  const y = Number(parts[0]) || new Date().getUTCFullYear();
  const m = Number(parts[1]) || 1;
  const d = Number(parts[2]) || 1;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return {
    weekday: WEEKDAYS[loc]?.[dt.getUTCDay()] ?? '',
    day: String(d).padStart(2, '0'),
    month: MONTHS[loc]?.[m - 1] ?? '',
    year: String(y),
  };
}

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
  const eyebrow = ru ? 'Приглашаем вас на свадьбу' : 'Sizni to‘yga taklif qilamiz';
  const dp = dateParts(invitation.eventDate, invitation.locale);

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
        <RoyalHero
          groom={invitation.groomName}
          bride={invitation.brideName}
          kicker={kicker}
          eyebrow={eyebrow}
          weekday={dp.weekday}
          day={dp.day}
          month={dp.month}
          year={dp.year}
          venue={invitation.venue?.name}
        />
        <div className="pattern-soft-dark">
          <RoyalBody invitation={invitation} />
        </div>
      </main>
    </RoyalCover>
  );
}
