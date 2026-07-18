import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";

import { db } from "~/server/db";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type AppSession = {
  user: AppUser;
};

/**
 * Resolve the signed-in Clerk user to a Prisma User row.
 * Links by clerkId, or by email on first login so existing budget data is kept.
 */
export async function auth(): Promise<AppSession | null> {
  const { userId } = await clerkAuth();
  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    null;
  const image = clerkUser.imageUrl ?? null;

  let user = await db.user.findUnique({ where: { clerkId: userId } });

  if (!user && email) {
    const byEmail = await db.user.findUnique({ where: { email } });
    if (byEmail) {
      user = await db.user.update({
        where: { id: byEmail.id },
        data: {
          clerkId: userId,
          name: name ?? byEmail.name,
          image: image ?? byEmail.image,
          emailVerified: byEmail.emailVerified ?? new Date(),
        },
      });
    }
  }

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: userId,
        email,
        name,
        image,
        emailVerified: email ? new Date() : null,
      },
    });
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
}
