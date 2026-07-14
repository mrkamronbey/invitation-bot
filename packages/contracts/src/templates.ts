import type { TemplateIdDto } from './schemas/invitation';

/** Framework-agnostik shablon meta — bot tanlov klaviaturasi va web registry uchun umumiy. */
export interface TemplateCatalogItem {
  readonly id: TemplateIdDto;
  readonly name: string;
  /** Ommaviy preview rasm URL (bot shablon tanlashda ko'rsatadi). */
  readonly previewImage: string;
}

/**
 * Mavjud shablonlar. Yangi shablon web'da qurilganda shu yerga qo'shiladi (Open/Closed).
 */
export const TEMPLATE_CATALOG: readonly TemplateCatalogItem[] = [
  {
    id: 'classic',
    name: 'Klassik',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75',
  },
  {
    id: 'modern',
    name: 'Zamonaviy',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=75',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=75',
  },
  {
    id: 'floral',
    name: 'Gulli ramka',
    previewImage:
      'https://czeuszszsdprclplmyee.supabase.co/storage/v1/object/public/invitations/templates/frame-floral.png',
  },
];
