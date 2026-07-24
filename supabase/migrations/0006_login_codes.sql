-- ─────────────────────────────────────────────────────────────────────────
-- 0006 — Bir martalik login kodlari (bot orqali saytga xavfsiz kirish)
--   Foydalanuvchi botda kod oladi, saytda kiritadi. Faqat service_role kiradi.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.login_codes (
  code        text primary key,
  user_id     uuid not null references public.users (id) on delete cascade,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists login_codes_user_idx on public.login_codes (user_id);

alter table public.login_codes enable row level security;
-- Policy yo'q — faqat service_role (bot/web server) kiradi.
