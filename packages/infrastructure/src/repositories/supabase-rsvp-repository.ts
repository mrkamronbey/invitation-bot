import type { Rsvp, RsvpRepository } from '@invitation/domain';
import type { SupabaseClient } from '../supabase/client';
import { type RsvpRow, rowToRsvp, rsvpToRow } from '../supabase/mappers';

const TABLE = 'rsvps';

export class SupabaseRsvpRepository implements RsvpRepository {
  constructor(private readonly db: SupabaseClient) {}

  async save(rsvp: Rsvp): Promise<void> {
    const { error } = await this.db.from(TABLE).insert(rsvpToRow(rsvp));
    if (error) throw error;
  }

  async listByInvitation(invitationId: string): Promise<Rsvp[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as RsvpRow[]).map(rowToRsvp);
  }
}
