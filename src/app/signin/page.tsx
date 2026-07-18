import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <PiggyBank className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          A simple budgeting app for those too lazy for spreadsheets.
        </p>
      </div>
      <SignIn
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
        signUpUrl="/signin"
      />
    </main>
  );
}
