// One-off PlanetScale → Neon data copy. Delete after cutover.
//
// Requires in .env:
//   PLANETSCALE_DB_URL  mysql://... (temp PlanetScale access)
//   DB_URL              postgresql://... (Neon *direct*, non-pooled)
//
//   bunx prisma generate --schema prisma/schema.mysql.prisma
//   bunx prisma db push
//   bun scripts/migrate-planetscale-to-neon.ts

import { PrismaClient as PostgresClient } from "@prisma/client";
import { PrismaClient as MysqlClient } from "../prisma/generated/mysql-client";

const source = new MysqlClient();
const target = new PostgresClient();

async function main() {
  const users = await source.user.findMany();
  await target.user.createMany({ data: users, skipDuplicates: true });

  const accounts = await source.account.findMany();
  await target.account.createMany({ data: accounts, skipDuplicates: true });

  const sessions = await source.session.findMany();
  await target.session.createMany({ data: sessions, skipDuplicates: true });

  const verificationTokens = await source.verificationToken.findMany();
  await target.verificationToken.createMany({
    data: verificationTokens,
    skipDuplicates: true,
  });

  const categories = await source.category.findMany();
  await target.category.createMany({ data: categories, skipDuplicates: true });

  const transactions = await source.transaction.findMany();
  await target.transaction.createMany({
    data: transactions,
    skipDuplicates: true,
  });

  const counts = [
    ["User", await source.user.count(), await target.user.count()],
    ["Account", await source.account.count(), await target.account.count()],
    ["Session", await source.session.count(), await target.session.count()],
    [
      "VerificationToken",
      await source.verificationToken.count(),
      await target.verificationToken.count(),
    ],
    ["Category", await source.category.count(), await target.category.count()],
    [
      "Transaction",
      await source.transaction.count(),
      await target.transaction.count(),
    ],
  ] as const;

  let mismatched = false;
  for (const [table, sourceCount, targetCount] of counts) {
    const ok = sourceCount === targetCount;
    if (!ok) mismatched = true;
    console.log(
      `${ok ? "✓" : "✗"} ${table}: planetscale=${sourceCount} neon=${targetCount}`,
    );
  }

  if (mismatched) {
    throw new Error("Row counts differ — do not cut over.");
  }
  console.log("All row counts match.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await source.$disconnect();
    await target.$disconnect();
  });
