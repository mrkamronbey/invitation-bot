# Rebuild Plan — Web platforma + bot (Royal only)

> Holat: **REJA (tasdiqlash kutilmoqda)**. Kod hali o'zgartirilmadi.
> Sana: 2026-07-23. Muallif: platforma rejasi.

Bu hujjat foydalanuvchi g'oyasini bosqichma-bosqich amalga oshirish rejasi.
Har bir bosqich alohida commit; oldingi bosqich yashil (build/typecheck/lint o'tadi)
bo'lmasa keyingisiga o'tilmaydi.

---

## 1. Maqsad (g'oya bo'yicha)

1. **Kodni tozalash** — o'lik kod, ishlatilmagan shablon/komponent/rasm o'chiriladi.
2. **3–4 sahifalik web-sayt** — Next.js + TypeScript + Tailwind + (kerak bo'lsa) shadcn/ui.
3. Taklifnomani **ham saytdan, ham botdan** yaratish mumkin bo'lsin.
4. Foydalanuvchi **bot orqali ro'yxatdan o'tadi**, keyin saytga kirib o'z
   taklifnomalarini yaratadi; ular **dashboard**da saqlanadi; **eskisini tahrirlash**
   mumkin.
5. Yaratgandan so'ng **natija sahifasi**da **preview + taklifnoma linki** beriladi.
   Link **unique** — birov boshqasining taklifnomasini ko'rib qolmasin.
6. **Shablonlardan faqat oxirgi (Royal)** qoladi, qolganlari o'chiriladi.
7. Frontend qismini **qaytadan** (Next.js, TS, Tailwind, shadcn/ui) quramiz.

---

## 2. Hozirgi holat (audit xulosasi)

Yaxshi tomoni — **arxitektura toza (hexagonal)** va bot/web umumiy yadrodan foydalanadi.
Bu bizga qo'l keladi: yaratish/tahrirlash logikasi bitta joyda.

```
packages/
  domain/          # entity, value-object, port (interfeys) — sof biznes
  application/     # use-case: create/update/list/get/stats/delete/rsvp/wishes
  contracts/       # Zod sxemalar (CreateInvitationInput, ...)
  infrastructure/  # Supabase repos, Telegram notifier, storage
  i18n/            # uz/ru matnlar
apps/
  web/             # Next.js (hozir: landing + /[slug] + /api/rsvp)
  bot/             # grammY bot (ro'yxat, yaratish FSM, /myinvites, tahrir)
```

**Muhim topilmalar:**

- **Use-case'lar tayyor** (`CreateInvitationUseCase`, `UpdateInvitationUseCase`,
  `ListOwnerInvitationsUseCase`, `GetInvitationBySlugUseCase`, `GetInvitationStatsUseCase`,
  `DeleteInvitationUseCase`). Web ham shulardan foydalanadi — qayta yozish shart emas.
- **Web'da auth yo'q.** Hozir web faqat o'qiydi (`/[slug]`) va RSVP qo'shadi.
  Dashboard va saytdan yaratish uchun **Telegram-asosli login** kerak.
- **Ro'yxat bot'da** (`ensureUser`) — `users` jadvali `telegram_id` bilan. Web login
  aynan shu `telegram_id` orqali userga bog'lanadi.
- **RLS** qat'iy: yozish faqat `service_role` (bot) orqali. Web yozish uchun ikki yo'l bor
  (pastda 6-bo'lim).
- **Slug** hozir: `aziz-va-malika` + band bo'lsa `-2`, `-3` (raqamli suffiks). Bu
  **taxmin qilinadigan** — g'oya bo'yicha unique/taxmin qilib bo'lmaydigan link kerak.
- **DB check constraint xatosi:** `invitations.template_id` faqat
  `classic/modern/minimal/floral` (+parallax 0004-migratsiyada) ni ruxsat etadi.
  `emerald`/`royal` DB constraint'iga qo'shilmagan — ya'ni ularni **bazaga saqlash
  hozir CHECK'ni buzadi** (demo DB'ni chetlab o'tgani uchun ko'rinmagan). Tozalashda
  tuzatiladi.

---

## 3. Asosiy qarorlar (va tasdiqlash kerak bo'lganlar)

| # | Qaror | Taklif | Tasdiq kerakmi |
|---|-------|--------|----------------|
| D1 | Monorepo/hexagonal saqlanadimi? | **Ha** — domain/application/infra qayta ishlatiladi | — |
| D2 | Web login usuli | **Telegram Login Widget** (1-klik) + bot magic-link zaxira | ✅ tanlash |
| D3 | Unique link formati | `kuyov-kelin-<kod>` (pastda D3 batafsil) | ✅ tanlash |
| D4 | Web yozish (create/edit) qanday | **Server Actions/Route Handlers** — bizning sessiyani tekshirib, `service_role` bilan yozadi (RLS o'zgarmaydi) | ✅ tasdiq |
| D5 | shadcn/ui ishlatamizmi | **Ha** — dashboard/editor form/landing UI uchun (taklifnoma shabloni o'zi custom qoladi) | ✅ tanlash |
| D6 | Public sahifa yo'li | `/[slug]` → **`/i/[slug]`** (yoki hozirgicha `/[slug]`) | ✅ tanlash |
| D7 | 2-bosqich ma'lumotlar (ota-ona, kun tartibi, sovg'a) | Shu rebuild ichida DB'ga qo'shiladi (data-driven) | ✅ tasdiq |

### D3 — Unique link (batafsil)

G'oya: linkda **kuyov-kelin ismlari + ro'yxatdan o'tgan user id** bo'lsin, unique bo'lsin.

Taklif (tavsiya): 

```
/i/aziz-malika-7f3k9q
      │      │      └── qisqa noyob kod (base36, ~6 belgi) — taxmin qilib bo'lmaydi
      │      └───────── kelin ismi (translit)
      └──────────────── kuyov ismi (translit)
```

- Kod `invitation.id` (uuid) va `owner_id`dan hosil qilinadi (qisqartirilgan, kolliziyasiz).
- **Nega raw telegram_id emas?** Telegram ID'ni ochiq linkka qo'yish — maxfiylik va
  "enumeration" xavfi (ketma-ket ID'larni terib ko'rish). Shuning uchun **ismlar +
  tasodifiy qisqa kod** ishlatamiz: ham o'qilishi chiroyli, ham unique, ham taxmin
  qilib bo'lmaydigan. Ichki tomondan har doim `owner_id`ga bog'langan.
- Agar baribir ID ko'rinishi shart bo'lsa — kompromis: `owner`ning qisqa public
  handle'i (uuid'ning 6 belgisi) qo'shiladi: `aziz-malika-ab12-7f3k9q`.
- DB'da `slug` ustuni `unique`; kolliziya bo'lsa kod qayta generatsiya qilinadi.

> **Tasdiqlang:** (a) faqat tasodifiy kod (tavsiya), yoki (b) user handle + kod.

---

## 4. Auth oqimi (Telegram ↔ Web)

**Asosiy: Telegram Login Widget**

1. Foydalanuvchi saytda **"Telegram orqali kirish"** tugmasini bosadi.
2. Telegram widget foydalanuvchini tasdiqlaydi va imzolangan ma'lumot qaytaradi
   (`id, first_name, username, auth_date, hash`).
3. Server `hash`ni **bot tokeni** bilan tekshiradi (HMAC-SHA256) — soxta emasligiga ishonch.
4. `telegram_id` bo'yicha `users`dan topiladi (yo'q bo'lsa yaratiladi — botga tegmay ham).
5. Server **imzolangan sessiya cookie** (httpOnly JWT) beradi. `/dashboard` shu bilan himoyalanadi.

**Zaxira: bot magic-link**

- Botda `/kirish` (login) → bot bir martalik token bilan `https://sayt/login?token=...`
  havolasini yuboradi → sayt tokenni tekshirib sessiya ochadi.
- Login Widget domenni BotFather'da sozlashni talab qiladi (`/setdomain`); magic-link esa
  bunga bog'liq emas — shuning uchun zaxira sifatida ham foydali.

**Middleware:** `/dashboard/*` sessiyasiz — `/login`ga yo'naltiradi.

---

## 5. Sayt sahifalari (3–5)

| Yo'l | Sahifa | Himoya | Tarkib |
|------|--------|--------|--------|
| `/` | **Landing** | ochiq | Hero (Royal namunasi), afzalliklar, "Telegram orqali kirish", "Botda yaratish" CTA |
| `/login` | **Kirish** | ochiq | Telegram Login Widget → sessiya |
| `/dashboard` | **Dashboard** | 🔒 | User taklifnomalari (kartalar): ism, sana, holat, link nusxa, statistika, tugmalar: Yangi / Tahrir / O'chir / Preview |
| `/dashboard/new`, `/dashboard/[id]/edit` | **Editor** | 🔒 | To'liq forma (barcha maydonlar + ota-ona/kun-tartibi/sovg'a), **jonli preview**, saqlash → natija (preview + unique link + nusxa/ulashish) |
| `/i/[slug]` | **Public taklifnoma** | ochiq | Royal shablon (hozirgi `/[slug]` ko'chiriladi) |

shadcn/ui: `button, input, textarea, card, dialog, form, label, sonner(toast), tabs, dropdown-menu, avatar, skeleton`.

---

## 6. Ma'lumotlar modeli (DB o'zgarishlari)

Yangi migratsiya(lar):

1. **Template constraint tuzatish** — `template_id` CHECK'ni faqat `'royal'`ga
   o'zgartirish (yoki CHECK'ni olib tashlab, ilova darajasida tekshirish). Mavjud
   satrlarni `'royal'`ga yangilash.
2. **2-bosqich maydonlari** (`invitations`ga):
   - `parents jsonb` — `{ groom: {father, mother}, bride: {father, mother} }`
   - `schedule jsonb` — `[{ time, title }]`
   - `gift jsonb` — `{ cardNumber, cardHolder, note }`
3. `users`, `rsvps`, `bot_sessions` — o'zgarmaydi.

**Web yozish + RLS:** RLS qat'iy qoladi. Web `create/edit` — Next **server action**da
bizning JWT sessiyamiz tekshiriladi, so'ng `service_role` client bilan `owner_id =
sessiyadagi user` shartida yoziladi. Bu mavjud infra (`SupabaseInvitationRepository`)ni
qayta ishlatadi va anonim yozuvga yo'l qo'ymaydi.

---

## 7. Bosqichma-bosqich reja

> Har bosqich oxirida: `pnpm -w typecheck && lint && build` yashil + commit + push.

### Bosqich 0 — Qarorlarni tasdiqlash
- D2, D3, D5, D6 bo'yicha javob. (Bu hujjat asosida.)

### Bosqich 1 — O'lik kodni tozalash
- Shablonlarni o'chirish: `classic, modern, minimal, floral, parallax, emerald`
  (papkalari bilan). **Royal** qoladi.
- `registry.ts` → faqat `royal`. `getTemplate` fallback ham `royal`.
- Ishlatilmagan shared/widget'lar (Royal import qilmaydiganlar) — tekshirib o'chirish:
  `shared/ui/Leaves, Section, floral, ornaments`(landing rebuilddan keyin),
  `widgets/gallery, invitation-body, map, music` (agar hech kim ishlatmasa).
- Ishlatilmagan rasmlar: `emerald-frame-real.png, floral-cover.jpg, floral-frame-real.png,
  frame-floral.png` (Royal `/images/royal/*` dan foydalanadi).
- Bot: shablon tanlash qadamini olib tashlash → default `royal`
  (`keyboards/templates.ts` o'chadi yoki soddalashadi).
- `demo.ts` `templateId: 'royal'` (allaqachon shunday).
- **Natija:** build yashil, faqat Royal ishlaydi.

### Bosqich 2 — Domain/contracts + DB
- `TemplateId = 'royal'` (union, `TEMPLATE_IDS`, zod enum) — bittaga qisqaradi.
- `Invitation` entity'ga `parents/schedule/gift` (ixtiyoriy) qo'shish.
- Migratsiya: template CHECK → `'royal'`; `parents/schedule/gift jsonb`.
- Mapper'lar (infra) yangilanadi.

### Bosqich 3 — Unique link (slug)
- `Slug.fromNamesWithCode(groom, bride, code)` yoki `CreateInvitationUseCase`'da
  raqamli suffiks o'rniga qisqa kod (`IdGenerator`dan). Kolliziyada qayta urinish.
- Eski `/[slug]` → `/i/[slug]` (redirect eski havolalar uchun ixtiyoriy).

### Bosqich 4 — Auth (Telegram ↔ Web)
- `verifyTelegramLogin(hash)` util (bot token HMAC).
- `/login` sahifa + Telegram Login Widget.
- Sessiya (httpOnly JWT), `middleware.ts` `/dashboard`ni himoya qiladi.
- (Zaxira) bot `/kirish` magic-link.

### Bosqich 5 — Web poydevori
- shadcn/ui o'rnatish + tema (zumrad/oltin brend), umumiy layout, header (avatar/menu).

### Bosqich 6 — Public taklifnoma
- `/i/[slug]` Royal + `parents/schedule/gift` data-driven (namuna o'rniga real).

### Bosqich 7 — Dashboard
- Server action'lar: `listMine`, `remove`, `stats` (sessiya + service_role).
- Kartalar UI, bo'sh holat, link nusxa, preview.

### Bosqich 8 — Editor (create/edit)
- Forma (zod + react-hook-form), barcha maydonlar, rasm yuklash (Supabase storage).
- Jonli preview (Royal). Saqlash → `CreateInvitationUseCase`/`UpdateInvitationUseCase`.
- Natija sahifasi: preview + unique link + nusxa/ulashish.

### Bosqich 9 — Botni moslash
- Ro'yxat (`ensureUser`) — o'zgarmaydi.
- Shablon tanlash yo'q (royal). Yaratish oxirida preview + unique link.
- (Ixtiyoriy) `/kirish` — saytga magic-link.
- Bot ham `Create/Update` use-case'larni ishlatadi (o'zgarishsiz).

### Bosqich 10 — QA + deploy
- `.env.example` yangilash (JWT_SECRET, NEXT_PUBLIC_BASE_URL, bot domeni).
- Web → Vercel, bot → Railway. Migratsiya → Supabase.
- Smoke test: bot ro'yxat → saytga kirish → yaratish → link → boshqa userga ko'rinmaydi.

---

## 8. O'lik kod ro'yxati (Bosqich 1 tekshiruvi)

**O'chiriladi (Royal ishlatmaydi):**
- `src/templates/{classic,modern,minimal,floral,parallax,emerald}/**`
- `src/shared/ui/Leaves.tsx`, `Section.tsx` (import tekshirib)
- `src/shared/ui/floral.tsx`, `ornaments.tsx` — **landing rebuilddan keyin**
- `src/widgets/{gallery,invitation-body,map,music}/**` — import tekshirib
- `public/images/{emerald-frame-real.png, floral-cover.jpg, floral-frame-real.png, frame-floral.png}`
- Bot: `keyboards/templates.ts` (yoki soddalashtirish)

**Qoladi (Royal ishlatadi):**
- `templates/royal/**`
- `shared/ui/{Reveal, DressSwatches}.tsx`, `shared/lib/*`
- `widgets/{calendar, countdown, gift, wishes}/**`
- `features/submit-rsvp/RsvpForm.tsx`

> Har o'chirishdan oldin `grep` bilan import yo'qligini tasdiqlaymiz.

---

## 9. Tavakkalchiliklar

- **Telegram Login Widget domeni** — BotFather `/setdomain` sozlanishi kerak;
  bo'lmasa magic-link zaxirasiga o'tamiz.
- **RLS + web yozish** — service_role kaliti faqat serverda (env), clientga chiqmasin.
- **Eski linklar** — `/[slug]` → `/i/[slug]` ko'chishda 301 redirect qo'yamiz.
- **Slug migratsiyasi** — mavjud taklifnomalar (agar bo'lsa) eski slug bilan ishlashda
  davom etadi; yangi kod faqat yangi yaratilganlarga.

---

## 10. Tech stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + framer-motion
- **Auth:** Telegram Login Widget + httpOnly JWT sessiya (jose)
- **Backend/DB:** Supabase (Postgres + Storage), service_role server tomonda
- **Bot:** grammY (mavjud) — umumiy use-case'lar
- **Deploy:** Web → Vercel, Bot → Railway

---

## 11. Ochiq savollar (javob kutilmoqda)

1. **Link:** faqat tasodifiy kod (`aziz-malika-7f3k9q`, tavsiya) — yoki user handle + kod?
2. **Login:** Telegram Login Widget (1-klik) asosiy bo'lsinmi? Domen sozlashga tayyor bo'lasizmi?
3. **shadcn/ui** ishlataymizmi (tavsiya: ha)?
4. **Public yo'l:** `/i/[slug]` bo'lsinmi yoki hozirgicha `/[slug]`?
5. **Domen nomi** bormi (taklif.uz?) — link va OG uchun kerak.
```
