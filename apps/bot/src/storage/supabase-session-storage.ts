import type { StorageAdapter } from 'grammy';
import type { SupabaseClient } from '@invitation/infrastructure';

const TABLE = 'bot_sessions';

/**
 * grammY sessiyasini (jumladan davom etayotgan conversation holatini) Supabase'da saqlaydi.
 * Shu tufayli bot qayta ishga tushsa ham yarim to'ldirilgan taklifnoma va til yo'qolmaydi.
 */
export class SupabaseSessionStorage<T> implements StorageAdapter<T> {
  constructor(private readonly db: SupabaseClient) {}

  async read(key: string): Promise<T | undefined> {
    const { data, error } = await this.db.from(TABLE).select('value').eq('key', key).maybeSingle();
    if (error) throw error;
    return data ? (data.value as T) : undefined;
  }

  async write(key: string, value: T): Promise<void> {
    const { error } = await this.db
      .from(TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  }

  async delete(key: string): Promise<void> {
    const { error } = await this.db.from(TABLE).delete().eq('key', key);
    if (error) throw error;
  }
}
