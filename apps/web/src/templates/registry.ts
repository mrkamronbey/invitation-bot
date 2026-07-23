import type { TemplateMeta } from './types';
import { royalTemplate } from './royal';

/**
 * Shablon registry (plagin — Open/Closed). Yangi shablon = shu yerga bitta yozuv,
 * mavjud kod o'zgarmaydi. Bot ham shu ro'yxatdan preview+tanlov quradi.
 *
 * NB: hozircha faqat `royal` faol. Web platforma tayyor bo'lgach boshqa shablonlar
 * shu yerga qayta qo'shiladi (tizim ko'p-shablonli — o'zgarmaydi).
 */
export const templates: Record<string, TemplateMeta> = {
  royal: royalTemplate,
};

export function getTemplate(id: string): TemplateMeta {
  return templates[id] ?? royalTemplate;
}

export function allTemplates(): TemplateMeta[] {
  return Object.values(templates);
}
