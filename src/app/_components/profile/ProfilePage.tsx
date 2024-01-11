"use client";

import type { User } from "@prisma/client";
import { Avatar, Descriptions, Tabs, Typography } from "antd";
import Title from "antd/es/typography/Title";

import { SignOutButton } from "~/app/_components/shared/SignOutButton";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";

type ProfilePageProps = {
  user: User;
};

export function ProfilePage(props: ProfilePageProps) {
  return (
    <ContentContainer
      header={
        <div className="flex items-center space-x-4">
          <Avatar size={48} src={props.user.image} />
          <Title level={2} className="mb-0">
            {props.user.name}
          </Title>
        </div>
      }
      action={<SignOutButton type="primary">Sign Out</SignOutButton>}
    >
      <Tabs defaultActiveKey="profile">
        <Tabs.TabPane tab="Profile" key="profile">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {props.user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {props.user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              <Avatar size={64} src={props.user.image} />
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Settings" key="settings">
          <Typography.Text>Coming Soon</Typography.Text>
        </Tabs.TabPane>
      </Tabs>
    </ContentContainer>
  );
}
