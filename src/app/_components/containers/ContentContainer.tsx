"use client";

import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import type { ReactNode } from "react";

type PageProps = {
  header: string;
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
        <Title level={2} className="mb-0">
          {header}
        </Title>
        {action}
      </Header>
      <Content style={{ margin: "0 16px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        App Router Sandbox ©2023 Created by Mike Upton
      </Footer>
    </Layout>
  );
};
