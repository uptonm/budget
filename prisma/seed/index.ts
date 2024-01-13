import { PrismaClient } from "@prisma/client";

import { seedSystemUser } from "./01_users";
import { seedSystemCategories } from "./02_system_categories";
import { seedRealisticTransactions } from "./03_expenses";

async function main() {
  console.log("Seeding database");

  let exitCode = 0;
  const prisma = new PrismaClient();

  try {
    await seedSystemUser(prisma);
    await seedSystemCategories(prisma);
    await seedRealisticTransactions(prisma);
  } catch (e) {
    console.error(e);
    exitCode = 1;
  } finally {
    await prisma.$disconnect();
    process.exit(exitCode);
  }
}

void main();
