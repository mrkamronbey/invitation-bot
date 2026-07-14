import { InlineKeyboard } from 'grammy';
import type { Messages } from '@invitation/i18n';

type M = Messages['bot'];

const pad = (n: number): string => String(n).padStart(2, '0');

/** `YYYY-MM` (1-asosli oy) — nav callback uchun. */
function ym(year: number, month0: number): string {
  return `${year}-${pad(month0 + 1)}`;
}

/**
 * Inline tugmali kalendar. Kunni bosib sana tanlanadi (yozishsiz).
 * O'tgan kunlar tanlanmaydi; ‹ › bilan oydan-oyga o'tiladi.
 * Callbacklar: cal:nav:YYYY-MM, cal:day:YYYY-MM-DD, cal:back, cal:cancel, cal:noop.
 */
export function buildCalendar(
  m: M,
  year: number,
  month0: number,
  todayIso: string,
  canBack: boolean,
): InlineKeyboard {
  const kb = new InlineKeyboard();
  const todayY = Number(todayIso.slice(0, 4));
  const todayM0 = Number(todayIso.slice(5, 7)) - 1;
  const atCurrentMonth = year === todayY && month0 === todayM0;

  // Sarlavha: ‹ Oy Yil ›
  if (atCurrentMonth) kb.text('·', 'cal:noop');
  else {
    const [py, pm] = month0 === 0 ? [year - 1, 11] : [year, month0 - 1];
    kb.text('‹', `cal:nav:${ym(py, pm)}`);
  }
  kb.text(m.calMonth(year, month0), 'cal:noop');
  const [ny, nm] = month0 === 11 ? [year + 1, 0] : [year, month0 + 1];
  kb.text('›', `cal:nav:${ym(ny, nm)}`).row();

  // Hafta kunlari sarlavhasi
  for (const w of m.calWeekdays) kb.text(w, 'cal:noop');
  kb.row();

  // Kunlar to'ri (dushanbadan boshlab)
  const firstWeekday = (new Date(Date.UTC(year, month0, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  let col = 0;
  for (let b = 0; b < firstWeekday; b++) {
    kb.text(' ', 'cal:noop');
    col++;
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${pad(month0 + 1)}-${pad(day)}`;
    if (iso < todayIso) kb.text('·', 'cal:noop');
    else kb.text(String(day), `cal:day:${iso}`);
    col++;
    if (col === 7) {
      kb.row();
      col = 0;
    }
  }
  if (col > 0) {
    while (col < 7) {
      kb.text(' ', 'cal:noop');
      col++;
    }
    kb.row();
  }

  // Boshqaruv
  if (canBack) kb.text(m.backButton, 'cal:back');
  kb.text(m.cancelButton, 'cal:cancel');
  return kb;
}
