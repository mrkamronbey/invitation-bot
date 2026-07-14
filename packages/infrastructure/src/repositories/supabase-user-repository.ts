import type { User, UserRepository } from '@invitation/domain';
import type { SupabaseClient } from '../supabase/client';
import { type UserRow, rowToUser, userToRow } from '../supabase/mappers';

const TABLE = 'users';

export class SupabaseUserRepository implements UserRepository {
  constructor(private readonly db: SupabaseClient) {}

  async findByTelegramId(telegramId: number): Promise<User | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('telegram_id', telegramId)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToUser(data as UserRow) : null;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.db.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToUser(data as UserRow) : null;
  }

  async upsert(user: User): Promise<void> {
    const { error } = await this.db
      .from(TABLE)
      .upsert(userToRow(user), { onConflict: 'telegram_id' });
    if (error) throw error;
  }
}
