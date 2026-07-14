# Arxitektura — Elektron To'y Taklifnoma Platformasi

> Bu hujjat loyihaning **arxitektura qonun-qoidalari**ni belgilaydi: qatlamlar, bog'liqlik yo'nalishi, papka strukturasi (Clean Architecture + Ports & Adapters + FSD), va kod umumiylashtirish tamoyillari.
> Asosiy g'oya: **biznes-mantiq bir marta yoziladi, bot ham web ham uni qayta ishlatadi.**

---

## 1. Asosiy tamoyillar

| Tamoyil                          | Amalda nima degani                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Clean Architecture**           | Biznes-qoidalar frameworkдан mustaqil. `domain` hech narsaга bog'liq emas.                                         |
| **Ports & Adapters (Hexagonal)** | Tashqi dunyo (Supabase, Telegram, Storage) — almashtiriladigan adapterlar. Domain faqat _interfeys_ (port) biladi. |
| **Dependency Rule**              | Bog'liqlik faqat **ichкариga** yo'nalади: `presentation → application → domain`. Domain tashqariga qaramaydi.      |
| **FSD (Feature-Sliced Design)**  | Web UI qatlamli: `app → pages → widgets → features → entities → shared`. Yuqoridan pastga import.                  |
| **DRY / umumiylashtirish**       | Bir xil mantiq (slug, validatsiya, use-case) `packages/` да bir marta. Bot va web import qiladi.                   |
| **Open/Closed**                  | Shablonlar, savol qadamlari, RSVP kanallari — **registry** orqали qo'shiladi, mavjud kod o'zgarmaydi.              |
| **Result-based error handling**  | Kutilgan xatolar `Result<T, E>` orqали, `throw` faqat kutilmagan holatlarда.                                       |

**Oltin qoida:** agar kodни _ikkала_ joyда (bot + web) ishlatsa bo'lsa — u `packages/` да. Agar u faqat UI'га tegишли bo'lsa — `apps/web` да. Agar faqat Telegramга — `apps/bot` да.

---

## 2. Qatlamlar (Clean Architecture)

```
        ┌─────────────────────────────────────────────────────────┐
        │  PRESENTATION (frameworklar)                             │
        │  apps/web (Next.js, FSD)   apps/bot (grammY handlers)    │
        └───────────────┬─────────────────────────┬───────────────┘
                        │  use-case chaqiradi     │
        ┌───────────────▼─────────────────────────▼───────────────┐
        │  APPLICATION  (packages/application)                     │
        │  Use-cases: CreateInvitation, PublishInvitation,         │
        │  SubmitRsvp, ListInvitations, NotifyOwner                │
        │  Portlarга tayanadi (interfeys), amalga oshirilishга yo'q│
        └───────────────┬─────────────────────────────────────────┘
                        │  entity + port ishlatadi
        ┌───────────────▼─────────────────────────────────────────┐
        │  DOMAIN  (packages/domain)  — HECH NARSAГА BOG'LIQ EMAS  │
        │  Entities: Invitation, Rsvp, Guest, User                 │
        │  Value Objects: Slug, EventDate, GeoPoint, PersonName    │
        │  Ports (interfeys): InvitationRepository, RsvpRepository, │
        │         Storage, Notifier                                │
        │  Domain services / qoidalar                              │
        └───────────────▲─────────────────────────────────────────┘
                        │  portlarни amalга oshiradi (implements)
        ┌───────────────┴─────────────────────────────────────────┐
        │  INFRASTRUCTURE  (packages/infrastructure)               │
        │  SupabaseInvitationRepo, SupabaseRsvpRepo,               │
        │  SupabaseStorage, TelegramNotifier                       │
        │  → Supabase SDK, Telegram Bot API bu yerда yashiringan   │
        └─────────────────────────────────────────────────────────┘
```

**Bog'liqlik yo'nalishi (eng muhim qoida):**
`infrastructure → domain ← application ← presentation`
Domain markazда, hech kimга qaramaydi. Infrastructure domain _portlarини_ amalга oshiradi (dependency inversion).

### 2.1. Har qatlam nima qiladi

- **Domain** — sof biznes. Frameworksiz, I/O siz, `import`siz (faqat `contracts`/zod'дан tashqари minimal). Misol: `Slug.create("Aziz & Malika")` → `aziz-va-malika`; `EventDate` o'tmишдаги sanani rad etади.
- **Application** — use-case'lar (interactors). Har biri bitta amal: kirish DTO oladi, portlar orqали ish bajaradi, natija qaytaради. Framework bilmaydi. Misol: `CreateInvitationUseCase.execute(input)`.
- **Infrastructure** — portlarни haqiqiy texnologiya bilan bog'laydi (Supabase, Telegram, Storage). Faqat shu yerда tashqи SDK'lar bор.
- **Presentation** — Next.js sahifалari va grammY handler'лари. Ular faqat use-case'ни chaqiради va natijани ko'rsатади. **Biznes-mantiq bu yerда YO'Q.**

### 2.2. Composition Root (DI)

Har ilova (`apps/web`, `apps/bot`) o'з **composition root**ида bog'lamни quради: qайси infrastructure adapter qайси portга ulanадi. Use-case'lar konstruktор orqали port oladi (constructor injection). Global singleton yo'q — testда soxta (mock) port berish oson.

```ts
// apps/bot/src/composition.ts (soddalashtирилган)
const supabase = createSupabaseClient(env);
const invitationRepo = new SupabaseInvitationRepo(supabase);
const storage = new SupabaseStorage(supabase);
const notifier = new TelegramNotifier(botApi);

export const useCases = {
  createInvitation: new CreateInvitationUseCase(invitationRepo, storage),
  submitRsvp: new SubmitRsvpUseCase(rsvpRepo, invitationRepo, notifier),
  // ...
};
```

---

## 3. Monorepo strukturasi

**pnpm workspace + Turborepo** (tez, keshli build/lint). Bog'liqlik grafi Dependency Rule'га mos.

```
invitation-bot/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
│
├── packages/
│   │
│   ├── domain/                     # ⬅ Enterprise qoidalar (hech narsага bog'liq emas)
│   │   └── src/
│   │       ├── entities/           # Invitation, Rsvp, Guest, User
│   │       ├── value-objects/      # Slug, EventDate, GeoPoint, PersonName, ImageRef
│   │       ├── ports/              # InvitationRepository, RsvpRepository, Storage, Notifier (interfeys)
│   │       ├── errors/             # DomainError, ValidationError (typed)
│   │       └── index.ts
│   │
│   ├── application/                # ⬅ Use-case'lar (domainga tayanadi)
│   │   └── src/
│   │       ├── use-cases/
│   │       │   ├── create-invitation/
│   │       │   ├── publish-invitation/
│   │       │   ├── get-invitation-by-slug/
│   │       │   ├── submit-rsvp/
│   │       │   └── list-owner-invitations/
│   │       ├── dto/                # kirish/chiqish DTO tiplari
│   │       └── result.ts           # Result<T,E> yordamchisi
│   │
│   ├── infrastructure/             # ⬅ Adapterlar (portlarни amalга oshiradi)
│   │   └── src/
│   │       ├── supabase/           # SupabaseInvitationRepo, SupabaseRsvpRepo, client
│   │       ├── storage/            # SupabaseStorage adapter
│   │       ├── telegram/           # TelegramNotifier adapter
│   │       └── mappers/            # DB-row ↔ Domain-entity (bir joyда)
│   │
│   ├── contracts/                  # ⬅ Umumiy tiplar + Zod sxemalar (bot+web+API)
│   │   └── src/
│   │       ├── schemas/            # invitationSchema, rsvpSchema (Zod)
│   │       └── dto.ts
│   │
│   ├── i18n/                       # ⬅ Barcha matnlar (uz, keyin ru/en)
│   │   └── src/
│   │       ├── uz.ts
│   │       └── t.ts                # typed translator
│   │
│   ├── ui/                         # ⬅ Frameworksiz dizayn primitivlari (ixtiyoriy, umumiy tokens)
│   │   └── src/ (Tailwind preset, ranglар, tipografiya)
│   │
│   └── config/                     # ⬅ eslint-config, tsconfig-base, tailwind-preset, prettier
│
├── apps/
│   │
│   ├── web/                        # ⬅ Next.js — FSD strukturasi (5-bo'limга qarang)
│   │
│   └── bot/                        # ⬅ grammY — Clean presentation (4-bo'limга qarang)
│
└── supabase/
    └── migrations/                 # SQL migratsiyalar (versiyalangan)
```

### Bog'liqlik grafi (kim kimni import qiladi)

```
domain      ← application ← { infrastructure, apps/web, apps/bot }
contracts   ← { application, infrastructure, apps/web, apps/bot }
i18n, ui, config ← apps/*
```

`domain` hech kimni import qilmaydi. `apps` faqat `application` (+ contracts/i18n/ui) ни ko'radi; infrastructure faqat composition root'да ulanади. **ESLint `no-restricted-imports` bilan bu qoida majburlanади** — masalan `domain` ичида `@supabase/*` import qilib bo'lmaydi.

---

## 4. Bot (apps/bot) — Clean presentation

Bot **prezentatsiya qatlami** — biznes-mantiq `application` да. Bot faqat: Telegram input → DTO → use-case → javob.

```
apps/bot/src/
├── index.ts                # ishga tushirish (polling/webhook)
├── composition.ts          # DI: infrastructure → use-case bog'lami
├── bot.ts                  # Bot instance + middleware (auth, session, error)
├── flows/                  # FSM (conversation) — savol-javob oqimlari
│   └── create-invitation/
│       ├── steps.ts        # qadamlar RO'YXATI (registry — Open/Closed)
│       └── flow.ts         # qadamlarни umumiy engine bilan yuritish
├── handlers/               # /start, /myinvites, callback query
├── presenters/             # domain natija → Telegram xabar/klaviatura
├── keyboards/              # inline tugma quruvchilar
└── middleware/             # error boundary, i18n, user-load
```

**Qadam registry (umumiylashtirish).** Har savol — bir xil interfeys bilan tavsiflangan obyekt. Yangi savol qo'shish = `steps.ts` ga bitta yozuv, oqim mantiqи o'zgармайди:

```ts
type Step<K extends keyof InvitationDraft> = {
  key: K;
  ask: (ctx) => Promise<void>; // savolни ko'rsатиш
  parse: (ctx) => Result<InvitationDraft[K]>; // javobни tekshirish (Zod)
  optional?: boolean;
  skippable?: boolean;
};

const steps: Step<any>[] = [
  groomNameStep,
  brideNameStep,
  eventDateStep,
  locationStep,
  coverImageStep,
  storyStep /* ... */,
];
// umumiy engine steps ни ketma-ket yuritадi — hech qanday if/else zanjiri yo'q
```

---

## 5. Web (apps/web) — Feature-Sliced Design

Next.js App Router **routing** uchun (`app/`), lekin butun UI mantiqи **FSD** bo'yича `src/` да. `app/` faqat FSD `pages` ни ulaydi.

### FSD qatlamlari (yuqоридан pastga — import faqat pastга)

```
app       → global: providers, styles, routing kompozitsiyasi
  ▼
pages     → butun sahifa kompozitsiyasi (InvitationPage, LandingPage)
  ▼
widgets   → mustaqil katta bloklar (InvitationHero, RsvpWidget, MapWidget, GalleryWidget)
  ▼
features  → foydalanuvchi amallari (submit-rsvp, share-invitation, toggle-music)
  ▼
entities  → biznes obyekt UI+model (invitation, rsvp, guest)
  ▼
shared    → ui-kit, lib, api mijoz, config — biznesга bog'liq emas
```

**Qoida:** har qatlam faqat **o'zидан pastдаги** qatlamни import qiladi. `features` `widgets`ни import qila olmayди. Bu — ESLint bilan majburlanади (`eslint-plugin-boundaries` / `steiger`).

### Papka

```
apps/web/src/
├── app/                          # Next.js routing (yupqa)
│   ├── layout.tsx
│   ├── page.tsx                  # → pages/landing
│   ├── [slug]/page.tsx           # → pages/invitation  (SSR: getInvitationBySlug)
│   └── api/rsvp/route.ts         # → features/submit-rsvp serverда
│
├── pages/
│   ├── invitation/               # taklifnoma sahifа kompozitsiyasi
│   └── landing/
│
├── widgets/
│   ├── invitation-hero/
│   ├── countdown/
│   ├── map/
│   ├── gallery/
│   └── rsvp/
│
├── features/
│   ├── submit-rsvp/              # ui (forma) + model + api chaqiruv
│   ├── share-invitation/
│   └── toggle-music/
│
├── entities/
│   ├── invitation/               # invitation UI karta + model (selektorlar)
│   ├── rsvp/
│   └── guest/
│
├── shared/
│   ├── ui/                       # Button, Input, Card, Section (dizayn tizimi)
│   ├── lib/                      # helperlar (formatDate, cn)
│   ├── api/                      # use-case chaqiruvchи thin katlam (server actions)
│   └── config/
│
└── templates/                    # ⬅ SHABLONLAR — plagin registry (6-bo'limга qarang)
```

Har slice ичида **segmentlar**: `ui/`, `model/`, `api/`, `lib/`, `index.ts` (public API). Slice tashqаridан faqat `index.ts` orqали ochilади (inkapsulyatsiya).

---

## 6. Shablonlar — plagin arxitekturasi (kengayuvchanlik yadrosi)

Yangi shablon qo'shish **mavjud kodни o'zgартирмайди** (Open/Closed). Har shablon — umumiy kontraktni bajaradigan komponent + meta.

```ts
// packages/contracts — umumiy props
type InvitationView = {
  // domain entity'дан tayyorlangan "view model"
  groomName: string;
  brideName: string;
  eventDate: Date;
  venue?: Venue;
  geo?: GeoPoint;
  coverImageUrl?: string;
  gallery: string[];
  story?: string;
  dressCode?: string;
  musicUrl?: string;
};

// apps/web/src/templates/types.ts
type TemplateComponent = (props: { data: InvitationView }) => JSX.Element;
type TemplateMeta = {
  id: string; // 'classic' | 'modern' | 'minimal' | 'floral'
  name: string; // botда ko'rsатиладиган nom
  previewImage: string;
  component: TemplateComponent;
};

// registry — YAGONA qo'shиладиган joy
export const templates: Record<string, TemplateMeta> = {
  classic: classicTemplate,
  modern: modernTemplate,
  // yangи shablон → shu yerга 1 qатор
};
export const getTemplate = (id: string) => templates[id] ?? templates.classic;
```

- **Web** `[slug]` да: `getTemplate(inv.templateId).component` ni render qiladi.
- **Bot** shablon tanlashда: `Object.values(templates)` дан tugma+preview quради.
- Umumiy bloklar (`Countdown`, `Map`, `Gallery`, `RsvpForm`) — `widgets` да, shablonlar ularни **kompоzitsiya** qiladi (kod takrorlanmайди). Har shablon faqat _layout va uslub_ да farq qiladi.

---

## 7. Ma'lumot oqimi — misol: RSVP (use-case reuse)

```
Web forma (features/submit-rsvp)
   │  POST /api/rsvp  {slug, guestName, attending, count}
   ▼
app/api/rsvp/route.ts  → Zod validatsiya (contracts) → SubmitRsvpUseCase.execute(dto)
   ▼
SubmitRsvpUseCase (application)
   ├─ RsvpRepository.save(rsvp)         (port → SupabaseRsvpRepo)
   └─ Notifier.notifyOwner(owner, rsvp) (port → TelegramNotifier)
   ▼
Owner Telegramда xabar: "Aziz kelaman dedi (2 kishi)"
```

**E'tibor bering:** `SubmitRsvpUseCase` — bir marta yozilган. Uni web API ham, kelajакда bot (agar botда RSVP bo'lса) ham chaqira oladi. `Notifier` port — bugun Telegram, ertага SMS/email adapter qo'шиб bo'lади, use-case o'zгармайди.

---

## 8. Xatoларни boshqarish (Result pattern)

```ts
type Result<T, E = AppError> = { ok: true; value: T } | { ok: false; error: E };
```

- Use-case'lар kutилган xatони (`SlugTaken`, `InvitationNotFound`, `InvalidDate`) `Result` orqали qaytаради — `throw` emas.
- Presentation qатлам natijани ko'rsатади: bot → tushunarli xabar, web → 404/xato holati.
- Kutилмаган xatolar (DB uzилиши) → global error boundary (bot middleware / Next.js `error.tsx`) + log.

---

## 9. System design mulohazalari

| Mavzu              | Yechim                                                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Baza**           | **Postgres** (Supabase — managed). Domain uni bilmaydi, faqat `InvitationRepository` port. Keyin o'z Postgres'ga ko'chsa — adapter almashadi, mantiq o'zgarmaydi. |
| **O'qish tezligi** | `[slug]` sahifа SSR + ISR/cache (taklifnoma kam o'zгаради). Vercel edge cache.                                                                                    |
| **Redis / kesh**   | **MVP'да YO'Q** (YAGNI — CDN cache yetарли). Kerак bo'lганда `CachePort` qo'шиб ulanади, biznes-mantiq o'zгармайди.                                               |
| **Rasm**           | Supabase Storage + Next `<Image>` optimizatsiya. Yuklашда bir marta.                                                                                              |
| **Bot masshtаbi**  | v1 polling (Railway). O'sса — webhook + queue (RSVP xabarларини navbatга).                                                                                        |
| **Idempotentlik**  | RSVP takroriy yuborilса — `(invitation_id, guest fingerprint)` bo'yича nazorat.                                                                                   |
| **Xavfsizlik**     | Supabase RLS: `published` ni anon o'qийди; yozиш faqat service-role (bot). RSVP anon insert, o'qиш yo'q. Sirlар `.env`.                                           |
| **Kuzatuv**        | Structured logging (pino), use-case darajасидаги xato log'lари.                                                                                                   |
| **Sinov**          | domain/application — sof unit test (mock port). infrastructure — integration. web — komponent test.                                                               |
| **Kengayиш**       | Yangi funksiya = yangi `feature` slice yoki yangi `use-case`; yadро o'zгармайди.                                                                                  |

---

## 10. Sifat majburlash (avtomatik)

- **ESLint boundary qoidалари** — qatlаmlар orasидаги noto'g'ri import xato beради (domain'да Supabase, features → widgets, va h.k.).
- **TypeScript strict** + `noUncheckedIndexedAccess`. `any` taqиqланади.
- **Turborepo** — `typecheck`, `lint`, `test`, `build` keshли, faqat o'zгаргани qайta ishlайди.
- **Har commit** dan oldин: `lint + typecheck` (husky/lint-staged yoki CI).
- **Public API** — har slice/paket faqat `index.ts` orqали ochилади; ichки tuzилма yashiringan.

---

_Xulosa: domain markazда va toza; use-case'lар biznes-mantiqни bir marta ushlайди; bot va web — faqat prezentatsiya; shablonlар va qадаmлар registry orqали kengаyади. Bu — kengayuvchан, testlanadigан, takrorланмайдиган kod._
