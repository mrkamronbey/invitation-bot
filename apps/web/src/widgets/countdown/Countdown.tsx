'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMessages } from '@invitation/i18n';

interface CountdownProps {
  readonly eventDate: string;
  readonly eventTime?: string;
  readonly locale: string;
}

interface TimeLeft {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

function computeLeft(target: number): TimeLeft {
  const delta = Math.max(0, target - Date.now());
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
  };
}

export function Countdown({ eventDate, eventTime, locale }: CountdownProps): ReactNode {
  const target = new Date(`${eventDate}T${eventTime ?? '00:00'}:00`).getTime();
  const [mounted, setMounted] = useState(false);
  const [left, setLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setLeft(computeLeft(target));
    const id = setInterval(() => setLeft(computeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const m = getMessages(locale).web;
  const cells: ReadonlyArray<readonly [number, string]> = [
    [left.days, m.days],
    [left.hours, m.hours],
    [left.minutes, m.minutes],
    [left.seconds, m.seconds],
  ];

  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-5">
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="flex min-w-[64px] flex-col items-center rounded-lg border border-blush bg-white/60 px-3 py-4 shadow-sm"
        >
          <span className="font-sans text-3xl text-ink tabular-nums">
            {mounted ? String(value).padStart(2, '0') : '--'}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wider text-gold">{label}</span>
        </div>
      ))}
    </div>
  );
}
