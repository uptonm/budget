"use client";

import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { type ComponentType, type SVGProps, forwardRef } from "react";

import CashRegisterSvg from "~/app/_components/shared/icons/cash-register.svg";
import MoneyCheckAltSvg from "~/app/_components/shared/icons/money-check-alt.svg";
import PiggyBankSvg from "~/app/_components/shared/icons/piggy-bank.svg";

type SvgrComponent = ComponentType<
  CustomIconComponentProps | SVGProps<SVGSVGElement>
>;

export const CashRegisterOutlined: typeof Icon = forwardRef<HTMLSpanElement>(
  (props, ref) => (
    <Icon ref={ref} component={CashRegisterSvg as SvgrComponent} {...props} />
  ),
);
CashRegisterOutlined.displayName = "CashRegisterOutlined";

export const MoneyCheckAltOutlined: typeof Icon = forwardRef<HTMLSpanElement>(
  (props, ref) => (
    <Icon ref={ref} component={MoneyCheckAltSvg as SvgrComponent} {...props} />
  ),
);
MoneyCheckAltOutlined.displayName = "MoneyCheckAltOutlined";

export const PiggyBankOutlined: typeof Icon = forwardRef<HTMLSpanElement>(
  (props, ref) => (
    <Icon ref={ref} component={PiggyBankSvg as SvgrComponent} {...props} />
  ),
);
PiggyBankOutlined.displayName = "PiggyBankOutlined";
