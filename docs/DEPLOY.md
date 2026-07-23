# Deploy & QA — taklif platformasi

Web → **Vercel**, Bot → **Railway**, DB → **Supabase**. Kod monorepo (pnpm + turbo).

---

## 1. Supabase (DB)

- Loyiha: `taklif-invitation` (ref `czeuszszsdprclplmyee`).
- Migratsiyalar `supabase/migrations/` da. Oxirgi: `0005_royal_content.sql`
  (allaqachon qo'llangan — template CHECK olib tashlangan, `parents/schedule/gift`
  jsonb qo'shilgan).
- Yangi migratsiya bo'lsa: Supabase CLI (`supabase db push`) yoki dashboard SQL editor.

## 2. Web (Vercel)

**Root:** monorepo. Vercel loyiha sozlamasi:
- Framework: **Next.js**
- Root Directory: `apps/web` (yoki turbo bilan root — `apps/web` tavsiya)
- Build: `next build` (Vercel avtomatik)

**Environment Variables (Vercel → Settings → Environment Variables):**

| O'zgaruvchi | Izoh |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | To'liq domen, masalan `https://taklif.uz` (oxirida `/` yo'q) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Bot username (`@` siz), masalan `taklif_bot` |
| `SUPABASE_URL` | Supabase project URL (server) |
| `SUPABASE_SERVICE_ROLE_KEY` | **SIR** — server-only (auth + dashboard + editor yozadi) |
| `SESSION_SECRET` | Kamida 16 belgi tasodifiy (JWT imzo) |
| `TELEGRAM_BOT_TOKEN` | Web login imzosini tekshirish (BOT_TOKEN bilan bir xil) |

## 3. Bot (Railway)

**Environment Variables:**

| O'zgaruvchi | Izoh |
|---|---|
| `BOT_TOKEN` | Telegram bot tokeni |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **SIR** — bot service-role bilan yozadi |
| `NEXT_PUBLIC_SITE_URL` | Havolalar uchun (masalan `https://taklif.uz`) — bot `/i/<slug>` yasaydi |
| `WELCOME_BANNER_URL` | (ixtiyoriy) salomlashuv banneri |
| `DEMO_INVITATION_URL` | (ixtiyoriy) default: `${SITE_URL}/i/aziz-va-malika` |

## 4. BotFather — Login Widget domeni (MUHIM)

Web login (Telegram Login Widget) ishlashi uchun bot domeni sozlanishi shart:

1. Telegram'da **@BotFather** → `/setdomain`
2. Botni tanlang → domenni yozing (masalan `taklif.uz` yoki Vercel domeni)

Bu qilinmasa, `/login` sahifasidagi tugma ishlamaydi.

---

## 5. QA checklist (deploydan keyin)

- [ ] `/` (landing) ochiladi, "Namunani ko'rish" → `/i/aziz-va-malika` to'liq ko'rinadi
- [ ] `/i/aziz-va-malika` — konvert ochilishi, Royal hero, ota-onalar/kun-tartibi/sovg'a
- [ ] `/login` — Telegram tugmasi chiqadi (username + domen sozlangan bo'lsa)
- [ ] Telegram orqali kirish → `/dashboard`ga o'tadi
- [ ] `/dashboard` — bot orqali yaratilgan taklifnomalar ro'yxatda ko'rinadi
- [ ] Dashboard → "Yangi taklifnoma" → forma → saqlash → ro'yxatda paydo bo'ladi
- [ ] Yaratilgan taklifnoma linki **unique** (`ism-ism-<kod>`), boshqa userniki ko'rinmaydi
- [ ] Tahrir → o'zgartirish → saqlash → taklifnomada aks etadi
- [ ] O'chirish → tasdiq → ro'yxatdan yo'qoladi
- [ ] Bot: `/start` → "Yaratish" → shablon ekrani (Royal + "Davom etish") → yaratish → link
- [ ] RSVP: mehmon `/i/<slug>`da javob beradi → dashboard statistikasida ko'rinadi

## 6. Xavfsizlik eslatmalari

- `SUPABASE_SERVICE_ROLE_KEY` va `SESSION_SECRET` — **hech qachon** clientga/repoga chiqmasin.
- RLS yoqilgan; yozish faqat server (service-role) orqali, egalik use-case ichida tekshiriladi.
- Sessiya — httpOnly JWT (30 kun), middleware `/dashboard/*` ni himoya qiladi.
