import { auth as clerkAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await clerkAuth();
  if (!userId) {
    redirect("/signin");
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
