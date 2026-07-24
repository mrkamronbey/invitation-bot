'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

/** Toast turi va hodisasi — client komponentlar `toast.*` orqali chaqiradi. */
type ToastKind = 'error' | 'success';
interface ToastItem {
  readonly id: number;
  readonly kind: ToastKind;
  readonly message: string;
}

const TOAST_EVENT = 'app:toast';
let counter = 0;

function emit(kind: ToastKind, message: string): void {
  if (typeof window === 'undefined') return;
  const detail: ToastItem = { id: ++counter, kind, message };
  window.dispatchEvent(new CustomEvent<ToastItem>(TOAST_EVENT, { detail }));
}

/** Sahifaning istalgan joyidan chaqiriladigan toast helper. */
export const toast = {
  error: (message: string): void => emit('error', message),
  success: (message: string): void => emit('success', message),
};

/** Ekranning yuqori-o'ng burchagida toast'larni ko'rsatuvchi konteyner. */
export function Toaster(): ReactNode {
  const [items, setItems] = useState<readonly ToastItem[]>([]);

  useEffect(() => {
    function onToast(e: Event): void {
      const detail = (e as CustomEvent<ToastItem>).detail;
      setItems((prev) => [...prev, detail]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== detail.id));
      }, 4500);
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  const dismiss = (id: number): void => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${
            t.kind === 'error'
              ? 'border-destructive/30 bg-destructive/10 text-destructive'
              : 'border-primary/30 bg-primary/10 text-primary'
          }`}
        >
          {t.kind === 'error' ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
          )}
          <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Close"
            className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
