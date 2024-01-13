"use client";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { type DropdownButtonProps } from "antd/es/dropdown";
import { useMemo } from "react";
import { useBoolean } from "../hooks/UseBoolean";

type SubmitButtonProps = Omit<DropdownButtonProps, "items" | "onClick"> & {
  onSubmit: (shouldClose: boolean) => void;
};

export function SubmitButton({ onSubmit, ...props }: SubmitButtonProps) {
  const { value: shouldClose, toggle: toggleShouldClose } = useBoolean({
    defaultValue: false,
  });

  const items = useMemo(() => {
    return shouldClose
      ? [{ key: "submit", label: "Submit" }]
      : [{ key: "submit-and-close", label: "Submit and close" }];
  }, [shouldClose]);

  return (
    <Dropdown.Button
      {...props}
      menu={{
        items,
        onClick: toggleShouldClose,
      }}
      icon={<DownOutlined />}
      onClick={() => onSubmit(shouldClose)}
    >
      {shouldClose ? "Submit and close" : "Submit"}
    </Dropdown.Button>
  );
}
