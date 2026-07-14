import { z } from 'zod';

export const templateIdSchema = z.enum(['classic', 'modern', 'minimal', 'floral']);
export const musicSourceSchema = z.enum(['none', 'default', 'custom']);

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Bot yig'adigan taklifnoma ma'lumoti (chegarada validatsiya). */
export const createInvitationSchema = z.object({
  ownerId: z.string().uuid(),
  templateId: templateIdSchema,
  groomName: z.string().trim().min(1).max(40),
  brideName: z.string().trim().min(1).max(40),
  eventDate: z.string().regex(DATE_RE, "Sana YYYY-MM-DD formatida bo'lsin"),
  eventTime: z.string().regex(TIME_RE, "Vaqt HH:mm formatida bo'lsin").optional(),
  venueName: z.string().trim().max(120).optional(),
  venueAddress: z.string().trim().max(200).optional(),
  location: locationSchema.optional(),
  story: z.string().trim().max(1000).optional(),
  dressCode: z.string().trim().max(100).optional(),
  coverImageUrl: z.string().url().optional(),
  gallery: z.array(z.string().url()).max(20).optional(),
  musicUrl: z.string().url().optional(),
  musicSource: musicSourceSchema.optional(),
  locale: z.string().min(2).max(5).optional(),
});

export type TemplateIdDto = z.infer<typeof templateIdSchema>;
export type MusicSourceDto = z.infer<typeof musicSourceSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
