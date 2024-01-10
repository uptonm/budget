import { PrismaClient, $Enums } from "@prisma/client";
const prisma = new PrismaClient();

const systemExpenseCategories = [
  "Home",
  "Transportation",
  "Daily Living",
  "Entertainment",
  "Health",
  "Subscriptions",
];

const systemSavingsCategories = [
  "Emergency Fund",
  "Savings",
  "Retirement",
  "Investments",
  "Education",
  "Travel",
];

const systemIncomeCategories = [
  "Salary / Wages",
  "Interest Income",
  "Dividends",
  "Refunds / Reimbursements",
  "Business",
  "Pension",
  "Misc.",
];

async function main() {
  const systemUser = await prisma.user.upsert({
    where: {
      email: "system@budget.uptonm.dev",
    },
    create: {
      email: "system@budget.uptonm.dev",
      name: "System User",
    },
    update: {},
  });

  systemExpenseCategories.forEach(async (category) => {
    await prisma.category.upsert({
      where: {
        name_type_ownerType_ownerId: {
          name: category,
          ownerId: systemUser.id,
          type: $Enums.TransactionType.EXPENSE,
          ownerType: $Enums.CategoryOwnerType.SYSTEM,
        },
      },
      create: {
        name: category,
        ownerId: systemUser.id,
        type: $Enums.TransactionType.EXPENSE,
        ownerType: $Enums.CategoryOwnerType.SYSTEM,
      },
      update: {},
    });
  });

  systemSavingsCategories.forEach(async (category) => {
    await prisma.category.upsert({
      where: {
        name_type_ownerType_ownerId: {
          name: category,
          ownerId: systemUser.id,
          type: $Enums.TransactionType.SAVINGS,
          ownerType: $Enums.CategoryOwnerType.SYSTEM,
        },
      },
      create: {
        name: category,
        ownerId: systemUser.id,
        type: $Enums.TransactionType.SAVINGS,
        ownerType: $Enums.CategoryOwnerType.SYSTEM,
      },
      update: {},
    });
  });

  systemIncomeCategories.forEach(async (category) => {
    await prisma.category.upsert({
      where: {
        name_type_ownerType_ownerId: {
          name: category,
          ownerId: systemUser.id,
          type: $Enums.TransactionType.INCOME,
          ownerType: $Enums.CategoryOwnerType.SYSTEM,
        },
      },
      create: {
        name: category,
        ownerId: systemUser.id,
        type: $Enums.TransactionType.INCOME,
        ownerType: $Enums.CategoryOwnerType.SYSTEM,
      },
      update: {},
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
