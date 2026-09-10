# ECWA Goodnews 1, Masaka

Next.js 16 church website + members / requisitions dashboard. **$0 stack**: Vercel Hobby + free Postgres (Neon/Supabase) + Cloudinary free + Resend free (3k/mo). No Redis, no Sentry, no paid add-ons required.

## Quick start

```bash
cp .env.example .env   # fill JWT_SECRET (32+ chars), DATABASE_URL, DIRECT_URL
pnpm install
pnpm prisma migrate deploy   # or: pnpm prisma migrate dev (local)
pnpm dev
```

Seed settings/users via dashboard (`/dashboard/settings`, `/dashboard/users`). Hash a password locally with `pnpm hash "your-password"` (never commit hashes).

## Scripts

| Command | What |
|---|---|
| `pnpm dev` | Next dev (Turbopack) |
| `pnpm build` | `prisma generate && next build` (Vercel uses this) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | eslint (next core-web-vitals + TS) |
| `pnpm test` | vitest (6 suites, $0, no e2e cloud) |
| `pnpm hash` | local bcrypt helper (`scripts/`) |

CI (`.github/workflows/ci.yml`, free minutes): install → `prisma validate` → typecheck → lint (advisory — upstream `typescript-eslint` crashes on TS 7, pre-existing on main) → test → build.

## Architecture

* `app/(site)/` — public ISR site (`revalidate=3600`): `/`, `/about`, `/sermons/[id]`, `/events/[id]`, `/ministries`, `/gallery`, `/give`, `/visit`, `/staff`, `/contact`. DB-driven via `lib/site.ts` + single-row `Settings{id=1}`.
* `app/(auth)/` — `/login`, `/forgot-password`, `/reset-password`, `/set-password/[token]`.
* `app/(dashboard)/dashboard/` — role-gated (`ADMIN/FINANCE/WORKER/USER`): `members/` (multi-step + tanstack table), `requisitions/` (`SUBMITTED→APPROVED→PAID→COMPLETED`), `users/` (admin), `profile/`, `settings/`.
* `app/api/` — `public/[slug]`, `health` (public, for uptime pings), `fellowships`, `notifications`, `push/subscribe`, `auth/set-password`, `cloudinary-sign` (**auth-required**, folder allowlist).
* `lib/` — `auth.ts` (bcrypt+JWT cookie), `auth-edge.ts` (middleware verifier), `env.ts` (zod boot validation), `rate-limit.ts` (**in-memory, single-node** — documented; no Redis to stay $0), `site.ts`, `prisma.ts`, `push/`, `email/` (Resend), `cloudinary.ts`.

## Auth & security ($0)

* JWT (`7d`) in httpOnly `SameSite=lax` cookie. Edge `proxy.ts` gates `/dashboard`; handlers re-check via `getCurrentUser()` (defense in depth).
* Login/forgot/reset/set-password + `cloudinary-sign` rate-limited in-memory (30-10/hr per user+IP). Resets on redeploy / per Edge instance — accepted tradeoff to avoid paid Redis.
* Security headers in `next.config.mjs` (HSTS, CSP, frame-ancestors none, etc.). Uploads restricted to `members/events/sermons/gallery/receipts`.
* `GET /api/health` is public for Vercel checks; everything else under `/api` (except `/api/public/*`) requires session.

## Vercel Hobby notes (small church)

Fits free tier: ~10GB of 100GB transfer, <100k of 1M invocations, ~9k of 200k ISR writes at 10k pageviews/mo. Gallery/sermon thumbs use plain `<img>` to preserve the 5k image-transform quota. One Vercel owner (Hobby team limit) + in-app roles. Set **Spend Management + 50/80% alerts**; upgrade to Pro ($20) only for team seats or sustained overages.

## Runbook

* Env: copy `.env.example`; `JWT_SECRET` 32+ chars or boot fails with `Invalid environment`.
* DB: Vercel env `DATABASE_URL` (pooled) + `DIRECT_URL` (migrate). Build runs `prisma generate`; set Vercel Build Command to `prisma migrate deploy && next build` if auto-migrating.
* Cron (optional, free 10k/mo): add Vercel Cron hitting an admin cleanup route for expired `PasswordSetupToken` / `resetToken`.
* Backups: enable PITR on Neon/Supabase. Never commit `dev.db` (gitignored).
