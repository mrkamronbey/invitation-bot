'use client';

import { type ReactNode, useMemo } from 'react';

interface AddToCalendarProps {
  readonly title: string;
  readonly eventDate: string; // YYYY-MM-DD
  readonly eventTime?: string; // HH:mm
  readonly location?: string;
  readonly details?: string;
  readonly label: string;
  readonly tone?: 'dark' | 'light';
}

/** `YYYY-MM-DD` + `HH:mm` → `YYYYMMDDTHHMMSS` (mahalliy, TZ-siz — soddaligi uchun). */
function stamp(dateIso: string, time: string, addHours = 0): string {
  const [y, mo, d] = dateIso.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const base = new Date(Date.UTC(y ?? 1970, (mo ?? 1) - 1, d ?? 1, (hh ?? 0) + addHours, mm ?? 0));
  const p = (n: number): string => String(n).padStart(2, '0');
  return (
    `${base.getUTCFullYear()}${p(base.getUTCMonth() + 1)}${p(base.getUTCDate())}` +
    `T${p(base.getUTCHours())}${p(base.getUTCMinutes())}00`
  );
}

/**
 * "Kalendarga qo'shish" — Google Calendar havolasi + .ics yuklab olish.
 * Mehmon to'y sanasini o'z telefoniga bir tegishda qo'shadi.
 */
export function AddToCalendar({
  title,
  eventDate,
  eventTime,
  location,
  details,
  label,
  tone = 'dark',
}: AddToCalendarProps): ReactNode {
  const time = eventTime && /^\d{2}:\d{2}$/.test(eventTime) ? eventTime : '17:00';
  const start = stamp(eventDate, time, 0);
  const end = stamp(eventDate, time, 4);

  const gcalUrl = useMemo(() => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${end}`,
      details: details ?? '',
      location: location ?? '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [title, start, end, details, location]);

  const icsHref = useMemo(() => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//taklif.uz//wedding//UZ',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      location ? `LOCATION:${location}` : '',
      details ? `DESCRIPTION:${details}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean);
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
  }, [start, end, title, location, details]);

  const dark = tone === 'dark';
  const cls = dark
    ? 'border-gold-light/50 text-gold-light hover:bg-gold-light/10'
    : 'border-gold/50 text-gold hover:bg-gold/10';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={gcalUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-[0.18em] transition ${cls}`}
      >
        <span aria-hidden>📅</span>
        {label}
      </a>
      <a
        href={icsHref}
        download="wedding.ics"
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-[0.18em] transition ${cls}`}
      >
        <span aria-hidden>⬇</span>
        .ics
      </a>
    </div>
  );
}
