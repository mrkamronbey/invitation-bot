'use client';

import { type ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, X } from 'lucide-react';
import type { SiteDict } from '@/shared/i18n/site';
import { Button, type ButtonProps } from '@/shared/ui/button';

interface Props {
  readonly botUsername: string;
  readonly t: SiteDict['login'];
  /** Ochuvchi tugma ko'rinishi (nav "Kirish", CTA va h.k. uchun moslash). */
  readonly triggerLabel?: string;
  readonly triggerVariant?: ButtonProps['variant'];
  readonly triggerSize?: ButtonProps['size'];
  readonly triggerFullWidth?: boolean;
  readonly triggerIcon?: boolean;
}

/** Bot orqali bir martalik kod bilan kirish (telefon raqamisiz — ishonchli). */
export function BotCodeLogin({
  botUsername,
  t,
  triggerLabel,
  triggerVariant = 'default',
  triggerSize = 'lg',
  triggerFullWidth = true,
  triggerIcon = true,
}: Props): ReactNode {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const botLink = `https://t.me/${botUsername}?start=login`;

  async function submit(): Promise<void> {
    if (!/^\d{6}$/.test(code)) {
      setError(t.codeError);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(t.codeError);
        setBusy(false);
      }
    } catch {
      setError(t.errServer);
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        className={triggerFullWidth ? 'w-full' : undefined}
        onClick={() => setOpen(true)}
      >
        {triggerIcon ? <Send className="h-4 w-4" strokeWidth={2} /> : null}
        {triggerLabel ?? t.button}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-center text-lg font-bold">{t.modalTitle}</h2>

            {/* 1-qadam: botni ochish */}
            <p className="mt-5 text-sm text-muted-foreground">{t.step1}</p>
            <Button asChild variant="outline" className="mt-2 w-full">
              <a href={botLink} target="_blank" rel="noreferrer">
                <Send className="h-4 w-4" strokeWidth={2} />
                {t.openBot}
              </a>
            </Button>

            {/* 2-qadam: kod kiritish */}
            <p className="mt-5 text-sm text-muted-foreground">{t.step2}</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder={t.codePlaceholder}
              className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-center text-2xl font-semibold tracking-[0.5em] text-foreground placeholder:tracking-[0.3em] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void submit();
              }}
            />

            {error ? (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button className="mt-5 w-full" onClick={submit} disabled={busy}>
              {busy ? t.submitting : t.submit}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
