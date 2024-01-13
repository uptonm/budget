import { type $Enums, type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

import { SYSTEM_USER_EMAIL } from "../01_users";
import realisticTransactions from "./data/realistic_transactions.json";

export async function seedRealisticTransactions(
  client: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): Promise<void> {
  try {
    console.log("Seeding realistic transactions");
    const systemUser = await client.user.findUniqueOrThrow({
      where: {
        email: SYSTEM_USER_EMAIL,
      },
    });

    const systemCategories = await client.category.findMany({});
    const systemCategoryMap = new Map(
      systemCategories.map((category) => [category.name, category.id]),
    );

    // check if we have inserted any of the transactions already, and if so, skip them
    let skippedCount = 0;
    const transactionsToAdd = [];

    for (const transaction of realisticTransactions) {
      const type = transaction.type as $Enums.TransactionType;
      const frequency = transaction.frequency as $Enums.TransactionFrequency;
      const categoryId = systemCategoryMap.get(transaction.category);

      if (!categoryId) {
        throw new Error(
          `Could not find category with name ${transaction.category}`,
        );
      }

      const existingTransaction = await client.transaction.findFirst({
        where: {
          type,
          frequency,
          date: new Date(transaction.date),
          userId: systemUser.id,
          name: transaction.name,
          amount: transaction.amount,
          categoryId: categoryId,
        },
      });

      if (existingTransaction) {
        skippedCount++;
        console.log(
          `Skipping existing transaction ${skippedCount}/${realisticTransactions.length}`,
        );
        continue;
      }

      transactionsToAdd.push(transaction);
    }

    await client.$transaction([
      ...transactionsToAdd.map((transaction) => {
        const type = transaction.type as $Enums.TransactionType;
        const frequency = transaction.frequency as $Enums.TransactionFrequency;
        const categoryId = systemCategoryMap.get(transaction.category);

        if (!categoryId) {
          throw new Error(
            `Could not find category with name ${transaction.category}`,
          );
        }

        return client.transaction.create({
          data: {
            type,
            frequency,
            date: new Date(transaction.date),
            userId: systemUser.id,
            name: transaction.name,
            amount: transaction.amount,
            categoryId: categoryId,
          },
        });
      }),
    ]);
  } catch (e) {
    console.error("Error seeding realistic transactions", { error: e });
    throw e;
  }
}
