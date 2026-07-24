-- To'yxona xarita havolasi (Yandex Maps va h.k.) — mehmonlarga aniq manzil.
alter table public.invitations
  add column if not exists venue_map_url text;
