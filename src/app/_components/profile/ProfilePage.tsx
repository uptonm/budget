"use client";

import { UploadOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar, Button, Descriptions, Tabs, Typography, Upload } from "antd";
import Title from "antd/es/typography/Title";
import type { UploadFile } from "antd/lib";
import { useState } from "react";

import { SignOutButton } from "~/app/_components/shared/SignOutButton";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { useUploadThing } from "~/lib/upload";
import { api } from "~/trpc/react";

type ProfilePageProps = {
  user: User;
};

export function ProfilePage(props: ProfilePageProps) {
  const [user, setUser] = useState<User>(props.user);
  const [imageFile, setImageFile] = useState<UploadFile>();

  const { isLoading: profileLoading, refetch } =
    api.user.getCurrentUser.useQuery(undefined, {
      onSuccess: (userData) => {
        if (userData) {
          setUser(userData);
        }
      },
    });

  const { mutateAsync: updateProfileImageFn, isLoading: updatingProfileImage } =
    api.user.updateProfileImage.useMutation();

  const { isUploading, startUpload } = useUploadThing("uploadProfileImage", {
    onClientUploadComplete: (res) => {
      updateProfileImageFn({ imageUrl: res.at(0)!.url })
        .then(() => {
          setImageFile(undefined);
          void refetch();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  return (
    <ContentContainer
      header={
        <div className="flex items-center space-x-4">
          <Avatar size={48} src={user.image} />
          <Title level={2} className="mb-0">
            {user.name}
          </Title>
        </div>
      }
      action={<SignOutButton type="primary">Sign Out</SignOutButton>}
    >
      <Tabs
        defaultActiveKey="profile"
        items={[
          {
            key: "profile",
            label: "Profile",
            children: (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Image">
                  <div className="flex items-center justify-between">
                    <Avatar size={64} src={user.image} />
                    <Upload
                      accept="image/*"
                      fileList={imageFile ? [imageFile] : []}
                      onChange={(info) => setImageFile(info.file)}
                      disabled={isUploading || profileLoading}
                      beforeUpload={(file) => {
                        void startUpload([file]);
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />} loading={isUploading}>
                        {isUploading
                          ? "Uploading image..."
                          : updatingProfileImage
                          ? "Finishing up..."
                          : "Change Image"}
                      </Button>
                    </Upload>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            ),
          },
          {
            key: "settings",
            label: "Settings",
            children: <Typography.Text>Coming Soon</Typography.Text>,
          },
        ]}
      />
    </ContentContainer>
  );
}
