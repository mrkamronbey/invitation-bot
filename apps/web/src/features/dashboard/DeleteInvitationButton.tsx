'use client';

import { type ReactNode, useRef, useState } from 'react';
import { removeInvitationAction } from '@/app/dashboard/actions';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

interface Props {
  readonly id: string;
  readonly label: string;
  readonly confirmTitle: string;
  readonly confirmText: string;
  readonly confirmYes: string;
  readonly confirmNo: string;
}

/** Taklifnomani o'chirish — custom tasdiqlash oynasi bilan (server action). */
export function DeleteInvitationButton({
  id,
  label,
  confirmTitle,
  confirmText,
  confirmYes,
  confirmNo,
}: Props): ReactNode {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <form ref={formRef} action={removeInvitationAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="button" variant="destructive" size="sm" onClick={() => setOpen(true)}>
          {label}
        </Button>
      </form>

      <ConfirmDialog
        open={open}
        title={confirmTitle}
        description={confirmText}
        confirmLabel={confirmYes}
        cancelLabel={confirmNo}
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
