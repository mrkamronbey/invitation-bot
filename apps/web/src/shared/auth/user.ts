import 'server-only';
import type { User } from '@invitation/domain';
import {
  CryptoIdGenerator,
  SupabaseUserRepository,
  createSupabaseClient,
} from '@invitation/infrastructure';
import type { TelegramLoginData } from './telegram';

/** Service-role Supabase (server-only) — users jadvaliga yozish uchun (RLS chetlab). */
function adminUserRepo(): SupabaseUserRepository {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY sozlanmagan (web auth).');
  }
  return new SupabaseUserRepository(createSupabaseClient({ url, key }));
}

/**
 * Telegram login ma'lumotidan foydalanuvchini topadi yoki yaratadi (bot bilan
 * bir xil `users` jadvali — telegram_id orqali bog'lanadi).
 */
export async function ensureWebUser(tg: TelegramLoginData): Promise<User> {
  const repo = adminUserRepo();
  const existing = await repo.findByTelegramId(tg.id);

  if (existing) {
    const fresh: User = {
      ...existing,
      username: tg.username ?? existing.username,
      firstName: tg.first_name || existing.firstName,
      lastName: tg.last_name ?? existing.lastName,
    };
    if (
      fresh.username !== existing.username ||
      fresh.firstName !== existing.firstName ||
      fresh.lastName !== existing.lastName
    ) {
      await repo.upsert(fresh);
    }
    return fresh;
  }

  const user: User = {
    id: new CryptoIdGenerator().generate(),
    telegramId: tg.id,
    username: tg.username,
    firstName: tg.first_name || 'Foydalanuvchi',
    lastName: tg.last_name,
    languageCode: 'uz',
  };
  await repo.upsert(user);
  return user;
}
