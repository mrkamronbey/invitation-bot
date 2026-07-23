import type { TemplateMeta } from './types';
import { classicTemplate } from './classic';
import { modernTemplate } from './modern';
import { minimalTemplate } from './minimal';
import { floralTemplate } from './floral';
import { parallaxTemplate } from './parallax';
import { emeraldTemplate } from './emerald';

/**
 * Shablon registry (plagin — Open/Closed). Yangi shablon = shu yerga bitta yozuv,
 * mavjud kod o'zgarmaydi. Bot ham shu ro'yxatdan preview+tanlov quradi.
 */
export const templates: Record<string, TemplateMeta> = {
  classic: classicTemplate,
  modern: modernTemplate,
  minimal: minimalTemplate,
  floral: floralTemplate,
  parallax: parallaxTemplate,
  emerald: emeraldTemplate,
};

export function getTemplate(id: string): TemplateMeta {
  return templates[id] ?? classicTemplate;
}

export function allTemplates(): TemplateMeta[] {
  return Object.values(templates);
}
