import { CreateInvitationUseCase, ListOwnerInvitationsUseCase } from '@invitation/application';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
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
  const users = new SupabaseUserRepository(db);
  const storage = new SupabaseStorage(db);
  const ids = new CryptoIdGenerator();
  const clock = new SystemClock();

  return {
    env,
    users,
    storage,
    ids,
    createInvitation: new CreateInvitationUseCase({ invitations, ids, clock }),
    listOwnerInvitations: new ListOwnerInvitationsUseCase({ invitations }),
  };
}

export const container = buildContainer();
export type Container = ReturnType<typeof buildContainer>;
