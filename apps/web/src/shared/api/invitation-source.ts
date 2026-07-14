import 'server-only';
import type { Invitation } from '@invitation/domain';
import { GetInvitationBySlugUseCase } from '@invitation/application';
import { SupabaseInvitationRepository, createSupabaseClient } from '@invitation/infrastructure';
import { demoInvitation } from './demo';

interface SupabaseEnv {
  readonly url: string;
  readonly key: string;
}

function readSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/**
 * Slug bo'yicha taklifnomani oladi. Data qatlami — presentation biznes-mantiqni
 * bilmaydi, faqat shu funksiyani chaqiradi. Env sozlanmagan bo'lsa demo qaytadi.
 */
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  const env = readSupabaseEnv();
  if (!env) {
    return demoInvitation.slug === slug ? demoInvitation : null;
  }

  const repo = new SupabaseInvitationRepository(createSupabaseClient(env));
  const useCase = new GetInvitationBySlugUseCase({ invitations: repo });
  return useCase.execute(slug);
}
