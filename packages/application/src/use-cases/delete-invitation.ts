import {
  type InvitationRepository,
  type Result,
  DomainError,
  err,
  ok,
} from '@invitation/domain';

export interface DeleteInvitationDeps {
  readonly invitations: InvitationRepository;
}

export interface DeleteInvitationInput {
  readonly invitationId: string;
  readonly ownerId: string;
}

/** Taklifnomani o'chiradi (faqat egasi). */
export class DeleteInvitationUseCase {
  constructor(private readonly deps: DeleteInvitationDeps) {}

  async execute(input: DeleteInvitationInput): Promise<Result<true, DomainError>> {
    const existing = await this.deps.invitations.findById(input.invitationId);
    if (!existing || existing.ownerId !== input.ownerId) {
      return err(new DomainError('INVITATION_NOT_FOUND', 'Taklifnoma topilmadi.'));
    }
    await this.deps.invitations.delete(input.invitationId);
    return ok(true);
  }
}
