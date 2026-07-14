import {
  type Clock,
  type IdGenerator,
  type InvitationRepository,
  type Notifier,
  type Result,
  type Rsvp,
  type RsvpRepository,
  type UserRepository,
  DomainError,
  createRsvp,
  err,
  ok,
} from '@invitation/domain';
import type { RsvpInput } from '@invitation/contracts';

export interface SubmitRsvpDeps {
  readonly invitations: InvitationRepository;
  readonly rsvps: RsvpRepository;
  readonly users: UserRepository;
  readonly notifier: Notifier;
  readonly ids: IdGenerator;
  readonly clock: Clock;
}

/**
 * Mehmon RSVP javobini saqlaydi va taklifnoma egasiga xabar yuboradi.
 * Xabar yuborishdagi xato RSVP saqlanishini buzmaydi (best-effort).
 */
export class SubmitRsvpUseCase {
  constructor(private readonly deps: SubmitRsvpDeps) {}

  async execute(input: RsvpInput): Promise<Result<Rsvp, DomainError>> {
    const invitation = await this.deps.invitations.findBySlug(input.slug);
    if (!invitation || invitation.status !== 'published') {
      return err(new DomainError('INVITATION_NOT_FOUND', 'Taklifnoma topilmadi.'));
    }

    const rsvp = createRsvp({
      id: this.deps.ids.generate(),
      invitationId: invitation.id,
      guestName: input.guestName,
      attending: input.attending,
      guestsCount: input.guestsCount,
      message: input.message,
      createdAt: this.deps.clock.now().toISOString(),
    });
    if (!rsvp.ok) return rsvp;

    await this.deps.rsvps.save(rsvp.value);
    await this.notifyOwner(invitation.ownerId, rsvp.value, invitation.slug);

    return ok(rsvp.value);
  }

  private async notifyOwner(ownerId: string, rsvp: Rsvp, slug: string): Promise<void> {
    try {
      const owner = await this.deps.users.findById(ownerId);
      if (!owner) return;
      await this.deps.notifier.notifyRsvp(
        { telegramId: owner.telegramId, locale: owner.languageCode },
        rsvp,
        slug,
      );
    } catch {
      // Xabar yuborilmasa ham RSVP saqlangan — jimgina o'tkazamiz (best-effort).
    }
  }
}
