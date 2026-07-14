-- Foydalanuvchi profilini kengaytirish: familiya (Telegramdan avto) va telefon (ixtiyoriy).
alter table public.users add column if not exists last_name text;
alter table public.users add column if not exists phone text;
