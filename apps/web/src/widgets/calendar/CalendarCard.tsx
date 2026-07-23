import type { ReactNode } from 'react';

interface CalendarCardProps {
  readonly eventDate: string; // YYYY-MM-DD
  readonly locale: string;
  /** Rang uslubi: 'dark' (zumrad fon) yoki 'light' (krem fon). */
  readonly tone?: 'dark' | 'light';
}

const MONTHS: Record<string, readonly string[]> = {
  uz: [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr',
  ],
  ru: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
};

// Dushanba — hafta boshi (O'zbekiston/Rossiya konvensiyasi)
const WEEKDAYS: Record<string, readonly string[]> = {
  uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
};

/** Berilgan yil/oy uchun kunlar setkatkasini quradi (Dushanbadan boshlab). */
function buildGrid(year: number, month0: number): (number | null)[] {
  const first = new Date(Date.UTC(year, month0, 1));
  const startDow = (first.getUTCDay() + 6) % 7; // Du=0 ... Ya=6
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * Nikoh sanasi belgilangan oylik kalendar kartasi.
 * To'y kuni oltin doira bilan ajratiladi.
 */
export function CalendarCard({ eventDate, locale, tone = 'dark' }: CalendarCardProps): ReactNode {
  const [yearRaw, monthRaw, dayRaw] = eventDate.split('-');
  const year = Number(yearRaw);
  const month0 = Number(monthRaw) - 1;
  const day = Number(dayRaw);
  const lang = locale === 'ru' ? 'ru' : 'uz';
  const monthName = MONTHS[lang]?.[month0] ?? '';
  const weekdays = WEEKDAYS[lang] ?? WEEKDAYS.uz!;
  const cells = buildGrid(year, month0);

  const dark = tone === 'dark';
  const frame = dark ? 'border-gold-light/30 bg-white/[0.03]' : 'border-gold/25 bg-white/50';
  const head = dark ? 'text-gold-light' : 'text-gold';
  const dim = dark ? 'text-ivory/45' : 'text-ink/45';
  const num = dark ? 'text-ivory/85' : 'text-ink/80';

  return (
    <div className={`mx-auto max-w-xs rounded-2xl border ${frame} p-5 backdrop-blur-sm`}>
      <p className={`text-center font-display text-xl tracking-wide ${head}`}>
        {monthName} {year}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center text-[0.7rem]">
        {weekdays.map((w) => (
          <span key={w} className={`font-medium uppercase tracking-wider ${dim}`}>
            {w}
          </span>
        ))}
        {cells.map((c, i) => {
          if (c === null) return <span key={`e${i}`} />;
          const isDay = c === day;
          return (
            <span
              key={c}
              className={
                isDay
                  ? `mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gold-light font-semibold text-emerald-deep shadow-[0_0_16px_rgba(216,189,130,0.5)]`
                  : `flex h-8 items-center justify-center text-sm ${num}`
              }
            >
              {isDay ? (
                <span className="flex flex-col items-center leading-none">
                  <span>{c}</span>
                </span>
              ) : (
                c
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
