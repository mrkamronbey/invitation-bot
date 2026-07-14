import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';

const MAX_GUEST_NAME = 60;
const MAX_MESSAGE = 300;
const MAX_GUESTS = 20;

/** Rsvp — mehmonning javobi (keladi/kelmaydi + necha kishi). */
export interface Rsvp {
  readonly id: string;
  readonly invitationId: string;
  readonly guestName: string;
  readonly attending: boolean;
  readonly guestsCount: number;
  readonly message?: string;
  readonly createdAt: string; // ISO timestamp
}

export interface CreateRsvpInput {
  readonly id: string;
  readonly invitationId: string;
  readonly guestName: string;
  readonly attending: boolean;
  readonly guestsCount: number;
  readonly message?: string;
  readonly createdAt: string;
}

export function createRsvp(input: CreateRsvpInput): Result<Rsvp, DomainError> {
  const guestName = input.guestName.trim();
  if (guestName.length === 0 || guestName.length > MAX_GUEST_NAME) {
    return err(new DomainError('INVALID_GUEST_NAME', "Mehmon ismi 1..60 belgi bo'lishi kerak."));
  }

  const count = input.attending ? input.guestsCount : 0;
  if (
    input.attending &&
    (!Number.isInteger(input.guestsCount) ||
      input.guestsCount < 1 ||
      input.guestsCount > MAX_GUESTS)
  ) {
    return err(
      new DomainError('INVALID_GUESTS_COUNT', `Mehmonlar soni 1..${MAX_GUESTS} bo'lishi kerak.`),
    );
  }

  const message = input.message?.trim();
  if (message !== undefined && message.length > MAX_MESSAGE) {
    return err(new DomainError('INVALID_GUEST_NAME', `Izoh ${MAX_MESSAGE} belgidan oshmasin.`));
  }

  return ok({
    id: input.id,
    invitationId: input.invitationId,
    guestName,
    attending: input.attending,
    guestsCount: count,
    message: message && message.length > 0 ? message : undefined,
    createdAt: input.createdAt,
  });
}
