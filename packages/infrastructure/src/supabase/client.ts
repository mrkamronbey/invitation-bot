import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  readonly url: string;
  readonly key: string;
}

export type { SupabaseClient };

/**
 * Supabase mijozini yaratadi. Bot service-role key bilan, web anon key bilan chaqiradi.
 * Server tomonda session saqlanmaydi.
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
