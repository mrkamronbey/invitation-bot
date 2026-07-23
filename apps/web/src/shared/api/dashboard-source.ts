import 'server-only';
import type { Invitation } from '@invitation/domain';
import {
  DeleteInvitationUseCase,
  GetInvitationStatsUseCase,
  type InvitationStats,
  ListOwnerInvitationsUseCase,
} from '@invitation/application';
import {
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  createSupabaseClient,
} from '@invitation/infrastructure';

interface Repos {
  readonly invitations: SupabaseInvitationRepository;
  readonly rsvps: SupabaseRsvpRepository;
}

/** Service-role repos (server-only) — RLS chetlab, egalik use-case ichida tekshiriladi. */
function repos(): Repos {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY sozlanmagan (dashboard).');
  }
  const db = createSupabaseClient({ url, key });
  return {
    invitations: new SupabaseInvitationRepository(db),
    rsvps: new SupabaseRsvpRepository(db),
  };
}

/** Foydalanuvchining barcha taklifnomalari. */
export async function listMyInvitations(ownerId: string): Promise<Invitation[]> {
  const useCase = new ListOwnerInvitationsUseCase({ invitations: repos().invitations });
  return useCase.execute(ownerId);
}

/** Bitta taklifnoma statistikasi (egalik tekshiriladi). */
export async function getMyStats(
  invitationId: string,
  ownerId: string,
): Promise<InvitationStats | null> {
  const r = repos();
  const useCase = new GetInvitationStatsUseCase({ invitations: r.invitations, rsvps: r.rsvps });
  const res = await useCase.execute(invitationId, ownerId);
  return res.ok ? res.value : null;
}

/** Taklifnomani o'chiradi (egalik tekshiriladi). */
export async function deleteMyInvitation(
  invitationId: string,
  ownerId: string,
): Promise<boolean> {
  const useCase = new DeleteInvitationUseCase({ invitations: repos().invitations });
  const res = await useCase.execute({ invitationId, ownerId });
  return res.ok;
}
