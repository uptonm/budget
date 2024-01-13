import { $Enums, type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

import { SYSTEM_USER_EMAIL } from "../01_users";
import systemExpenseCategories from "./data/expenses.json";
import systemSavingsCategories from "./data/savings.json";
import systemIncomeCategories from "./data/income.json";

export async function seedSystemCategories(
  client: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): Promise<void> {
  try {
    console.log("Seeding system categories");
    const systemUser = await client.user.findUniqueOrThrow({
      where: {
        email: SYSTEM_USER_EMAIL,
      },
    });

    await client.$transaction([
      ...systemExpenseCategories.map((category) =>
        client.category.upsert({
          where: {
            name_type_ownerType_ownerId: {
              name: category.name,
              ownerId: systemUser.id,
              type: $Enums.TransactionType.EXPENSE,
              ownerType: $Enums.CategoryOwnerType.SYSTEM,
            },
          },
          create: {
            name: category.name,
            ownerId: systemUser.id,
            type: $Enums.TransactionType.EXPENSE,
            ownerType: $Enums.CategoryOwnerType.SYSTEM,
          },
          update: {},
        }),
      ),
      ...systemSavingsCategories.map((category) =>
        client.category.upsert({
          where: {
            name_type_ownerType_ownerId: {
              name: category.name,
              ownerId: systemUser.id,
              type: $Enums.TransactionType.SAVINGS,
              ownerType: $Enums.CategoryOwnerType.SYSTEM,
            },
          },
          create: {
            name: category.name,
            ownerId: systemUser.id,
            type: $Enums.TransactionType.SAVINGS,
            ownerType: $Enums.CategoryOwnerType.SYSTEM,
          },
          update: {},
        }),
      ),
      ...systemIncomeCategories.map((category) =>
        client.category.upsert({
          where: {
            name_type_ownerType_ownerId: {
              name: category.name,
              ownerId: systemUser.id,
              type: $Enums.TransactionType.INCOME,
              ownerType: $Enums.CategoryOwnerType.SYSTEM,
            },
          },
          create: {
            name: category.name,
            ownerId: systemUser.id,
            type: $Enums.TransactionType.INCOME,
            ownerType: $Enums.CategoryOwnerType.SYSTEM,
          },
          update: {},
        }),
      ),
    ]);
  } catch (e) {
    console.error("Error seeding system categories", { error: e });
    throw e;
  }
}
