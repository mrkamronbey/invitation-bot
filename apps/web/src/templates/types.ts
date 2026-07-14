import type { ComponentType } from 'react';
import type { Invitation } from '@invitation/domain';

export interface TemplateProps {
  readonly invitation: Invitation;
}

export type TemplateComponent = ComponentType<TemplateProps>;

/** Shablon meta — bot preview va web render uchun umumiy kontrakt. */
export interface TemplateMeta {
  readonly id: string;
  readonly name: string;
  readonly previewImage: string;
  readonly component: TemplateComponent;
}
