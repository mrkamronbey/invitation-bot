export interface BotEnv {
  readonly botToken: string;
  readonly supabaseUrl: string;
  readonly supabaseServiceKey: string;
  readonly siteUrl: string;
}

/** Muhit o'zgaruvchilarini o'qiydi va tekshiradi (chegarada). */
export function loadEnv(): BotEnv {
  const botToken = process.env.BOT_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  if (!botToken) throw new Error('BOT_TOKEN muhit o‘zgaruvchisi kerak.');
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY kerak.');
  }

  return { botToken, supabaseUrl, supabaseServiceKey, siteUrl };
}
