import { CreateInvitationUseCase } from '@invitation/application';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
  SupabaseUserRepository,
  SystemClock,
  createSupabaseClient,
} from '@invitation/infrastructure';

const DEMO_SLUG = 'aziz-va-malika';

async function main(): Promise<void> {
  const db = createSupabaseClient({
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  });
  const invitations = new SupabaseInvitationRepository(db);
  const users = new SupabaseUserRepository(db);
  const ids = new CryptoIdGenerator();

  // Eski demoni tozalaymiz (slug qayta ishlatilsin).
  const existing = await invitations.findBySlug(DEMO_SLUG);
  if (existing) await invitations.delete(existing.id);

  // Demo egasi
  const ownerId = ids.generate();
  await users.upsert({
    id: ownerId,
    telegramId: 100000001,
    username: 'demo',
    firstName: 'Demo',
    languageCode: 'uz',
  });

  const create = new CreateInvitationUseCase({ invitations, ids, clock: new SystemClock() });
  const res = await create.execute({
    ownerId,
    templateId: 'classic',
    groomName: 'Aziz',
    brideName: 'Malika',
    eventDate: '2026-10-10',
    eventTime: '17:00',
    venueName: 'Bahor To‘yxonasi',
    location: { lat: 41.311081, lng: 69.240562 },
    story: 'Ikki yurak bir bo‘lgan kun — bizni shu quvonchli damda ko‘rish biz uchun baxt.',
    dressCode: 'Klassik / rasmiy',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80',
    musicSource: 'none',
  });

  if (!res.ok) throw new Error(res.error.message);
  console.log('DEMO READY slug=', res.value.slug);
}

main().catch((e) => {
  console.error('SEED FAILED', e);
  process.exit(1);
});
