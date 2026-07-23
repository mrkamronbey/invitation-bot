import type {
  GiftInfo,
  Invitation,
  InvitationStatus,
  MusicSource,
  Parents,
  Rsvp,
  ScheduleItem,
  TemplateId,
  User,
  Venue,
} from '@invitation/domain';

// ── DB satrlari (snake_case) ──────────────────────────────────────────────

export interface InvitationRow {
  id: string;
  owner_id: string;
  slug: string;
  template_id: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  event_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  story: string | null;
  dress_code: string | null;
  parents: Parents | null;
  schedule: ScheduleItem[] | null;
  gift: GiftInfo | null;
  cover_image_url: string | null;
  gallery: string[] | null;
  music_url: string | null;
  music_source: string;
  status: string;
  is_premium: boolean;
  locale: string;
}

export interface RsvpRow {
  id: string;
  invitation_id: string;
  guest_name: string;
  attending: boolean;
  guests_count: number;
  message: string | null;
  created_at: string;
}

export interface UserRow {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  language_code: string;
}

// ── Row → Domain ──────────────────────────────────────────────────────────

export function rowToInvitation(row: InvitationRow): Invitation {
  const venue: Venue | undefined =
    row.venue_name || row.venue_address || row.location_lat !== null
      ? {
          name: row.venue_name ?? undefined,
          address: row.venue_address ?? undefined,
          geo:
            row.location_lat !== null && row.location_lng !== null
              ? { lat: row.location_lat, lng: row.location_lng }
              : undefined,
        }
      : undefined;

  return {
    id: row.id,
    ownerId: row.owner_id,
    slug: row.slug,
    templateId: row.template_id as TemplateId,
    groomName: row.groom_name,
    brideName: row.bride_name,
    eventDate: row.event_date,
    eventTime: row.event_time ?? undefined,
    venue,
    story: row.story ?? undefined,
    dressCode: row.dress_code ?? undefined,
    parents: row.parents ?? undefined,
    schedule: row.schedule ?? undefined,
    gift: row.gift ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    gallery: row.gallery ?? [],
    musicUrl: row.music_url ?? undefined,
    musicSource: row.music_source as MusicSource,
    status: row.status as InvitationStatus,
    isPremium: row.is_premium,
    locale: row.locale,
  };
}

export function rowToRsvp(row: RsvpRow): Rsvp {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    guestName: row.guest_name,
    attending: row.attending,
    guestsCount: row.guests_count,
    message: row.message ?? undefined,
    createdAt: row.created_at,
  };
}

export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    telegramId: row.telegram_id,
    username: row.username ?? undefined,
    firstName: row.first_name,
    lastName: row.last_name ?? undefined,
    phone: row.phone ?? undefined,
    languageCode: row.language_code,
  };
}

// ── Domain → Row (insert/upsert) ──────────────────────────────────────────

export function invitationToRow(inv: Invitation): InvitationRow {
  return {
    id: inv.id,
    owner_id: inv.ownerId,
    slug: inv.slug,
    template_id: inv.templateId,
    groom_name: inv.groomName,
    bride_name: inv.brideName,
    event_date: inv.eventDate,
    event_time: inv.eventTime ?? null,
    venue_name: inv.venue?.name ?? null,
    venue_address: inv.venue?.address ?? null,
    location_lat: inv.venue?.geo?.lat ?? null,
    location_lng: inv.venue?.geo?.lng ?? null,
    story: inv.story ?? null,
    dress_code: inv.dressCode ?? null,
    parents: inv.parents ?? null,
    schedule: inv.schedule ? [...inv.schedule] : null,
    gift: inv.gift ?? null,
    cover_image_url: inv.coverImageUrl ?? null,
    gallery: [...inv.gallery],
    music_url: inv.musicUrl ?? null,
    music_source: inv.musicSource,
    status: inv.status,
    is_premium: inv.isPremium,
    locale: inv.locale,
  };
}

export function rsvpToRow(rsvp: Rsvp): RsvpRow {
  return {
    id: rsvp.id,
    invitation_id: rsvp.invitationId,
    guest_name: rsvp.guestName,
    attending: rsvp.attending,
    guests_count: rsvp.guestsCount,
    message: rsvp.message ?? null,
    created_at: rsvp.createdAt,
  };
}

export function userToRow(user: User): UserRow {
  return {
    id: user.id,
    telegram_id: user.telegramId,
    username: user.username ?? null,
    first_name: user.firstName,
    last_name: user.lastName ?? null,
    phone: user.phone ?? null,
    language_code: user.languageCode,
  };
}
