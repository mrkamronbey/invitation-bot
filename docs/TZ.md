# Texnik Topshiriq (TZ) — Elektron To'y Taklifnoma Platformasi

> **Loyiha nomi:** `invitation-bot` (Telegram bot + Web taklifnoma generatori)
> **Versiya:** TZ v1.0
> **Sana:** 2026-07-13
> **Maqsad:** O'zbekiston bozori uchun to'y taklifnomalarini Telegram bot orqali yaratib, chiroyli web sahifada ko'rsatadigan va RSVP yig'adigan mahsulot.

---

## 1. Mahsulot konsepsiyasi

### 1.1. G'oya
Kuyov-kelin **Telegram bot** orqali savol-javob tarzida taklifnoma yaratadi (ism, sana, lokatsiya, rasm, shablon). Tizim ma'lumotni bazaga yozadi va **noyob havola** (`taklif.uz/aziz-va-malika`) qaytaradi. Bu havola chiroyli, animatsiyali **web taklifnoma**ni ochadi. Mehmonlar web'da **RSVP** (kelaman / kelmayman + necha kishi) qiladi — bu esa botda egaga xabar sifatida keladi.

### 1.2. Nega bot + web?
| Bot (kiritish) | Web (natija) |
|---|---|
| User allaqachon Telegramda — forma to'ldirishdan oson | Chiroyli dizayn, animatsiya — frontend hunar |
| 📍 Lokatsiyani "pin" qilib yuboradi (qo'lda yozmasdan) | Countdown, xarita, galereya, musiqa |
| 🖼 Rasmni to'g'ridan-to'g'ri tashlaydi | To'liq responsive (telefonda ochiladi) |
| 🔔 RSVP xabarini darhol oladi | Ulashishga tayyor havola |

### 1.3. Farqlanish (raqobatdan ustunlik)
> To'liq bozor tahlili **[docs/MARKET.md](./MARKET.md)** da. Qisqacha: model isbotlangan (Rossiyada 10+ servis), O'zbekiston bozori deyarli bo'sh. Bizning pozitsiya:
>
> **"O'zbekcha, Telegramда 2 daqiqада — chiroyli to'y taklifnomasi."**

| # | Farq | Izoh |
|---|---|---|
| 1 | **Telegram-native yaratish** | Raqobatchilar web-forma orqali. Biz botда savol-javob — texnik bo'lmagan kelin-kuyovga oson. **Asosiy farq.** |
| 2 | **To'liq lokalizatsiya** | O'zbek tili (keyin ru/en), **Yandex Maps** (mahalliy aniq), milliy uslub shablonlar |
| 3 | **Tezlik va soddalik** | 📍 lokatsiya pin, 🖼 rasm tashlash, tayyor havola |
| 4 | **Freemium** | Bepul asosiy taklifnoma; premium keyin (branding olib tashlash, premium shablon, ko'proq foto/musiqa) |
| 5 | **Mahalliy to'lov** *(keyin, ixtiyoriy)* | **Click / Payme** — MVP uchun MAJBURIY EMAS, monetizatsiya bosqichida qo'shiladi |

### 1.4. Muhim arxitektura qoidasi
**Har taklifnoma uchun ALOHIDA deploy YO'Q.** Bitta deploy qilingan web ilova bazadan `slug` bo'yicha ma'lumotni dinamik render qiladi:

```
taklif.uz/aziz-va-malika    → bazadan "aziz-va-malika" yozuvini oladi
taklif.uz/bobur-va-nigora   → shu bitta ilova, boshqa ma'lumot
```

Yangi taklifnoma = **bazaga bitta yozuv**, deploy emas. Bot va web **bitta Supabase bazani** bo'lishadi.

---

## 2. Umumiy arxitektura

```
┌─────────────┐   yozadi (insert)   ┌──────────────┐   o'qiydi (select)  ┌─────────────┐
│  Telegram   │ ──────────────────▶ │   Supabase   │ ◀────────────────── │  Next.js    │
│  bot        │  ism, sana, joy,    │  (Postgres)  │   slug bo'yicha      │  web sahifa │
│  (grammY)   │  rasm, shablon      │  invitations │                     │  (SSR)      │
│             │ ◀────────────────── │  + rsvps     │ ──────────────────▶ │  RSVP forma │
└─────────────┘   RSVP notif        └──────────────┘   yozadi (rsvp)     └─────────────┘
      ▲                                     │                                    │
      │                                     │  Storage (rasm/musiqa)             │
      │         RSVP webhook / realtime     ▼                                    │
      └──────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Komponentlar
- **Bot servisi** (`apps/bot`): grammY. Faqat prezentatsiya — Telegram input → use-case chaqiruvi. FSM savol-javob, shablon tanlash, RSVP yetkazish.
- **Web ilova** (`apps/web`): Next.js App Router + FSD. Dinamik `/[slug]` sahifa, RSVP forma, preview.
- **Biznes-mantiq paketlari** (`packages/domain`, `application`): entities, value-objects, ports va use-case'lar — **bot va web umumiy ishlatadi** (bir marta yoziladi).
- **Infrastructure** (`packages/infrastructure`): Supabase/Telegram/Storage adapterlari — portlarni amalga oshiradi.
- **Umumiy paketlar** (`contracts`, `i18n`, `ui`, `config`): tiplar+Zod, matnlar, dizayn tokenlar, lint/ts config.
- **Baza**: Supabase (Postgres + Storage + Row Level Security).

> Qatlamlar, bog'liqlik yo'nalishi va DI to'liq **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** da tavsiflangan.

### 2.2. Ma'lumot oqimi (E2E)
1. User botga `/start` → shablon galereyasi (rasm preview) → tanlaydi.
2. Bot FSM savollari: ismlar → sana/vaqt → 📍lokatsiya → 🖼rasm(lar) → story → dress code.
3. Bot `invitations` jadvaliga yozuv qo'shadi, `slug` generatsiya qiladi.
4. Bot havola qaytaradi: `taklif.uz/aziz-va-malika`.
5. Mehmon havolani ochadi → SSR sahifa bazadan render qiladi.
6. Mehmon RSVP qiladi → `rsvps` jadvaliga yoziladi.
7. Bot (webhook yoki polling) RSVP'ni sezadi → egaga xabar: *"Aziz kelaman dedi (2 kishi)"*.

---

## 3. Ma'lumotlar bazasi sxemasi (Supabase / Postgres)

### 3.1. `users` — bot foydalanuvchilari (kuyov-kelin)
| Ustun | Tip | Izoh |
|---|---|---|
| `id` | `uuid` PK | default `gen_random_uuid()` |
| `telegram_id` | `bigint` unique | Telegram user id |
| `username` | `text` null | @username |
| `first_name` | `text` | |
| `language_code` | `text` default `'uz'` | uz/ru/en |
| `created_at` | `timestamptz` default `now()` | |

### 3.2. `invitations` — taklifnomalar
| Ustun | Tip | Izoh |
|---|---|---|
| `id` | `uuid` PK | |
| `owner_id` | `uuid` FK → users.id | egasi |
| `slug` | `text` unique | URL qismi, masalan `aziz-va-malika` |
| `template_id` | `text` | `classic` / `modern` / `minimal` / `floral` |
| `groom_name` | `text` | kuyov ismi |
| `bride_name` | `text` | kelin ismi |
| `event_date` | `date` | to'y kuni |
| `event_time` | `time` null | vaqt |
| `venue_name` | `text` null | to'yxona nomi |
| `venue_address` | `text` null | manzil matni |
| `location_lat` | `numeric` null | Telegram pin lat |
| `location_lng` | `numeric` null | Telegram pin lng |
| `story` | `text` null | qisqa matn / hikoya |
| `dress_code` | `text` null | |
| `cover_image_url` | `text` null | asosiy rasm (Storage) |
| `gallery` | `jsonb` default `'[]'` | qo'shimcha rasmlar URL massivi |
| `music_url` | `text` null | fon musiqasi URL. Default trek (`/audio/track-1.mp3`) yoki user yuklagan Storage URL. `null` = musiqasiz |
| `music_source` | `text` default `'none'` | `none` / `default` / `custom` — UI va tahlil uchun |
| `status` | `text` default `'draft'` | `draft` / `published` |
| `locale` | `text` default `'uz'` | |
| `created_at` | `timestamptz` default `now()` | |
| `updated_at` | `timestamptz` default `now()` | |

Indekslar: `slug` (unique), `owner_id`.

### 3.3. `rsvps` — mehmon javoblari
| Ustun | Tip | Izoh |
|---|---|---|
| `id` | `uuid` PK | |
| `invitation_id` | `uuid` FK → invitations.id | |
| `guest_name` | `text` | mehmon ismi |
| `attending` | `boolean` | keladi / kelmaydi |
| `guests_count` | `int` default `1` | necha kishi |
| `message` | `text` null | tabrik/izoh |
| `notified_owner` | `boolean` default `false` | botga xabar yuborildimi |
| `created_at` | `timestamptz` default `now()` | |

Indeks: `invitation_id`.

### 3.4. RLS (Row Level Security) prinsipi
- `invitations`: `published` bo'lganlarini hamma **o'qiy oladi** (anon read). Yozish/tahrirlash faqat service role (bot) yoki egasi orqali.
- `rsvps`: anon **insert** ruxsat (mehmon RSVP qiladi), lekin o'qish faqat service role / egasi.
- Bot **service role key** bilan ishlaydi (server tomonda, sir).
- Web anon RSVP uchun **anon key** + minimal RLS ishlatadi.

---

## 4. Monorepo papka strukturasi (Clean Architecture + FSD)

> To'liq arxitektura qonun-qoidalari, qatlamlar va bog'liqlik grafi **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** da. Bu yerda qisqacha.

**pnpm workspace + Turborepo** monorepo. Biznes-mantiq `packages/` da bir marta yoziladi — bot ham web ham qayta ishlatadi (asosiy DRY g'oyasi). Bog'liqlik faqat ichkariga: `presentation → application → domain`.

```
invitation-bot/
├── turbo.json · pnpm-workspace.yaml · package.json
├── docs/ (TZ.md, ARCHITECTURE.md)
│
├── packages/
│   ├── domain/            # ⬅ yadro: entities, value-objects, ports (interfeys) — hech narsaga bog'liq emas
│   ├── application/       # ⬅ use-case'lar: CreateInvitation, SubmitRsvp, ... (domainga tayanadi)
│   ├── infrastructure/    # ⬅ adapterlar: Supabase repo, Storage, TelegramNotifier (portlarni amalga oshiradi)
│   ├── contracts/         # ⬅ umumiy tiplar + Zod sxemalar (bot + web + API)
│   ├── i18n/              # ⬅ barcha matnlar (uz → keyin ru/en)
│   ├── ui/                # ⬅ umumiy dizayn tokenlar / Tailwind preset
│   └── config/            # ⬅ eslint-config, tsconfig-base, prettier, tailwind-preset
│
├── apps/
│   ├── bot/               # ⬅ grammY — Clean presentation
│   │   └── src/ (composition.ts DI, flows/ FSM registry, handlers/, presenters/, keyboards/)
│   │
│   └── web/               # ⬅ Next.js — Feature-Sliced Design (FSD)
│       └── src/
│           ├── app/       # routing (yupqa) — [slug]/page.tsx, api/rsvp/route.ts
│           ├── pages/     # sahifa kompozitsiyasi
│           ├── widgets/   # Hero, Countdown, Map, Gallery, Rsvp
│           ├── features/  # submit-rsvp, share-invitation, toggle-music
│           ├── entities/  # invitation, rsvp, guest (UI + model)
│           ├── shared/    # ui-kit, lib, api, config
│           └── templates/ # shablon registry (plagin — Open/Closed)
│
└── supabase/migrations/   # versiyalangan SQL
```

**Umumiylashtirish nuqtalari:**
- **Use-case'lar** (`application`) — biznes-mantiq bir marta, bot+web ishlatadi.
- **Shablonlar** — registry (`templates`); yangisi = 1 qator, mavjud kod o'zgarmaydi.
- **Bot savollari** — qadam registry (`steps`); yangi savol = 1 obyekt, oqim engine o'zgarmaydi.
- **Umumiy bloklar** (Countdown, Map, Gallery, RsvpForm) — `widgets`; shablonlar ularni kompozitsiya qiladi (takrorlanmaydi).
- **Qatlam qoidalari ESLint bilan majburlanadi** — masalan `domain` da Supabase import qilib bo'lmaydi.

---

## 5. Bot oqimi (FSM / Conversation)

grammY `@grammyjs/conversations` bilan.

### 5.1. Buyruqlar
- `/start` — kutib olish + "Taklifnoma yaratish" tugmasi.
- `/myinvites` — mening taklifnomalarim (havola + RSVP soni).
- `/help` — yordam.

### 5.2. Yaratish oqimi (bosqichma-bosqich)
```
/start
  └─▶ "Assalomu alaykum! To'y taklifnomasi yaratamizmi?" [🎉 Boshlash]
        │
        ▼
  [1] Shablon tanlash — inline preview rasmlar bilan
        (Klassik | Zamonaviy | Minimal | Gullar)
        │
        ▼
  [2] "Kuyov ismi?"            → matn
  [3] "Kelin ismi?"           → matn
  [4] "To'y sanasi?"          → sana (kalendar yoki matn, validatsiya)
  [5] "Vaqti?"                → vaqt (ixtiyoriy)
  [6] "To'yxona nomi?"        → matn (ixtiyoriy)
  [7] "📍 Lokatsiyani yuboring" → Telegram location (pin)
  [8] "🖼 Rasm(lar) yuboring"   → photo (Storage'ga yuklanadi)
  [9] "Qisqa matn / story?"    → matn (ixtiyoriy, skip mumkin)
  [10] "Dress code?"           → matn (ixtiyoriy)
  [11] "🎵 Fon musiqasi?"       → 3 tayyor trekдан tanlash (inline preview)
                                 | 🎼 O'zim yuklayman (audio file) | ⏭ Kerak emas
                                 → default: music_source='default', music_url=trek
                                 → custom:  audio Storage'ga → music_source='custom'
                                 → skip:    music_source='none'
        │
        ▼
  [Tasdiqlash] — bot yig'ilgan ma'lumotni ko'rsatadi → [✅ Tayyor | ✏️ Tahrirlash]
        │
        ▼
  Bot: slug generatsiya → invitations insert → status=published
  Bot: "✅ Tayyor! Havolangiz: https://taklif.uz/aziz-va-malika"
        [🔗 Ochish]  [📤 Ulashish]
```

### 5.3. Validatsiya (Zod)
- Ism: bo'sh emas, ≤ 40 belgi.
- Sana: `YYYY-MM-DD` yoki kalendar, bugundan keyin.
- Lokatsiya: Telegram `message.location` dan lat/lng.
- Rasm: `getFile` → Supabase Storage'ga yuklab, public URL.

### 5.4. RSVP xabarnomasi
- Variant A (tavsiya): Web RSVP `POST /api/rsvp` → bot HTTP endpoint / Supabase trigger orqali botga signal → bot egaga xabar.
- Variant B (oddiy MVP): bot vaqti-vaqti bilan (yoki Supabase Realtime subscription) `rsvps` dagi `notified_owner=false` larni tekshiradi → egaga yuboradi → `notified_owner=true`.
- **MVP uchun**: Supabase Realtime yoki web'dan botga to'g'ridan-to'g'ri Telegram `sendMessage` (service tokendan). Eng sodda: web RSVP endpoint ichida `owner.telegram_id` ga bot API orqali xabar yuborish.

---

## 6. Web sahifalar va komponentlar

### 6.1. `/[slug]` — taklifnoma sahifa (asosiy)
SSR: `getInvitation(slug)` → `template_id` ga qarab mos shablon komponenti render qilinadi.

Bloklar (shablon ichida joylashtiriladi):
- **Hero**: kuyov + kelin ismi, cover rasm, animatsiyali kirish (Framer Motion).
- **Countdown**: to'yga qolgan kun/soat/daqiqa.
- **Sana & Vaqt**: chiroyli formatda.
- **Manzil + Xarita** (`MapBlock`): Yandex/Google embed, "Yo'l ko'rsatish" tugmasi.
- **Story / Matn**.
- **Galereya** (`Gallery`): rasmlar, lightbox.
- **Dress code**.
- **RSVP forma** (`RsvpForm`): ism, keladi/kelmaydi, necha kishi, izoh.
- **Music toggle** (`MusicToggle`): fon musiqasini yoq/o'chir. 3 tayyor trekдан biri yoki user yuklagan audio (`music_source`). Avtomatik ijro brauzer siyosatiga mos (user ishorasiдан keyin).
- Footer / ulashish.

### 6.2. `/` — landing (marketing)
Mahsulotni tanishtirish, "Telegram botda yaratish" tugmasi (bot havolasi), namuna taklifnomalar.

### 6.3. `POST /api/rsvp`
Body: `{ invitationId, guestName, attending, guestsCount, message }` → Zod validatsiya → `rsvps` insert → egaga bot xabari → `200`.

### 6.4. Shablonlar (plagin kabi)
Har shablon = alohida React komponent, umumiy `InvitationData` propsini oladi. Yangi shablon qo'shish = `templates/` ga yangi fayl + `packages/shared/templates.ts` ga registratsiya. UI kontrakt bir xil (DRY).

---

## 7. Texnologiyalar (stack)

| Qatlam | Vosita |
|---|---|
| Til | TypeScript (strict) — bot + web + shared |
| Bot | grammY + `@grammyjs/conversations` |
| Web framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Animatsiya | Framer Motion |
| Baza | Supabase (Postgres + Storage + RLS) |
| Validatsiya | Zod |
| Forma (web) | React Hook Form + Zod |
| Monorepo | pnpm workspace + **Turborepo** (keshli build/lint) |
| Arxitektura | Clean Architecture + Ports & Adapters; web'da **FSD** |
| Qatlam nazorati | ESLint boundary qoidalari (`no-restricted-imports` / boundaries) |
| Lint/format | ESLint + Prettier |
| Deploy (web) | Vercel |
| Deploy (bot) | Railway (yoki Render / VPS — doimiy jarayon) |

> **Eslatma:** Bot doimiy ishlaydigan jarayon (polling) yoki webhook talab qiladi. Vercel serverless botni doimiy tutolmaydi — shuning uchun bot **Railway**da, web **Vercel**da. Ikkalasi bir Supabase bazani bo'lishadi.

---

## 8. Deploy va muhit (environment)

### 8.1. `.env` o'zgaruvchilari
```
# Supabase (bot + web umumiy)
SUPABASE_URL=
SUPABASE_ANON_KEY=          # web (anon RSVP)
SUPABASE_SERVICE_ROLE_KEY=  # bot (server, sir)

# Telegram
BOT_TOKEN=

# Web
NEXT_PUBLIC_SITE_URL=https://taklif.uz
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 8.2. Deploy oqimi
- **Web** → Vercel (GitHub'ga push → avtomatik deploy). `apps/web` root.
- **Bot** → Railway (`apps/bot`, `pnpm --filter bot start`). Doimiy worker.
- **Baza** → Supabase (migratsiyalar `supabase/migrations` yoki SQL fayl orqali).

---

## 9. Kod sifati talablari
- TypeScript **strict**, `any` taqiqlanadi (asosli holatlardan tashqari).
- ESLint + Prettier — CI'da tekshiriladi.
- Zod bilan tashqi ma'lumot chegarada validatsiya (bot input, RSVP).
- Qatlamli: UI / servis / data ajratilgan.
- Barcha matnlar `packages/shared/i18n/uz.ts` da (i18n-ready — keyin ru/en).
- Sirlar `.env` orqali, hech qachon kodga yozilmaydi.
- Har bosqich: kod → `lint` + `typecheck` + `build` → git commit.

---

## 10. Roadmap (bosqichма-bosqich MVP)

### Bosqich 0 — Poydevor (setup)
- [ ] pnpm workspace, `packages/shared`, `apps/bot`, `apps/web` skeleti.
- [ ] TypeScript strict, ESLint, Prettier sozlash.
- [ ] Supabase loyiha + jadvallar (SQL migratsiya) + RLS.
- [ ] `.env.example`, README.
- **Natija:** `pnpm install`, `pnpm lint`, `pnpm typecheck` ishlaydi.

### Bosqich 1 — Bitta shablon + bitta namuna (birinchi tirik natija) ⭐
- [ ] `ClassicTemplate` — chiroyli, animatsiyali, responsive.
- [ ] `/[slug]` sahifa — bazadan namuna taklifnomani render qiladi.
- [ ] Bazaga qo'lda 1 namuna yozuv (`aziz-va-malika`).
- [ ] Vercel deploy — **`taklif.uz/aziz-va-malika` ochiladi**.
- **Natija:** Tirik, ulashsa bo'ladigan bitta chiroyli taklifnoma.

### Bosqich 2 — Bot yaratish oqimi
- [ ] grammY bot skeleti, `/start`, shablon tanlash.
- [ ] FSM: ismlar → sana → 📍lokatsiya → 🖼rasm → story.
- [ ] `invitations` insert + slug generatsiya + havola qaytarish.
- [ ] Rasmni Supabase Storage'ga yuklash.
- **Natija:** Botда yangi taklifnoma yaratib, havola olsa bo'ladi.

### Bosqich 3 — RSVP oqimi
- [ ] Web `RsvpForm` + `POST /api/rsvp`.
- [ ] `rsvps` insert.
- [ ] Bot egaga RSVP xabari.
- [ ] `/myinvites` — RSVP ro'yxati.
- **Natija:** To'liq aylanma: yaratish → ulashish → RSVP → xabar.

### Bosqich 4 — Boyitish
- [ ] 3-4 shablon (zamonaviy, minimal, gullar).
- [ ] Countdown, Xarita, Galereya, Music toggle.
- [ ] OpenGraph preview (Telegramда chiroyli ko'rinish).
- [ ] Landing sahifa.

### Bosqich 5 (keyin) — Monetizatsiya & ko'p til
- [ ] Freemium: bepul asosiy + premium shablon / o'z sub-domen / branding olib tashlash.
- [ ] **Click / Payme** to'lov integratsiyasi — *ixtiyoriy, MVP uchun majburiy emas*.
- [ ] ru / en tillari (i18n allaqachon tayyor).
- [ ] Milliy uslub shablonlar (naqsh + zamonaviy).
- [ ] Analytics (taklifnoma necha marta ochildi).

---

## 11. Ochiq savollar (siz hal qilasiz)
1. ~~**Domen:**~~ ✅ Hozircha **Vercel subdomen** bilan boshlanadi; `taklif.uz` keyin ulanadi.
2. ~~**Xarita:**~~ ✅ **Yandex Maps** tanlandi (O'zbekistonда aniqroq).
3. ~~**Bot hosting:**~~ ✅ **Railway** tanlandi.
4. **Slug:** avtomatik (`aziz-va-malika`) — bir xil bo'lsa `-2` qo'shiladi. To'g'rimi?
5. ~~**Musiqa:**~~ ✅ **MVP ga kiradi.** 3 ta tayyor (default) trek + user o'zi audio yuklashi mumkin (`music_source`: `default`/`custom`/`none`). Web'da `MusicToggle` bilan yoq/o'chir.

> **Qaror:** To'lov (**Click/Payme**) — MVP uchun **majburiy emas**, keyingi (monetizatsiya) bosqichga qoldirildi.

---

*TZ tasdiqlangach, Bosqich 0 dan boshlaymiz. Har bosqichда: kod → tekshirish (lint/build/type) → git commit.*
