"use client";

import { Spin, Typography } from "antd";

type LoadingDetailProps = {
  title: string;
  description?: string;
};

export function LoadingDetail({ title, description }: LoadingDetailProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Spin size="large" />
      <Typography.Title level={4}>{title}</Typography.Title>
      {description && (
        <Typography.Text type="secondary">{description}</Typography.Text>
      )}
    </div>
  );
}
