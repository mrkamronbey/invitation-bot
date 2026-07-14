import type { Invitation, InvitationRepository } from '@invitation/domain';

export interface GetInvitationBySlugDeps {
  readonly invitations: InvitationRepository;
}

/** Slug bo'yicha faqat `published` taklifnomani qaytaradi (web sahifa uchun). */
export class GetInvitationBySlugUseCase {
  constructor(private readonly deps: GetInvitationBySlugDeps) {}

  async execute(slug: string): Promise<Invitation | null> {
    const invitation = await this.deps.invitations.findBySlug(slug);
    if (!invitation || invitation.status !== 'published') return null;
    return invitation;
  }
}
