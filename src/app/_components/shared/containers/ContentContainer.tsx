"use client";

import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";
import { GithubOutlined } from "@ant-design/icons";

type PageProps = {
  header: ReactNode;
  action?: ReactNode;
};

export const ContentContainer = ({
  header,
  action,
  children,
}: React.PropsWithChildren<PageProps>) => {
  const { token } = theme.useToken();
  return (
    <Layout>
      <Header
        className="flex items-center justify-between px-4 py-2"
        style={{ background: token.colorBgContainer }}
      >
        {header}
        {action}
      </Header>
      <Content style={{ margin: "0 16px" }}>{children}</Content>
      <Footer className="space-x-2 text-center">
        <span>Budget ©2024 Created by</span>
        <a
          target="_blank"
          className="space-x-1"
          href="https://github.com/uptonm"
        >
          <GithubOutlined />
          <span>Mike Upton</span>
        </a>
      </Footer>
    </Layout>
  );
};
