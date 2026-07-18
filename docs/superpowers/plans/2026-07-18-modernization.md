# Budget Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the budget app to Bun + Next 15 + tRPC 11 + Auth.js v5 + Tailwind 4 + shadcn/ui, replacing antd/ag-grid/Formik/moment, and ship a real dashboard with charts.

**Architecture:** Server layer (Prisma schema, tRPC routers) upgrades in place; UI layer is rebuilt wholesale on shadcn. One branch (`modernize-2026`), one PR. No DB schema changes.

**Tech Stack:** Bun, Next 15, React 19, tRPC 11, TanStack Query 5, Auth.js v5, Prisma 6, Tailwind 4, shadcn/ui, TanStack Table 8, react-hook-form, Recharts, Biome, date-fns, lucide-react.

## Global Constraints

- **Never run `prisma db push`, migrations, or seeds** — local `.env` points at the production Neon DB (`DB_URL`).
- TypeScript only; Bun for all package/script operations; Biome for lint/format.
- Existing route URLs are preserved (`/`, `/expenses`, `/income`, `/savings`, `/categories`, `/profile`, plus `/create` and `/edit/[id]` subroutes).
- Auth DB table shapes unchanged (Auth.js v5 keeps NextAuth schema).
- Charts follow the dataviz skill (palette, form, dark-mode-safe).
- After each phase: `bun run typecheck` and `bun run build` must pass; commit per phase or smaller.

---

### Task 1: Toolchain — Bun + Biome + dependency upgrades

**Files:**
- Modify: `package.json` (packageManager → bun, scripts, all deps)
- Delete: `yarn.lock`, `.eslintrc.cjs`/eslint config, `prettier.config.mjs`
- Create: `biome.json`
- Modify: `next.config.mjs` → simplify (drop SVGR webpack block once icons move to lucide in Task 4; keep for now)

**Steps:**

- [ ] `git rm yarn.lock`; set `"packageManager": "bun@1.3.14"`.
- [ ] Upgrade with bun: `bun add next@latest react@latest react-dom@latest @trpc/client@latest @trpc/server@latest @trpc/react-query@latest @tanstack/react-query@latest superjson zod @t3-oss/env-nextjs @prisma/client uploadthing @uploadthing/react @vercel/analytics @vercel/speed-insights` and dev deps `prisma typescript @types/node @types/react @types/react-dom`.
  - Note: `@trpc/next` is dropped in v11 usage here — app router uses `@trpc/react-query` + a server caller only.
- [ ] Remove ESLint/Prettier packages; `bun add -d @biomejs/biome`; write `biome.json` (recommended rules, organize imports, 2-space, double quotes to match existing code).
- [ ] Scripts: `dev`, `build`, `start` (next), `typecheck: tsc --noEmit`, `check: biome check .`, `db:studio`. `db:push`/`db:seed` remain but are not run.
- [ ] tRPC v11 migration: update `src/trpc/*` to v11 idioms (`createTRPCReact` stays; `httpBatchLink` with `transformer` moved into link options; server caller via `createCallerFactory`). TanStack Query v5: `isLoading`→`isPending` where used, object-syntax hooks.
- [ ] `bun run typecheck && bun run build` green (SKIP_ENV_VALIDATION=true acceptable for build if needed). Commit.

**Produces:** working Next 15/React 19/tRPC 11 app, still antd-styled.

### Task 2: Auth.js v5

**Files:**
- Rewrite: `src/server/auth.ts` → `NextAuth()` config export (`auth`, `handlers`, `signIn`, `signOut`)
- Modify: `src/app/api/auth/[...nextauth]/route.ts` → `export const { GET, POST } = handlers`
- Modify: `src/server/api/trpc.ts` (session via `auth()`), `src/env.mjs` (`AUTH_SECRET` fallback to `NEXTAUTH_SECRET`), any `getServerAuthSession` callers, `SessionProvider`/`useSession` client bits.

**Key code:**

```ts
// src/server/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  callbacks: {
    session: ({ session, user }) => ({ ...session, user: { ...session.user, id: user.id } }),
  },
});
```

- [ ] Swap `@next-auth/prisma-adapter` → `@auth/prisma-adapter`, `next-auth@beta` (v5).
- [ ] Module augmentation for `session.user.id` kept.
- [ ] Env: Google creds map to `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` or stay explicit in provider config (stay explicit — no env rename, prod Vercel env untouched).
- [ ] Typecheck + build + commit.

**Produces:** `auth()` server helper used by tRPC context and pages.

### Task 3: Tailwind 4 + shadcn foundation + app shell

**Files:**
- Rewrite: `src/styles/globals.css` (Tailwind 4 `@import "tailwindcss"` + shadcn theme vars, OKLCH)
- Delete: `tailwind.config.ts`, `postcss.config.cjs` → `postcss.config.mjs` with `@tailwindcss/postcss`
- Create: `components.json`, `src/components/ui/*` (via `bunx shadcn@latest add`), `src/lib/utils.ts` (`cn`)
- Rewrite: `src/app/layout.tsx` (drop antd ConfigProvider + StyledComponentsRegistry; add ThemeProvider, Toaster)
- Create: `src/components/app-sidebar.tsx`, `src/components/theme-toggle.tsx`, sign-in page redesign
- Delete: `src/lib/StyledComponentsRegistry.tsx`, antd containers as they're replaced

- [ ] `bun add tailwindcss@latest @tailwindcss/postcss next-themes; bunx shadcn@latest init` (new-york, neutral base, CSS variables).
- [ ] Add components: button card input select dialog dropdown-menu table badge sonner sidebar avatar form calendar popover skeleton tooltip separator chart alert-dialog command sheet.
- [ ] App shell: `SidebarProvider` layout with nav (Dashboard/Expenses/Income/Savings/Categories), footer user menu (avatar, profile link, theme toggle, sign out).
- [ ] `ProtectedRoute` reimplemented as server-side `auth()` check + redirect in a shared layout.
- [ ] Typecheck + build + commit (pages may look broken mid-flight; commit at working shell).

### Task 4: Rebuild tables & forms; remove legacy libs

**Files:**
- Create: `src/components/data-table.tsx` (generic TanStack DataTable), `src/components/transactions/transaction-table.tsx`, `transaction-form.tsx`, `src/components/categories/category-table.tsx`, `category-form.tsx`, `src/components/confirm-delete.tsx`
- Rewrite: pages under `src/app/{expenses,income,savings,categories}` (+ create/edit) and `src/app/profile`
- Delete: `src/app/_components/**` legacy antd components, custom SVGR icons
- Modify: `package.json` — remove `antd @ant-design/icons ag-grid-community ag-grid-react formik moment classnames @svgr/webpack`; `next.config.mjs` drops SVGR block

- [ ] Transaction form schema (zod) mirrors tRPC input; react-hook-form + zodResolver; calendar picker (date-fns), category combobox filtered by type, currency input.
- [ ] DataTable: sorting, global text filter, category filter, row actions dropdown (edit → route, delete → alert-dialog → tRPC mutation + toast + invalidate).
- [ ] Currency via existing `src/lib/currencyUtils.ts` (keep), dates via `Intl.DateTimeFormat`/date-fns.
- [ ] Remove legacy deps, verify no imports remain (`grep -r "antd\|formik\|moment\|ag-grid"` clean).
- [ ] Typecheck + build + commit.

### Task 5: Dashboard router + charts

**Files:**
- Create: `src/server/api/dashboard.ts`; register in `src/server/api/root.ts`
- Rewrite: `src/app/page.tsx` + `src/components/dashboard/*` (stat tiles, cash-flow chart, category breakdown, recent list, upcoming recurring)

**Router sketch:**

```ts
export const dashboardRouter = createTRPCRouter({
  monthlyCashFlow: protectedProcedure.query(({ ctx }) =>
    ctx.db.$queryRaw`
      SELECT date_trunc('month', "date") AS month, "type", SUM("amount")::float AS total
      FROM "Transaction"
      WHERE "userId" = ${ctx.session.user.id} AND "date" >= now() - interval '12 months'
      GROUP BY 1, 2 ORDER BY 1`),
  categoryBreakdown: protectedProcedure.query(...),   // groupBy categoryId, month-to-date expenses
  recentTransactions: protectedProcedure.query(...),  // latest 8, include Category
  upcomingRecurring: protectedProcedure.query(...),   // recurring txns projected into next 14 days
});
```

- [ ] Read dataviz skill before writing chart code; use shadcn `ChartContainer` + Recharts (bar chart for cash flow, donut/horizontal-bar for categories) with CSS-var palette valid in light and dark.
- [ ] Stat tiles compute this-month vs last-month deltas from `monthlyCashFlow`.
- [ ] Typecheck + build + commit.

### Task 6: Verify end-to-end, polish, PR

- [ ] `bun run check` (biome), `bun run typecheck`, `bun run build` all green.
- [ ] Drive real app (`bun run dev`): sign-in flow, CRUD each transaction type, categories, dashboard with real data, dark mode, narrow viewport.
- [ ] Screenshot key pages for the PR.
- [ ] Update `README.md` (bun commands) and `.env.example` if envs changed.
- [ ] Push branch, open PR with summary + screenshots. **Do not merge** — merging deploys to prod.
