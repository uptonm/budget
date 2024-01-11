"use client";

import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { signIn } from "next-auth/react";

export function ProtectedRoute(props: PropsWithChildren) {
  const session = useSession();

  switch (session.status) {
    case "loading": {
      return null;
    }
    case "unauthenticated": {
      void signIn();
      return <></>;
    }
    case "authenticated": {
      return <>{props.children}</>;
    }
  }
}
