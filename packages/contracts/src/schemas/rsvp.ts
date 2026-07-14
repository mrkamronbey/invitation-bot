import { z } from 'zod';

/** Web RSVP forma kirishi. */
export const rsvpInputSchema = z.object({
  slug: z.string().trim().min(1),
  guestName: z.string().trim().min(1).max(60),
  attending: z.boolean(),
  guestsCount: z.number().int().min(1).max(20).default(1),
  message: z.string().trim().max(300).optional(),
});

export type RsvpInput = z.infer<typeof rsvpInputSchema>;
