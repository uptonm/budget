# PlanetScale (MySQL) → Neon (Postgres) migration

Date: 2026-07-18. Approved in-session.

## Context

T3 stack (Next.js 14, Prisma 5.8, tRPC, NextAuth). Prisma is the only DB
access layer — no raw SQL anywhere in `src/`. No `prisma/migrations` history
(`db push` workflow). The app reads a single `DB_URL` env var. Neon project
already exists and is linked to the Vercel project.

## Decisions

- **Keep `DB_URL` as the env var name.** Vercel gets the Neon *pooled*
  connection string; local dev and `db push` use the *direct* (unpooled) one.
- **No `@prisma/adapter-neon`.** Plain Prisma over the pooled connection
  string works on Prisma 5.8; the driver adapter is preview and unneeded.
- **Drop `relationMode = "prisma"`.** It existed only because PlanetScale has
  no foreign keys. Neon enforces real FKs. Existing `@@index` lines stay.
- **Data copy: one-off TypeScript script with two Prisma clients** (chosen
  over pgloader / dump+transform). A second schema,
  `prisma/schema.mysql.prisma`, points at PlanetScale and generates a client
  into a gitignored dir. The script copies in FK-safe order — User, Account,
  Session, VerificationToken, Category, Transaction — then prints per-table
  row counts from both sides for verification. All data migrates, including
  sessions.

## Cutover

1. `prisma db push` against Neon (direct URL) → empty Postgres schema.
2. Run the copy script; confirm row counts match.
3. Set `DB_URL` in Vercel to the pooled Neon string; redeploy.
4. Smoke-test Google sign-in and transaction lists; retire PlanetScale.

## Risks

- Real FK constraints mean orphaned rows in PlanetScale (never enforced by
  MySQL) fail the copy loudly. The script surfaces which table; fix or skip
  case-by-case.
- Copy runs while the app is quiescent (~seconds of data volume; personal
  app, so just don't use it during the copy).
