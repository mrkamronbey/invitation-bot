import 'server-only';
import { ListWishesUseCase, type WishItem } from '@invitation/application';
import {
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  createSupabaseClient,
} from '@invitation/infrastructure';

function readSupabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** Slug bo'yicha mehmon tilaklarini oladi (tilaklar devori uchun). */
export async function getWishes(slug: string): Promise<WishItem[]> {
  const env = readSupabaseEnv();
  if (!env) return [];

  const db = createSupabaseClient(env);
  const useCase = new ListWishesUseCase({
    invitations: new SupabaseInvitationRepository(db),
    rsvps: new SupabaseRsvpRepository(db),
  });
  return useCase.execute(slug);
}
