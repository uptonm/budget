"use client";

import { Select as $Select } from "antd";
import { type SelectProps as $SelectProps } from "antd/lib/select";
import { type FieldProps } from "formik";
import * as React from "react";

import Field, {
  type FormikFieldProps,
} from "~/app/_components/shared/form/Field";

/**
 * @see https://github.com/jannikbuschke/formik-antd/blob/master/src/select/index.tsx
 */
export type SelectProps<T = unknown> = React.PropsWithChildren<
  FormikFieldProps & $SelectProps<T>
>;

export const Select = ({
  name,
  validate,
  fast,
  children,
  onChange,
  onBlur,
  ...restProps
}: SelectProps) => {
  return (
    <Field name={name} validate={validate} fast={fast}>
      {({
        field: { value },
        form: { setFieldValue, setFieldTouched },
      }: FieldProps) => (
        <$Select<unknown>
          onChange={async (value, option) => {
            await setFieldValue(name, value);
            onChange && onChange(value, option);
          }}
          onBlur={async (value) => {
            await setFieldTouched(name);
            onBlur && onBlur(value);
          }}
          // setting undefined will show the placeholder
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={value === "" || value === null ? undefined : value}
          {...restProps}
        >
          {children}
        </$Select>
      )}
    </Field>
  );
};

export default Select;

Select.Option = $Select.Option;
Select.OptGroup = $Select.OptGroup;
