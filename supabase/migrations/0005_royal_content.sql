-- ─────────────────────────────────────────────────────────────────────────
-- 0005 — Royal-only + 2-bosqich kontent
--   1) template_id CHECK constraint olib tashlanadi (kelajakda yangi shablon
--      qo'shishda migratsiya shart bo'lmaydi; validatsiya ilova darajasida).
--   2) Mavjud satrlar 'royal'ga o'tkaziladi; default ham 'royal'.
--   3) Yangi jsonb ustunlar: parents, schedule, gift (ixtiyoriy kontent).
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Eski template CHECK'ni olib tashlash
alter table public.invitations
  drop constraint if exists invitations_template_check;

-- 2) Default 'royal' + mavjudlarni 'royal'ga o'tkazish (faqat Royal faol)
alter table public.invitations
  alter column template_id set default 'royal';

update public.invitations
  set template_id = 'royal'
  where template_id is distinct from 'royal';

-- 3) 2-bosqich kontent ustunlari
alter table public.invitations
  add column if not exists parents  jsonb,
  add column if not exists schedule jsonb,
  add column if not exists gift     jsonb;
