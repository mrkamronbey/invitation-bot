import type { TemplateMeta } from './types';
import { royalTemplate } from './royal';
import { milliyTemplate } from './milliy';

/**
 * Shablon registry (plagin — Open/Closed). Yangi shablon = shu yerga bitta yozuv,
 * mavjud kod o'zgarmaydi. Bot ham shu ro'yxatdan preview+tanlov quradi.
 */
export const templates: Record<string, TemplateMeta> = {
  milliy: milliyTemplate,
  royal: royalTemplate,
};

/** Yangi taklifnomalar uchun standart shablon. */
export const DEFAULT_TEMPLATE_ID = 'milliy';

export function getTemplate(id: string): TemplateMeta {
  return templates[id] ?? templates[DEFAULT_TEMPLATE_ID] ?? royalTemplate;
}

export function allTemplates(): TemplateMeta[] {
  return Object.values(templates);
}
