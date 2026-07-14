-- Bot sessiyalari (grammY session + conversation holati) — restartga chidamlilik uchun.
create table if not exists public.bot_sessions (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Sessiyalar shaxsiy: faqat service-role (bot) kirishi mumkin.
alter table public.bot_sessions enable row level security;
