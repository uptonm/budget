"use server";

import { api } from "~/trpc/server";
import { ProfilePage } from "~/app/_components/profile/ProfilePage";

export async function ProfilePageServer() {
  const user = await api.user.getCurrentUser.query();

  if (!user) {
    throw new Error("User not found");
  }

  return <ProfilePage user={user} />;
}
