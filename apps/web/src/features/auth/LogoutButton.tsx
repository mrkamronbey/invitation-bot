'use client';

import { type ReactNode, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

interface Props {
  readonly label: string;
  readonly confirmTitle: string;
  readonly confirmText: string;
  readonly cancelLabel: string;
}

/** Chiqish tugmasi — bosilganda custom tasdiqlash oynasi ochiladi. */
export function LogoutButton({ label, confirmTitle, confirmText, cancelLabel }: Props): ReactNode {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <form ref={formRef} action="/api/auth/logout" method="post">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <LogOut className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      </form>

      <ConfirmDialog
        open={open}
        title={confirmTitle}
        description={confirmText}
        confirmLabel={label}
        cancelLabel={cancelLabel}
        busy={busy}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setBusy(true);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
