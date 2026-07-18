# Budget Modernization — Design

**Date:** 2026-07-18
**Goal:** Bring the 2024-era T3 app into 2026: Bun toolchain, current
dependencies, shadcn/ui in place of Ant Design, a real dashboard with charts,
and a UI that doesn't look like a default admin template.

## Context

Current stack: Next 14 (App Router) · React 18 · tRPC 10 · TanStack Query 4 ·
NextAuth 4 · Prisma 5 on Neon Postgres · Ant Design 5 + ag-grid + Formik +
moment · yarn 1 · ESLint + Prettier. Deployed at budget.uptonm.dev via Vercel;
merges to `main` deploy.

Data model (Users, Categories, Transactions with type EXPENSE/SAVINGS/INCOME,
recurrence frequency, `isProjected`) is sound and **does not change**. The
tRPC server layer is thin CRUD and survives with version bumps. The UI layer
is the bulk of the work.

## Approaches considered

1. **Full UI-layer rebuild on one branch, server layer upgraded in place**
   *(chosen)*. Ant Design and shadcn cannot coexist without shipping two
   design systems; the app is ~10 routes, small enough to rebuild wholesale.
   Server routers, Prisma schema, and auth data survive.
2. Incremental page-by-page migration — ships antd + shadcn together for
   weeks, double bundle, mixed look. Rejected.
3. Fresh `create-t3-app` scaffold and port — churns files that are fine,
   loses history granularity. Rejected.

## Target stack

| Concern | Now | Target |
|---|---|---|
| Package manager / scripts | yarn 1 | **Bun** |
| Framework | Next 14 / React 18 | **Next 15 / React 19** |
| API | tRPC 10 / RQ 4 | **tRPC 11 / TanStack Query 5** |
| Auth | NextAuth 4 | **Auth.js v5** (`@auth/prisma-adapter`, same DB schema) |
| ORM | Prisma 5 | **Prisma 6** (no schema change) |
| Styling | Tailwind 3 + antd + styled-components registry | **Tailwind 4 (CSS-first) + shadcn/ui (new-york) + next-themes** |
| Tables | ag-grid | **TanStack Table 8** (shadcn DataTable) |
| Forms | Formik | **react-hook-form + zod** (shadcn Form) |
| Dates | moment | **date-fns** + `Intl` |
| Icons | @ant-design/icons + custom SVGR | **lucide-react** |
| Charts | none | **Recharts** via shadcn chart primitives |
| Lint/format | ESLint + Prettier | **Biome** |
| Uploads | uploadthing 6 | uploadthing 7 |

Removed outright: `antd`, `@ant-design/icons`, `ag-grid-*`, `formik`,
`moment`, `classnames`, `StyledComponentsRegistry`, `@svgr/webpack` (icons
come from lucide), ESLint/Prettier toolchain.

Next.js keeps running on Node (Vercel); Bun is the package manager and script
runner. `zod` upgrades as far as tRPC 11 + t3-env allow without friction (v4
preferred, 3.25.x acceptable fallback).

## UI/UX design

**App shell:** shadcn sidebar (collapsible, icons + labels) replacing the antd
Sider — Dashboard, Expenses, Income, Savings, Categories; user menu at the
bottom (avatar, profile, theme toggle, sign out). Dark mode is first-class via
CSS variables; system default with manual override.

**Transaction pages (expenses/income/savings):** DataTable with column
sorting, text search, category filter, currency-formatted amounts,
badge-styled frequency, row actions (edit/delete with confirm dialog).
Create/edit stay as routes (existing URL structure) but the forms become
react-hook-form + zod with shadcn fields, calendar date picker, and category
combobox.

**Categories:** same treatment; system-owned categories visibly badged and
not editable.

**Dashboard (new — replaces the placeholder):**
- Four stat tiles: this month's income, expenses, savings, and net, each with
  delta vs. last month.
- Monthly cash flow: 12-month grouped/stacked bar (income vs. expenses vs.
  savings).
- Category breakdown: current-month expense composition (donut or horizontal
  bar, per dataviz guidance).
- Recent transactions list + upcoming recurring items in the next two weeks
  (derived from frequency + last occurrence).

New tRPC endpoints on a `dashboard` router: `monthlyCashFlow` (12 months of
sums grouped by month × type), `categoryBreakdown` (period expense totals per
category), `recentTransactions`, `upcomingRecurring`. All scoped to the
session user; aggregation in SQL via Prisma `groupBy`.

**Charts follow the dataviz skill** (form, palette, axes, tooltips,
dark-mode-safe colors).

## Error handling & data safety

- No schema changes, no migrations, no `db:push`, no seeding — the local
  `.env` points at the production Neon database.
- Auth v5 keeps the NextAuth Prisma table shapes; existing sessions/accounts
  keep working.
- tRPC errors surface as toasts (shadcn sonner); ownership checks in routers
  stay as-is.

## Testing & verification

- `bun run typecheck` (new script), `biome check`, `bun run build` all green.
- Manual drive of the real app: sign-in, CRUD on each transaction type,
  category CRUD, dashboard renders with real aggregates, dark mode, mobile
  viewport sanity.
- Work lands on branch `modernize-2026` → PR. No merge without user review;
  prod deploys only on merge.

## Out of scope

Budget-vs-actual targets, CSV import, multi-currency, new auth providers,
upload flow redesign (version bump only), mobile app.
