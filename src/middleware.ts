import { clerkMiddleware } from "@clerk/nextjs/server";

import { isAppGated } from "~/lib/gates";

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname;
  const isSignIn = path === "/signin" || path.startsWith("/signin/");

  const gated =
    process.env.VERCEL_ENV === "production" ? await isAppGated() : false;

  if (gated) {
    // Fleet lock: entire site requires a Clerk session.
    await auth.protect();
    return;
  }

  // Normal mode: app is private; /signin stays public.
  if (!isSignIn) {
    await auth.protect({
      unauthenticatedUrl: new URL("/signin", request.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|png|gif|svg|webp|ico|ttf|woff2?|map)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
