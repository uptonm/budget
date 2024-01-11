import { DatePicker as $DatePicker } from "antd";
import { type PickerDateProps as $DatePickerProps } from "antd/es/date-picker/generatePicker";
import { type FieldProps } from "formik";
import moment from "moment";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

const $MomentDatePicker =
  $DatePicker.generatePicker<moment.Moment>(momentGenerateConfig);

import Field, {
  type FormikFieldProps,
} from "~/app/_components/shared/form/Field";

export type DatePickerProps = $DatePickerProps<moment.Moment> &
  FormikFieldProps;

export const DatePicker = ({
  name,
  validate,
  onChange,
  fast,
  ...restProps
}: DatePickerProps) => (
  <Field name={name} validate={validate} fast={fast}>
    {({
      field: { value },
      form: { setFieldValue, setFieldTouched },
    }: FieldProps) => (
      <$MomentDatePicker
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        value={value ? moment(value) : undefined}
        onChange={(date, dateString) => {
          void setFieldValue(name, date ? date.toISOString() : null);
          void setFieldTouched(name, true, false);
          onChange?.(date, dateString);
        }}
        {...restProps}
      />
    )}
  </Field>
);
