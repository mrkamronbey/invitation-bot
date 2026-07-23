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

export interface DateParts {
  readonly weekday: string;
  readonly day: string;
  readonly month: string;
  readonly year: string;
}

/** eventDate (YYYY-MM-DD) → hafta kuni / kun / oy / yil (til bo'yicha). */
export function dateParts(eventDate: string, locale: string): DateParts {
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
