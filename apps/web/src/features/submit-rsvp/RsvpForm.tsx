'use client';

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { getMessages } from '@invitation/i18n';
import { cn } from '@/shared/lib/cn';

interface RsvpFormProps {
  readonly slug: string;
  readonly locale: string;
}

type Status = 'idle' | 'sending' | 'done' | 'error';

/** RSVP forma — mehmon javobini /api/rsvp ga yuboradi. */
export function RsvpForm({ slug, locale }: RsvpFormProps): ReactNode {
  const m = getMessages(locale).web;
  const [status, setStatus] = useState<Status>('idle');
  const [attending, setAttending] = useState(true);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get('message') ?? '').trim();
    setStatus('sending');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          guestName: String(form.get('guestName') ?? '').trim(),
          attending,
          guestsCount: attending ? Number(form.get('guestsCount') ?? 1) : 1,
          message: message.length > 0 ? message : undefined,
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return <p className="text-center font-sans text-lg text-gold">{m.rsvpThanks}</p>;
  }

  const inputClass =
    'w-full rounded-lg border border-blush bg-white/70 px-4 py-2.5 text-ink outline-none focus:border-gold';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="guestName" required placeholder={m.rsvpName} className={inputClass} />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className={cn(
            'flex-1 rounded-lg border px-4 py-2.5 transition-colors',
            attending ? 'border-gold bg-gold text-white' : 'border-blush bg-white/70 text-ink',
          )}
        >
          {m.rsvpAttending} ✓
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className={cn(
            'flex-1 rounded-lg border px-4 py-2.5 transition-colors',
            !attending ? 'border-ink bg-ink text-white' : 'border-blush bg-white/70 text-ink',
          )}
        >
          {getMessages(locale).common.no}
        </button>
      </div>

      {attending ? (
        <label className="block">
          <span className="mb-1 block text-sm text-ink/70">{m.rsvpCount}</span>
          <input
            name="guestsCount"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
            className={inputClass}
          />
        </label>
      ) : null}

      <textarea name="message" rows={3} placeholder={m.rsvpMessage} className={inputClass} />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-gold py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {m.rsvpSubmit}
      </button>

      {status === 'error' ? (
        <p className="text-center text-sm text-red-600">{getMessages(locale).common.error}</p>
      ) : null}
    </form>
  );
}
