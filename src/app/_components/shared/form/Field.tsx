"use client";

import { Field as FormikField, FastField, type FieldProps } from "formik";
import * as React from "react";

/**
 * @see https://github.com/jannikbuschke/formik-antd/blob/master/src/FieldProps.tsx
 */
export interface FormikFieldProps {
  name: string;
  validate?: (value: unknown) => undefined | string | Promise<unknown>;
  fast?: boolean;
  children?: (props: FieldProps) => React.ReactNode;
}

/**
 * @see https://github.com/jannikbuschke/formik-antd/blob/master/src/field/index.tsx
 */
export const Field: React.FC<FormikFieldProps> = ({
  fast,
  children,
  ...restProps
}) => {
  if (fast) {
    return <FastField {...restProps}>{children}</FastField>;
  }

  return <FormikField {...restProps}>{children}</FormikField>;
};

export default Field;
