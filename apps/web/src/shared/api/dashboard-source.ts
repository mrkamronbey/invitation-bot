import 'server-only';
import type { Invitation } from '@invitation/domain';
import {
  CreateInvitationUseCase,
  DeleteInvitationUseCase,
  GetInvitationStatsUseCase,
  type InvitationStats,
  ListOwnerInvitationsUseCase,
  UpdateInvitationUseCase,
} from '@invitation/application';
import { TEMPLATE_CATALOG, createInvitationSchema, updateInvitationSchema } from '@invitation/contracts';
import {
  CryptoIdGenerator,
  SupabaseInvitationRepository,
  SupabaseRsvpRepository,
  SystemClock,
  createSupabaseClient,
} from '@invitation/infrastructure';
import type { EditorInput, EditorResult } from './editor-types';

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

/** Bitta taklifnoma (egalik tekshiriladi) — tahrirlash formasi uchun. */
export async function getMyInvitation(
  invitationId: string,
  ownerId: string,
): Promise<Invitation | null> {
  const inv = await repos().invitations.findById(invitationId);
  return inv && inv.ownerId === ownerId ? inv : null;
}

const s = (v: string | undefined): string | undefined => {
  const t = (v ?? '').trim();
  return t.length > 0 ? t : undefined;
};

/** EditorInput'ni contracts kirishiga tozalab o'giradi (bo'sh qiymatlar olib tashlanadi). */
function toPayload(input: EditorInput): Record<string, unknown> {
  const parentSide = (p?: { father?: string; mother?: string }) => {
    const father = s(p?.father);
    const mother = s(p?.mother);
    return father || mother ? { father, mother } : undefined;
  };
  const groom = parentSide(input.parents?.groom);
  const bride = parentSide(input.parents?.bride);
  const parents = groom || bride ? { groom, bride } : undefined;
  const schedule = (input.schedule ?? [])
    .map((r) => ({ time: (r.time ?? '').trim(), title: (r.title ?? '').trim() }))
    .filter((r) => r.time.length > 0 || r.title.length > 0);
  const gift =
    s(input.gift?.cardNumber) || s(input.gift?.cardHolder) || s(input.gift?.note)
      ? { cardNumber: s(input.gift?.cardNumber), cardHolder: s(input.gift?.cardHolder), note: s(input.gift?.note) }
      : undefined;
  const gallery = (input.gallery ?? []).map((g) => g.trim()).filter(Boolean);

  return {
    templateId: s(input.templateId),
    groomName: input.groomName?.trim(),
    brideName: input.brideName?.trim(),
    eventDate: input.eventDate,
    eventTime: s(input.eventTime),
    venueName: s(input.venueName),
    venueAddress: s(input.venueAddress),
    venueMapUrl: s(input.venueMapUrl),
    story: s(input.story),
    dressCode: s(input.dressCode),
    parents,
    schedule: schedule.length > 0 ? schedule : undefined,
    gift,
    gallery: gallery.length > 0 ? gallery : undefined,
    locale: s(input.locale) ?? 'uz',
  };
}

/** Yangi taklifnoma yaratadi (validatsiya + use-case). */
export async function createInvitationForOwner(
  ownerId: string,
  input: EditorInput,
): Promise<EditorResult> {
  const payload = toPayload(input);
  const parsed = createInvitationSchema.safeParse({
    ...payload,
    ownerId,
    // Tanlanmagan bo'lsa — katalogdagi birinchi (standart) shablon.
    templateId: payload.templateId ?? TEMPLATE_CATALOG[0]?.id,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ma'lumot noto'g'ri." };
  }
  const useCase = new CreateInvitationUseCase({
    invitations: repos().invitations,
    ids: new CryptoIdGenerator(),
    clock: new SystemClock(),
  });
  const res = await useCase.execute(parsed.data);
  return res.ok ? { ok: true, slug: res.value.slug } : { ok: false, error: res.error.message };
}

/** Mavjud taklifnomani tahrirlaydi (validatsiya + use-case). */
export async function updateInvitationForOwner(
  invitationId: string,
  ownerId: string,
  input: EditorInput,
): Promise<EditorResult> {
  const payload = toPayload(input);
  // update patch coverImageUrl/gallery'ni o'zgartirmaydi (use-case gallery'ni saqlaydi)
  const parsed = updateInvitationSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ma'lumot noto'g'ri." };
  }
  const useCase = new UpdateInvitationUseCase({
    invitations: repos().invitations,
    clock: new SystemClock(),
  });
  const res = await useCase.execute({ invitationId, ownerId, patch: parsed.data });
  return res.ok ? { ok: true, slug: res.value.slug } : { ok: false, error: res.error.message };
}
