import type { Invitation, InvitationRepository } from '@invitation/domain';
import type { SupabaseClient } from '../supabase/client';
import { type InvitationRow, invitationToRow, rowToInvitation } from '../supabase/mappers';

const TABLE = 'invitations';

export class SupabaseInvitationRepository implements InvitationRepository {
  constructor(private readonly db: SupabaseClient) {}

  async findById(id: string): Promise<Invitation | null> {
    const { data, error } = await this.db.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToInvitation(data as InvitationRow) : null;
  }

  async findBySlug(slug: string): Promise<Invitation | null> {
    const { data, error } = await this.db.from(TABLE).select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data ? rowToInvitation(data as InvitationRow) : null;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const { data, error } = await this.db.from(TABLE).select('id').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data !== null;
  }

  async listByOwner(ownerId: string): Promise<Invitation[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as InvitationRow[]).map(rowToInvitation);
  }

  async save(invitation: Invitation): Promise<void> {
    const { error } = await this.db.from(TABLE).upsert(invitationToRow(invitation));
    if (error) throw error;
  }

  async setPremium(id: string, isPremium: boolean): Promise<void> {
    const { error } = await this.db.from(TABLE).update({ is_premium: isPremium }).eq('id', id);
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from(TABLE).delete().eq('id', id);
    if (error) throw error;
  }
}
