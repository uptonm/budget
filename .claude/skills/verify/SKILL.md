---
name: verify
description: Build, run, and drive the budget app locally to verify changes end-to-end
---

# Verifying budget

## Build / launch

```bash
bun run dev -- -p 3210 > /tmp/budget-dev.log 2>&1 &   # ~1s to ready
curl -s -o /dev/null -w "%{http_code}" http://localhost:3210/   # 307 → /signin when anon
```

`.env` points at the **production Neon DB** — never run `db:push`, migrations,
or seeds. Reads are fine; UI-created test rows must be deleted through the UI
afterward.

## Auth handle

Google OAuth can't run headless. Reuse an active DB session token (read-only):

```bash
bun -e 'import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const s = await db.session.findFirst({ where: { expires: { gt: new Date() } } });
console.log(s?.sessionToken); await db.$disconnect();'
```

Set it as the `authjs.session-token` cookie for `localhost` (Playwright
`context.addCookies` or a `Cookie:` header). No active session → BLOCKED; the
user must sign in at budget.uptonm.dev first.

## Drive

Playwright works via `bunx playwright` (chromium already in
`~/.cache/ms-playwright`); install the library in a tmp dir, not the repo.
Flows worth driving: dashboard (charts render, both themes via the user-menu
theme items), expenses/income/savings tables (sort, search, bulk select),
create → edit → delete a `VERIFY-TEST`-named transaction, categories,
bogus edit id (expect 404), anon tRPC call (expect 401).

## Gotchas

- The floating "N" circle bottom-left is the Next 15 dev-tools indicator, not
  an app element.
- Navigating to a server-redirecting page shows `net::ERR_ABORTED` in
  Playwright `goto`; check the landing URL or curl the status instead.
