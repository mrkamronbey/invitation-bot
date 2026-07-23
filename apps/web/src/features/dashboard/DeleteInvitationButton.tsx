'use client';

import type { ReactNode } from 'react';
import { removeInvitationAction } from '@/app/dashboard/actions';
import { Button } from '@/shared/ui/button';

/** Taklifnomani o'chirish — tasdiqlash bilan (server action). */
export function DeleteInvitationButton({
  id,
  label,
}: {
  readonly id: string;
  readonly label: string;
}): ReactNode {
  return (
    <form
      action={removeInvitationAction}
      onSubmit={(e) => {
        if (!window.confirm('Taklifnomani o‘chirishni tasdiqlaysizmi? Buni qaytarib bo‘lmaydi.')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm">
        {label}
      </Button>
    </form>
  );
}
