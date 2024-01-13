import { InputNumber as $InputNumber } from "antd";
import { type InputNumberProps as $InputNumberProps } from "antd/lib/input-number";
import { type FieldProps } from "formik";
import {
  Field,
  type FormikFieldProps,
} from "~/app/_components/shared/form/Field";

export type InputNumberProps = FormikFieldProps & $InputNumberProps<number>;

export const InputNumber = ({
  name,
  validate,
  fast,
  onChange: $onChange,
  onBlur: $onBlur,
  ...restProps
}: InputNumberProps) => (
  <Field name={name} validate={validate} fast={fast}>
    {({ field: { value, onBlur }, form: { setFieldValue } }: FieldProps) => (
      <$InputNumber
        name={name}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value={value}
        onChange={(value) => {
          void setFieldValue(name, value);
          $onChange && $onChange(value);
        }}
        onBlur={(event) => {
          onBlur(event);
          $onBlur && $onBlur(event);
        }}
        {...restProps}
      />
    )}
  </Field>
);
