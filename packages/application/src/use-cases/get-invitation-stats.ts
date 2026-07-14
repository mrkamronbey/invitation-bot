import {
  type InvitationRepository,
  type Result,
  type RsvpRepository,
  DomainError,
  err,
  ok,
} from '@invitation/domain';

export interface GetInvitationStatsDeps {
  readonly invitations: InvitationRepository;
  readonly rsvps: RsvpRepository;
}

export interface GuestEntry {
  readonly name: string;
  readonly attending: boolean;
  readonly guestsCount: number;
  readonly message?: string;
}

/** Taklifnoma bo'yicha mehmon javoblari jamlanmasi (egaga ko'rsatiladi). */
export interface InvitationStats {
  readonly groomName: string;
  readonly brideName: string;
  readonly responses: number;
  readonly attendingResponses: number;
  readonly decliningResponses: number;
  readonly totalGuests: number;
  readonly entries: readonly GuestEntry[];
}

/** Egaga taklifnoma statistikasini (kim keladi, necha kishi) qaytaradi. */
export class GetInvitationStatsUseCase {
  constructor(private readonly deps: GetInvitationStatsDeps) {}

  async execute(
    invitationId: string,
    ownerId: string,
  ): Promise<Result<InvitationStats, DomainError>> {
    const invitation = await this.deps.invitations.findById(invitationId);
    if (!invitation || invitation.ownerId !== ownerId) {
      return err(new DomainError('INVITATION_NOT_FOUND', 'Taklifnoma topilmadi.'));
    }

    const rsvps = await this.deps.rsvps.listByInvitation(invitationId);
    const attending = rsvps.filter((r) => r.attending);

    return ok({
      groomName: invitation.groomName,
      brideName: invitation.brideName,
      responses: rsvps.length,
      attendingResponses: attending.length,
      decliningResponses: rsvps.length - attending.length,
      totalGuests: attending.reduce((sum, r) => sum + r.guestsCount, 0),
      entries: rsvps.map((r) => ({
        name: r.guestName,
        attending: r.attending,
        guestsCount: r.guestsCount,
        message: r.message,
      })),
    });
  }
}
