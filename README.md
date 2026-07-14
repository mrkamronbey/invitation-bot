# invitation-bot — Elektron to'y taklifnoma platformasi

Telegram bot orqali yaratiladigan, chiroyli web sahifada ochiladigan to'y
taklifnomalari + RSVP. O'zbekiston bozori uchun.

> Loyiha hujjatlari: [`docs/TZ.md`](./docs/TZ.md) · [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) · [`docs/MARKET.md`](./docs/MARKET.md)

## Arxitektura

Clean Architecture + Ports & Adapters. Biznes-mantiq bir marta yoziladi —
bot ham web ham qayta ishlatadi. Bog'liqlik faqat ichkariga:
`presentation → application → domain ← infrastructure`.

```
packages/
  domain/          # yadro: entities, value-objects, ports (hech narsaga bog'liq emas)
  application/     # use-case'lar (CreateInvitation, SubmitRsvp, ...)
  infrastructure/  # Supabase adapterlari (portlarni amalga oshiradi)
  contracts/       # Zod sxemalar + DTO (bot + web umumiy)
  i18n/            # barcha matnlar (uz)
apps/
  web/             # Next.js (FSD) — keyingi bosqich
  bot/             # grammY — keyingi bosqich
supabase/
  migrations/      # SQL sxema + RLS
```

## Ishga tushirish

```bash
pnpm install
pnpm typecheck   # barcha paketlarni tekshirish
pnpm lint
pnpm format
```

Node ≥ 22, pnpm 10. Sirlar uchun `.env.example` ni `.env` ga nusxalang.

## Holat (roadmap)

- [x] **Bosqich 0** — monorepo poydevori: domain / application / infrastructure /
      contracts / i18n, Supabase migratsiya, tooling.
- [ ] **Bosqich 1** — bitta shablon + namuna taklifnoma, Vercel deploy.
- [ ] **Bosqich 2** — bot yaratish oqimi (grammY FSM).
- [ ] **Bosqich 3** — RSVP oqimi (web forma + bot xabari).
- [ ] **Bosqich 4** — boyitish (shablonlar, countdown, xarita, galereya, musiqa).
- [ ] **Bosqich 5** — monetizatsiya (Telegram Stars) + ko'p til.
