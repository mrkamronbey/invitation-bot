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
    id: 'chateau',
    name: 'Chateau 🌿',
    previewImage: '/images/chateau/chateau.webp',
  },
  {
    id: 'royal',
    name: 'Royal 🤍',
    previewImage: '/images/royal/preview.png',
  },
];
