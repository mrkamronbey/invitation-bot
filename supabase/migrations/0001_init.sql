-- ─────────────────────────────────────────────────────────────────────────
-- Elektron to'y taklifnoma platformasi — boshlang'ich sxema
-- Jadvallar: users, invitations, rsvps + indekslar + RLS
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── users: bot foydalanuvchilari (kuyov-kelin / egalar) ───────────────────
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  telegram_id   bigint not null unique,
  username      text,
  first_name    text not null,
  language_code text not null default 'uz',
  created_at    timestamptz not null default now()
);

-- ── invitations: taklifnomalar ────────────────────────────────────────────
create table if not exists public.invitations (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.users (id) on delete cascade,
  slug            text not null unique,
  template_id     text not null default 'classic',
  groom_name      text not null,
  bride_name      text not null,
  event_date      date not null,
  event_time      time,
  venue_name      text,
  venue_address   text,
  location_lat    numeric,
  location_lng    numeric,
  story           text,
  dress_code      text,
  cover_image_url text,
  gallery         jsonb not null default '[]'::jsonb,
  music_url       text,
  music_source    text not null default 'none',
  status          text not null default 'draft',
  is_premium      boolean not null default false,
  locale          text not null default 'uz',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint invitations_status_check check (status in ('draft', 'published')),
  constraint invitations_music_source_check check (music_source in ('none', 'default', 'custom')),
  constraint invitations_template_check check (template_id in ('classic', 'modern', 'minimal', 'floral'))
);

create index if not exists invitations_owner_id_idx on public.invitations (owner_id);
create index if not exists invitations_status_idx on public.invitations (status);

-- ── rsvps: mehmon javoblari ───────────────────────────────────────────────
create table if not exists public.rsvps (
  id             uuid primary key default gen_random_uuid(),
  invitation_id  uuid not null references public.invitations (id) on delete cascade,
  guest_name     text not null,
  attending      boolean not null,
  guests_count   integer not null default 1,
  message        text,
  created_at     timestamptz not null default now(),
  constraint rsvps_guests_count_check check (guests_count >= 0 and guests_count <= 20)
);

create index if not exists rsvps_invitation_id_idx on public.rsvps (invitation_id);

-- ── updated_at avtomatik yangilanishi ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists invitations_set_updated_at on public.invitations;
create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
--   - Yozish/tahrirlash faqat service_role (bot) orqali (RLS'ni chetlab o'tadi).
--   - Anon: faqat published taklifnomani O'QIY oladi; rsvps'ga INSERT qila oladi.
-- ─────────────────────────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

-- Published taklifnomani hamma o'qiy oladi (web sahifa uchun)
drop policy if exists "public read published invitations" on public.invitations;
create policy "public read published invitations"
  on public.invitations for select
  to anon, authenticated
  using (status = 'published');

-- Mehmon RSVP qo'sha oladi (faqat published taklifnomaga)
drop policy if exists "anon can insert rsvp" on public.rsvps;
create policy "anon can insert rsvp"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.status = 'published'
    )
  );

-- Eslatma: users jadvaliga va invitations/rsvps ni o'qish/yozishga anon uchun
-- boshqa policy yo'q — demak bot (service_role) dan tashqari hech kim ko'ra olmaydi.
