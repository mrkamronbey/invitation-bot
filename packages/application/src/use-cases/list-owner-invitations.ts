import type { Invitation, InvitationRepository } from '@invitation/domain';

export interface ListOwnerInvitationsDeps {
  readonly invitations: InvitationRepository;
}

/** Egaga tegishli barcha taklifnomalar (bot /myinvites uchun). */
export class ListOwnerInvitationsUseCase {
  constructor(private readonly deps: ListOwnerInvitationsDeps) {}

  execute(ownerId: string): Promise<Invitation[]> {
    return this.deps.invitations.listByOwner(ownerId);
  }
}
