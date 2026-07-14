import type { Rsvp } from '../entities/rsvp';

/** Xabar yuboriladigan taklifnoma egasi. */
export interface OwnerRef {
  readonly telegramId: number;
  readonly locale: string;
}

/** Xabarnoma (port) — bugun Telegram, ertaga SMS/email adapter qo'shsa bo'ladi. */
export interface Notifier {
  notifyRsvp(owner: OwnerRef, rsvp: Rsvp, invitationSlug: string): Promise<void>;
}
