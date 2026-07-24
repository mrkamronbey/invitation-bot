// Hozircha faqat 'royal' faol. Yangi shablon qo'shishda shu union'ga va
// TEMPLATE_IDS'ga bitta id qo'shiladi (tizim ko'p-shablonli qoladi).
export type TemplateId = 'royal';
export const TEMPLATE_IDS: readonly TemplateId[] = ['royal'];

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
  /** Yandex Maps (yoki boshqa) xarita havolasi — aniq manzil uchun. */
  readonly mapUrl?: string;
}

/** Bir tomon ota-onasi (kuyov yoki kelin). */
export interface ParentNames {
  readonly father?: string;
  readonly mother?: string;
}

/** Ikki tomon ota-onalari (marosim bo'limida ko'rsatiladi). */
export interface Parents {
  readonly groom?: ParentNames;
  readonly bride?: ParentNames;
}

/** Kun tartibidagi bitta band. */
export interface ScheduleItem {
  readonly time: string; // "16:30" yoki erkin matn
  readonly title: string;
}

/** Sovg'a (karta) ma'lumoti. */
export interface GiftInfo {
  readonly cardNumber?: string;
  readonly cardHolder?: string;
  readonly note?: string;
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
  readonly parents?: Parents;
  readonly schedule?: readonly ScheduleItem[];
  readonly gift?: GiftInfo;
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
