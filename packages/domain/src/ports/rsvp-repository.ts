import type { Rsvp } from '../entities/rsvp';

/** RSVP javoblari ombori (port). */
export interface RsvpRepository {
  save(rsvp: Rsvp): Promise<void>;
  listByInvitation(invitationId: string): Promise<Rsvp[]>;
}
