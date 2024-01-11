"use client";

import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { type ComponentType, type SVGProps, forwardRef } from "react";

import CashRegisterSvg from "~/app/_components/shared/icons/cash-register-outlined.svg";

type SvgrComponent = ComponentType<
  CustomIconComponentProps | SVGProps<SVGSVGElement>
>;

export const CashRegisterOutlined: typeof Icon = forwardRef<HTMLSpanElement>(
  (props, ref) => (
    <Icon ref={ref} component={CashRegisterSvg as SvgrComponent} {...props} />
  ),
);
CashRegisterOutlined.displayName = "CashRegisterOutlined";
