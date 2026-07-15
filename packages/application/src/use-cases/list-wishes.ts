import type { InvitationRepository, RsvpRepository } from '@invitation/domain';

export interface ListWishesDeps {
  readonly invitations: InvitationRepository;
  readonly rsvps: RsvpRepository;
}

/** Sahifada ko'rsatiladigan bitta tilak (mehmon ismi + tabrik matni). */
export interface WishItem {
  readonly name: string;
  readonly message: string;
}

/**
 * Taklifnoma bo'yicha mehmon tilaklari (izohli RSVP javoblari) — "tilaklar devori".
 * Faqat matn qoldirganlar ko'rsatiladi.
 */
export class ListWishesUseCase {
  constructor(private readonly deps: ListWishesDeps) {}

  async execute(slug: string): Promise<WishItem[]> {
    const invitation = await this.deps.invitations.findBySlug(slug);
    if (!invitation) return [];

    const rsvps = await this.deps.rsvps.listByInvitation(invitation.id);
    return rsvps
      .filter((r): r is typeof r & { message: string } => Boolean(r.message && r.message.trim()))
      .map((r) => ({ name: r.guestName, message: r.message }));
  }
}
