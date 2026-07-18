import { notFound } from "next/navigation";

import { PageHeader } from "~/components/page-header";
import { ProfileCard } from "~/components/profile/profile-card";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const user = await api.user.getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Profile" />
      <main className="flex-1 p-4">
        <ProfileCard user={user} />
      </main>
    </>
  );
}
