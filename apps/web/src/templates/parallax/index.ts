import type { TemplateMeta } from '../types';
import { ParallaxTemplate } from './ParallaxTemplate';

export const parallaxTemplate: TemplateMeta = {
  id: 'parallax',
  name: 'Parallax ✨',
  previewImage:
    'https://czeuszszsdprclplmyee.supabase.co/storage/v1/object/public/invitations/templates/parallax-preview.jpg',
  component: ParallaxTemplate,
};
