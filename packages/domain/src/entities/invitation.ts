export type TemplateId = 'classic' | 'modern' | 'minimal' | 'floral' | 'parallax' | 'emerald';
export const TEMPLATE_IDS: readonly TemplateId[] = [
  'classic',
  'modern',
  'minimal',
  'floral',
  'parallax',
  'emerald',
];

export type InvitationStatus = 'draft' | 'published';
export type MusicSource = 'none' | 'default' | 'custom';

export interface GeoLocation {
  readonly lat: number;
  readonly lng: number;
}

export interface Venue {
  readonly name?: string;
  readonly address?: string;
  readonly geo?: GeoLocation;
}

/**
 * Invitation — validatsiyadan o'tgan taklifnoma holati (domain entity).
 * Ma'lumot primitiv ko'rinishda saqlanadi (DB va DTO'ga oson map bo'lishi uchun);
 * yaratishdagi invariantlar `createInvitation` factory'da value-object'lar bilan tekshiriladi.
 */
export interface Invitation {
  readonly id: string;
  readonly ownerId: string;
  readonly slug: string;
  readonly templateId: TemplateId;
  readonly groomName: string;
  readonly brideName: string;
  readonly eventDate: string; // YYYY-MM-DD
  readonly eventTime?: string; // HH:mm
  readonly venue?: Venue;
  readonly story?: string;
  readonly dressCode?: string;
  readonly coverImageUrl?: string;
  readonly gallery: readonly string[];
  readonly musicUrl?: string;
  readonly musicSource: MusicSource;
  readonly status: InvitationStatus;
  readonly isPremium: boolean;
  readonly locale: string;
}

export const isTemplateId = (value: string): value is TemplateId =>
  (TEMPLATE_IDS as readonly string[]).includes(value);
