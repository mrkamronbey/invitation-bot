import {
  CreateInvitationUseCase,
  DeleteInvitationUseCase,
  GetInvitationStatsUseCase,
  ListOwnerInvitationsUseCase,
  UpdateInvitationUseCase,
} from '@invitation/application';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
  SupabaseLoginCodeRepository,
  SupabaseRsvpRepository,
  SupabaseStorage,
  SupabaseUserRepository,
  SystemClock,
  createSupabaseClient,
} from '@invitation/infrastructure';
import { loadEnv } from './config/env';

/**
 * Composition root — infrastructure adapterlarini portlarga ulab, use-case'larni quradi.
 * Bot (presentation) faqat shu container orqali biznes-mantiqqa murojaat qiladi.
 */
function buildContainer() {
  const env = loadEnv();
  const db = createSupabaseClient({ url: env.supabaseUrl, key: env.supabaseServiceKey });

  const invitations = new SupabaseInvitationRepository(db);
  const rsvps = new SupabaseRsvpRepository(db);
  const users = new SupabaseUserRepository(db);
  const loginCodes = new SupabaseLoginCodeRepository(db);
  const storage = new SupabaseStorage(db);
  const ids = new CryptoIdGenerator();
  const clock = new SystemClock();

  return {
    env,
    db,
    users,
    loginCodes,
    storage,
    ids,
    createInvitation: new CreateInvitationUseCase({ invitations, ids, clock }),
    listOwnerInvitations: new ListOwnerInvitationsUseCase({ invitations }),
    updateInvitation: new UpdateInvitationUseCase({ invitations, clock }),
    deleteInvitation: new DeleteInvitationUseCase({ invitations }),
    getInvitationStats: new GetInvitationStatsUseCase({ invitations, rsvps }),
  };
}

export const container = buildContainer();
export type Container = ReturnType<typeof buildContainer>;
