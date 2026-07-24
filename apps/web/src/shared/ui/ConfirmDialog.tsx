'use client';

import { type ReactNode, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly busy?: boolean;
}

/** Custom tasdiqlash oynasi (window.confirm o'rniga) — shadcn/tailwind uslubi. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps): ReactNode {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="animate-dialog-in relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-left shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" strokeWidth={2} />
        </span>
        <h2 id="confirm-title" className="mt-4 text-lg font-bold">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
