import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

export const SYSTEM_USER_EMAIL = "system@budget.uptonm.dev";
const SYSTEM_USER_NAME = "System User";

export async function seedSystemUser(
  client: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): Promise<void> {
  try {
    console.log("Seeding system user");
    await client.user.upsert({
      where: {
        email: SYSTEM_USER_EMAIL,
      },
      create: {
        email: SYSTEM_USER_EMAIL,
        name: SYSTEM_USER_NAME,
      },
      update: {},
    });
  } catch (e) {
    console.error("Error seeding system user", { error: e });
    throw e;
  }
}
