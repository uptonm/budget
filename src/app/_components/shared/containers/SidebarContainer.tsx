"use client";

import {
  Loading3QuartersOutlined,
  HomeOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import {
  CashRegisterOutlined,
  MoneyCheckAltOutlined,
  PiggyBankOutlined,
} from "../icons";

type MenuItem = Required<MenuProps>["items"][number];

function makeSidebarItem(
  label: React.ReactNode,
  pathname: string,
  push: (pathname: string) => void,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key: pathname,
    icon,
    children,
    label,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onClick: () => push(pathname),
  } as MenuItem;
}

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(true);

  const changePath = useCallback(
    (pathname: string) => {
      router.push(pathname);
    },
    [router],
  );

  const navigationMenuItems: MenuItem[] = useMemo(
    () => [
      makeSidebarItem("Home", "/", changePath, <HomeOutlined />),
      makeSidebarItem(
        "Categories",
        "/categories",
        changePath,
        <TagsOutlined />,
      ),
      makeSidebarItem(
        "Expenses",
        "/expenses",
        changePath,
        <CashRegisterOutlined />,
      ),
      makeSidebarItem(
        "Income",
        "/income",
        changePath,
        <MoneyCheckAltOutlined />,
      ),
      makeSidebarItem("Savings", "/savings", changePath, <PiggyBankOutlined />),
    ],
    [changePath],
  );

  const userMenuItems: MenuItem[] = useMemo(() => {
    if (!session) {
      return [];
    }

    switch (session.status) {
      case "loading": {
        return [
          {
            key: "loading",
            label: "Loading...",
            disabled: true,
            icon: <Loading3QuartersOutlined spin />,
          },
        ];
      }
      case "unauthenticated": {
        return [
          {
            key: "unauthenticated",
            label: "Sign In",
            onClick: () => changePath("/api/auth/signin"),
            icon: <UserOutlined />,
          },
        ];
      }
      case "authenticated": {
        return [
          {
            key: "authenticated",
            icon: (
              <Link href="/profile">
                <Avatar
                  className="-ml-1.5"
                  src={session.data.user.image}
                  alt={session.data.user.name ?? "Profile Image"}
                />
              </Link>
            ),
            label: session.data.user.name,
          },
        ];
      }
    }
  }, [session, changePath]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      className="flex h-screen flex-col"
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        mode="inline"
        className="flex flex-grow flex-col"
        selectedKeys={[pathname]}
        items={[
          ...navigationMenuItems,
          {
            key: "spacer",
            className: "flex-grow",
            disabled: true,
          },
          ...userMenuItems,
        ]}
      />
    </Sider>
  );
};

export const SidebarContainer = ({ children }: React.PropsWithChildren) => (
  <Layout style={{ minHeight: "100vh" }} hasSider>
    <Sidebar />
    {children}
  </Layout>
);
