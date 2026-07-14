import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';
import { PersonName } from '../value-objects/person-name';
import { EventDate } from '../value-objects/event-date';
import { GeoPoint } from '../value-objects/geo-point';
import { Slug } from '../value-objects/slug';
import {
  type GeoLocation,
  type Invitation,
  type MusicSource,
  type TemplateId,
  type Venue,
  isTemplateId,
} from './invitation';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const cleanOptional = (raw: string | undefined): string | undefined => {
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export interface CreateInvitationInput {
  readonly id: string;
  readonly ownerId: string;
  readonly slug: string;
  readonly templateId: string;
  readonly groomName: string;
  readonly brideName: string;
  readonly eventDate: string;
  readonly eventTime?: string;
  readonly venueName?: string;
  readonly venueAddress?: string;
  readonly location?: { readonly lat: number; readonly lng: number };
  readonly story?: string;
  readonly dressCode?: string;
  readonly coverImageUrl?: string;
  readonly gallery?: readonly string[];
  readonly musicUrl?: string;
  readonly musicSource?: MusicSource;
  readonly locale?: string;
}

/**
 * createInvitation — kirish ma'lumotini value-object'lar bilan tekshirib,
 * yangi (draft) Invitation entity yig'adi. id/slug/ownerId use-case tomonidan beriladi.
 */
export function createInvitation(input: CreateInvitationInput): Result<Invitation, DomainError> {
  const groom = PersonName.create(input.groomName);
  if (!groom.ok) return groom;

  const bride = PersonName.create(input.brideName);
  if (!bride.ok) return bride;

  const date = EventDate.create(input.eventDate);
  if (!date.ok) return date;

  const slug = Slug.create(input.slug);
  if (!slug.ok) return slug;

  if (!isTemplateId(input.templateId)) {
    return err(new DomainError('INVALID_TEMPLATE', "Noma'lum shablon tanlangan."));
  }
  const templateId: TemplateId = input.templateId;

  const eventTime = cleanOptional(input.eventTime);
  if (eventTime !== undefined && !TIME_PATTERN.test(eventTime)) {
    return err(new DomainError('INVALID_TIME', "Vaqt HH:mm formatida bo'lishi kerak."));
  }

  let geo: GeoLocation | undefined;
  if (input.location) {
    const point = GeoPoint.create(input.location.lat, input.location.lng);
    if (!point.ok) return point;
    geo = { lat: point.value.lat, lng: point.value.lng };
  }

  const venueName = cleanOptional(input.venueName);
  const venueAddress = cleanOptional(input.venueAddress);
  const venue: Venue | undefined =
    venueName || venueAddress || geo ? { name: venueName, address: venueAddress, geo } : undefined;

  const musicSource: MusicSource = input.musicSource ?? 'none';

  const invitation: Invitation = {
    id: input.id,
    ownerId: input.ownerId,
    slug: slug.value.value,
    templateId,
    groomName: groom.value.value,
    brideName: bride.value.value,
    eventDate: date.value.iso,
    eventTime,
    venue,
    story: cleanOptional(input.story),
    dressCode: cleanOptional(input.dressCode),
    coverImageUrl: cleanOptional(input.coverImageUrl),
    gallery: input.gallery ?? [],
    musicUrl: musicSource === 'none' ? undefined : cleanOptional(input.musicUrl),
    musicSource,
    status: 'draft',
    isPremium: false,
    locale: cleanOptional(input.locale) ?? 'uz',
  };

  return ok(invitation);
}
