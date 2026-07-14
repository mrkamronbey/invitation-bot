import type { TemplateIdDto } from './schemas/invitation';

/** Framework-agnostik shablon meta — bot tanlov klaviaturasi va web registry uchun umumiy. */
export interface TemplateCatalogItem {
  readonly id: TemplateIdDto;
  readonly name: string;
}

/**
 * Mavjud shablonlar. MVP'da faqat `classic` tayyor;
 * yangi shablon web'da qurilganda shu yerga qo'shiladi (Open/Closed).
 */
export const TEMPLATE_CATALOG: readonly TemplateCatalogItem[] = [
  { id: 'classic', name: 'Klassik' },
];
