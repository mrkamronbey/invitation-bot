import {
  type Clock,
  type Invitation,
  type InvitationRepository,
  type Result,
  DomainError,
  EventDate,
  createInvitation,
  err,
  ok,
} from '@invitation/domain';
import type { UpdateInvitationPatch } from '@invitation/contracts';

export interface UpdateInvitationDeps {
  readonly invitations: InvitationRepository;
  readonly clock: Clock;
}

export interface UpdateInvitationInput {
  readonly invitationId: string;
  readonly ownerId: string;
  readonly patch: UpdateInvitationPatch;
}

/**
 * Mavjud taklifnomani tahrirlaydi. Slug o'zgarmaydi (ulashilgan havolalar buzilmasin),
 * egalik tekshiriladi, sana kelajakda ekani qayta validatsiya qilinadi.
 */
export class UpdateInvitationUseCase {
  constructor(private readonly deps: UpdateInvitationDeps) {}

  async execute(input: UpdateInvitationInput): Promise<Result<Invitation, DomainError>> {
    const existing = await this.deps.invitations.findById(input.invitationId);
    if (!existing || existing.ownerId !== input.ownerId) {
      return err(new DomainError('INVITATION_NOT_FOUND', 'Taklifnoma topilmadi.'));
    }

    const p = input.patch;
    const rebuilt = createInvitation({
      id: existing.id,
      ownerId: existing.ownerId,
      slug: existing.slug,
      templateId: p.templateId ?? existing.templateId,
      groomName: p.groomName ?? existing.groomName,
      brideName: p.brideName ?? existing.brideName,
      eventDate: p.eventDate ?? existing.eventDate,
      eventTime: p.eventTime ?? existing.eventTime,
      venueName: p.venueName ?? existing.venue?.name,
      venueAddress: existing.venue?.address,
      location: p.location ?? existing.venue?.geo,
      story: p.story ?? existing.story,
      dressCode: p.dressCode ?? existing.dressCode,
      parents: p.parents ?? existing.parents,
      schedule: p.schedule ?? existing.schedule,
      gift: p.gift ?? existing.gift,
      coverImageUrl: p.coverImageUrl ?? existing.coverImageUrl,
      gallery: existing.gallery,
      musicUrl: p.musicUrl ?? existing.musicUrl,
      musicSource: p.musicSource ?? existing.musicSource,
      locale: existing.locale,
    });
    if (!rebuilt.ok) return rebuilt;

    const date = EventDate.create(rebuilt.value.eventDate);
    if (!date.ok) return date;
    if (!date.value.isAfter(this.deps.clock.now())) {
      return err(new DomainError('INVALID_DATE', "To'y sanasi kelajakda bo'lishi kerak."));
    }

    const updated: Invitation = {
      ...rebuilt.value,
      status: existing.status,
      isPremium: existing.isPremium,
    };
    await this.deps.invitations.save(updated);
    return ok(updated);
  }
}
