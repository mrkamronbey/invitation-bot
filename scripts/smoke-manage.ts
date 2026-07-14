import {
  CreateInvitationUseCase,
  DeleteInvitationUseCase,
  GetInvitationStatsUseCase,
  UpdateInvitationUseCase,
} from '@invitation/application';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  SupabaseUserRepository,
  SystemClock,
  createSupabaseClient,
} from '@invitation/infrastructure';

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const db = createSupabaseClient({ url, key });

  const invitations = new SupabaseInvitationRepository(db);
  const rsvps = new SupabaseRsvpRepository(db);
  const users = new SupabaseUserRepository(db);
  const ids = new CryptoIdGenerator();
  const clock = new SystemClock();

  const create = new CreateInvitationUseCase({ invitations, ids, clock });
  const update = new UpdateInvitationUseCase({ invitations, clock });
  const del = new DeleteInvitationUseCase({ invitations });
  const stats = new GetInvitationStatsUseCase({ invitations, rsvps });

  // Test uchun foydalanuvchi
  const ownerId = ids.generate();
  await users.upsert({
    id: ownerId,
    telegramId: Math.floor(Math.random() * 1e9),
    username: 'smoke',
    firstName: 'Smoke',
    languageCode: 'uz',
  });

  const created = await create.execute({
    ownerId,
    templateId: 'classic',
    groomName: 'SmokeGroom',
    brideName: 'SmokeBride',
    eventDate: '2027-01-01',
    musicSource: 'none',
  });
  if (!created.ok) throw new Error(`create failed: ${created.error.message}`);
  const id = created.value.id;
  console.log('✓ create', id, created.value.slug);

  const byId = await invitations.findById(id);
  console.log('✓ findById', byId?.groomName, byId?.eventDate);

  const upd = await update.execute({
    invitationId: id,
    ownerId,
    patch: { eventTime: '18:30', venueName: 'SmokeHall', groomName: 'SmokeGroom2' },
  });
  if (!upd.ok) throw new Error(`update failed: ${upd.error.message}`);
  console.log(
    '✓ update',
    upd.value.groomName,
    upd.value.eventTime,
    upd.value.venue?.name,
    'slug=',
    upd.value.slug,
  );

  // Egalik tekshiruvi — boshqa owner tahrirlay olmasligi kerak
  const wrong = await update.execute({
    invitationId: id,
    ownerId: ids.generate(),
    patch: { venueName: 'HACK' },
  });
  console.log('✓ ownership guard (update):', wrong.ok ? 'FAIL (allowed!)' : 'OK (blocked)');

  const st = await stats.execute(id, ownerId);
  if (!st.ok) throw new Error(`stats failed: ${st.error.message}`);
  console.log(
    '✓ stats',
    JSON.stringify({ responses: st.value.responses, guests: st.value.totalGuests }),
  );

  const deleted = await del.execute({ invitationId: id, ownerId });
  console.log('✓ delete', deleted.ok);

  const gone = await invitations.findById(id);
  console.log('✓ gone after delete:', gone === null ? 'OK' : 'FAIL (still exists)');

  // Tozalash: test user
  console.log('done');
}

main().catch((e) => {
  console.error('SMOKE FAILED:', e);
  process.exit(1);
});
