import {
  type Clock,
  type IdGenerator,
  type Invitation,
  type InvitationRepository,
  type Result,
  DomainError,
  EventDate,
  Slug,
  createInvitation,
  err,
  ok,
} from '@invitation/domain';
import type { CreateInvitationInput } from '@invitation/contracts';

const MAX_SLUG_ATTEMPTS = 50;

export interface CreateInvitationDeps {
  readonly invitations: InvitationRepository;
  readonly ids: IdGenerator;
  readonly clock: Clock;
}

/**
 * Yangi taklifnoma yaratadi: noyob slug generatsiya qiladi, biznes-qoidalarni
 * tekshiradi, entity yig'adi va published holatda saqlaydi.
 */
export class CreateInvitationUseCase {
  constructor(private readonly deps: CreateInvitationDeps) {}

  async execute(input: CreateInvitationInput): Promise<Result<Invitation, DomainError>> {
    const date = EventDate.create(input.eventDate);
    if (!date.ok) return date;
    if (!date.value.isAfter(this.deps.clock.now())) {
      return err(new DomainError('INVALID_DATE', "To'y sanasi kelajakda bo'lishi kerak."));
    }

    const baseSlug = Slug.fromNames(input.groomName, input.brideName);
    if (!baseSlug.ok) return baseSlug;

    const uniqueSlug = await this.resolveUniqueSlug(baseSlug.value);
    if (!uniqueSlug.ok) return uniqueSlug;

    const assembled = createInvitation({
      id: this.deps.ids.generate(),
      ownerId: input.ownerId,
      slug: uniqueSlug.value,
      templateId: input.templateId,
      groomName: input.groomName,
      brideName: input.brideName,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      location: input.location,
      story: input.story,
      dressCode: input.dressCode,
      parents: input.parents,
      schedule: input.schedule,
      gift: input.gift,
      coverImageUrl: input.coverImageUrl,
      gallery: input.gallery,
      musicUrl: input.musicUrl,
      musicSource: input.musicSource,
      locale: input.locale,
    });
    if (!assembled.ok) return assembled;

    const published: Invitation = { ...assembled.value, status: 'published' };
    await this.deps.invitations.save(published);
    return ok(published);
  }

  private async resolveUniqueSlug(base: Slug): Promise<Result<string, DomainError>> {
    if (!(await this.deps.invitations.existsBySlug(base.value))) {
      return ok(base.value);
    }
    for (let n = 2; n < MAX_SLUG_ATTEMPTS; n += 1) {
      const candidate = base.withSuffix(n);
      if (!candidate.ok) return candidate;
      if (!(await this.deps.invitations.existsBySlug(candidate.value.value))) {
        return ok(candidate.value.value);
      }
    }
    return err(new DomainError('SLUG_TAKEN', 'Slug band — boshqa ism tanlang.'));
  }
}
