import { randomInt } from 'node:crypto';
import type { SupabaseClient } from '../supabase/client';

const TABLE = 'login_codes';
const TTL_SECONDS = 300; // 5 daqiqa

interface LoginCodeRow {
  code: string;
  user_id: string;
  expires_at: string;
  used: boolean;
}

/**
 * Bir martalik login kodlari — bot kod beradi, web uni tekshiradi.
 * Faqat service-role client bilan ishlaydi (RLS yopiq).
 */
export class SupabaseLoginCodeRepository {
  constructor(private readonly db: SupabaseClient) {}

  /** Foydalanuvchi uchun 6 xonali kod yaratadi va saqlaydi (5 daqiqa amal qiladi). */
  async issue(userId: string): Promise<string> {
    const code = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString();
    const { error } = await this.db
      .from(TABLE)
      .upsert({ code, user_id: userId, expires_at: expiresAt, used: false });
    if (error) throw error;
    return code;
  }

  /** Kodni tekshiradi: to'g'ri, ishlatilmagan va muddati o'tmagan bo'lsa user_id qaytaradi. */
  async consume(code: string): Promise<string | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .maybeSingle();
    if (error) throw error;
    const row = data as LoginCodeRow | null;
    if (!row) return null;
    if (new Date(row.expires_at).getTime() < Date.now()) return null;
    await this.db.from(TABLE).update({ used: true }).eq('code', code);
    return row.user_id;
  }
}
