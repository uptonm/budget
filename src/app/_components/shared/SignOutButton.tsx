"use client";

import { Button, type ButtonProps } from "antd";
import { signOut } from "next-auth/react";

export function SignOutButton(props: Omit<ButtonProps, "onClick">) {
  return (
    <Button {...props} onClick={() => signOut()}>
      {props.children}
    </Button>
  );
}
