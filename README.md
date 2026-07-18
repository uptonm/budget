# Budget

A simple budget tracker because I'm too lazy for spreadsheets.

## Stack

Next 15 (App Router) · React 19 · tRPC 11 · Auth.js v5 (Google) · Prisma 6 on
Neon Postgres · Tailwind 4 + shadcn/ui · Recharts · Biome · Bun.

## Development

```bash
bun install
bun run dev        # dev server
bun run typecheck  # tsc --noEmit
bun run check      # biome lint + format check
bun run build      # production build
```

Copy `.env.example` to `.env` and fill it in. Locally use the direct
(non-pooled) Neon connection string; Vercel uses the pooled one.
