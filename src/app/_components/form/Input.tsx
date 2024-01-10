"use client";

import { Input as $Input } from "antd";
import type {
  InputProps as $InputProps,
  PasswordProps as $PasswordProps,
  TextAreaProps as $TextAreaProps,
  InputRef,
} from "antd/lib/input";
import type { TextAreaRef } from "antd/lib/input/TextArea";
import type { FieldProps } from "formik";
import * as React from "react";

import { Field, type FormikFieldProps } from "~/app/_components/form/Field";

/**
 * @see https://github.com/jannikbuschke/formik-antd/blob/master/src/input/index.tsx
 */
export type InputProps = FormikFieldProps & $InputProps;

interface InputType
  extends React.ForwardRefExoticComponent<
    FormikFieldProps & $InputProps & React.RefAttributes<InputRef>
  > {
  Password: React.ForwardRefExoticComponent<
    FormikFieldProps & $PasswordProps & React.RefAttributes<InputRef>
  >;
  TextArea: React.ForwardRefExoticComponent<
    FormikFieldProps & $TextAreaProps & React.RefAttributes<TextAreaRef>
  >;
}

const Input = React.forwardRef(
  (
    {
      name,
      validate,
      fast,
      onChange: $onChange,
      onBlur: $onBlur,
      ...restProps
    }: InputProps,
    ref: React.Ref<InputRef>,
  ) => {
    return (
      <Field name={name} validate={validate} fast={fast}>
        {({ field: { value, onChange, onBlur } }: FieldProps) => (
          <$Input
            ref={ref}
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value={value}
            onChange={(event) => {
              onChange(event);
              $onChange && $onChange(event);
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
  },
);
Input.displayName = "Input";

const TypedInput = Input as unknown as InputType;

TypedInput.Password = React.forwardRef(
  (
    {
      name,
      validate,
      fast,
      onChange: $onChange,
      onBlur: $onBlur,
      ...restProps
    }: PasswordProps,
    ref: React.Ref<InputRef>,
  ) => (
    <Field name={name} validate={validate} fast={fast}>
      {({ field: { value, onChange, onBlur } }: FieldProps) => (
        <$Input.Password
          ref={ref}
          name={name}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={value}
          onChange={(event) => {
            onChange(event);
            $onChange && $onChange(event);
          }}
          onBlur={(event) => {
            onBlur(event);
            $onBlur && $onBlur(event);
          }}
          {...restProps}
        />
      )}
    </Field>
  ),
);
TypedInput.Password.displayName = "Input.Password";

TypedInput.TextArea = React.forwardRef(
  (
    {
      name,
      validate,
      fast,
      onChange: $onChange,
      onBlur: $onBlur,
      ...restProps
    }: TextAreaProps,
    ref: React.Ref<TextAreaRef>,
  ) => (
    <Field name={name} validate={validate} fast={fast}>
      {({ field: { value, onChange, onBlur } }: FieldProps) => (
        <$Input.TextArea
          ref={ref}
          name={name}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={value}
          onChange={(event) => {
            onChange(event);
            $onChange && $onChange(event);
          }}
          onBlur={(event) => {
            onBlur(event);
            $onBlur && $onBlur(event);
          }}
          {...restProps}
        />
      )}
    </Field>
  ),
);
TypedInput.TextArea.displayName = "Input.TextArea";

export type PasswordProps = FormikFieldProps & $PasswordProps;

export type TextAreaProps = FormikFieldProps & $TextAreaProps;

export { TypedInput as Input };
export default TypedInput;
