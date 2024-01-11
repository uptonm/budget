"use client";

import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";

export function ClientContainer({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
