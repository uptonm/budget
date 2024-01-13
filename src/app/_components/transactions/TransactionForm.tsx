"use client";

import { $Enums, type Category, type Transaction } from "@prisma/client";
import { Button, Col, Popconfirm, Row } from "antd";
import FormItem from "antd/lib/form/FormItem";
import classNames from "classnames";
import { ErrorMessage, Form, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZodError, z } from "zod";

import { DatePicker } from "~/app/_components/shared/form/DatePicker";
import { Input } from "~/app/_components/shared/form/Input";
import { InputNumber } from "~/app/_components/shared/form/InputNumber";
import Select from "~/app/_components/shared/form/Select";
import { SubmitButton } from "~/app/_components/shared/form/SubmitButton";
import { formatCurrency, parseCurrency } from "~/lib/currencyUtils";
import { TransactionFrequency, TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

const formValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  frequency: z.nativeEnum($Enums.TransactionFrequency),
  categoryId: z.string(),
});

type FormValues = z.infer<typeof formValidationSchema>;

type TransactionFormProps = {
  type: $Enums.TransactionType;
  transaction: Transaction | null;
  categories: Category[];
  clearCachesByServerAction: (path?: string) => void;
};

export function TransactionForm({
  type,
  transaction,
  categories,
  clearCachesByServerAction,
}: TransactionFormProps) {
  const router = useRouter();

  const { mutateAsync: createTransactionFn } =
    api.transaction.createTransaction.useMutation();
  const { mutateAsync: updateTransactionFn } =
    api.transaction.updateTransaction.useMutation();
  const { mutateAsync: deleteTransactionFn } =
    api.transaction.deleteTransaction.useMutation();

  const validateForm = (values: FormValues) => {
    try {
      formValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: transaction?.name ?? "",
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? 5,
      date: transaction?.date ?? new Date(),
      frequency: transaction?.frequency ?? $Enums.TransactionFrequency.MONTHLY,
      categoryId: transaction?.categoryId ?? categories.at(0)!.id,
    },
    validate: validateForm,
    onSubmit: async (values, helpers): Promise<Transaction> => {
      helpers.setSubmitting(true);
      if (transaction?.id) {
        const result = await updateTransactionFn({
          id: transaction.id,
          name: values.name,
          description: values.description,
          type,
          amount: values.amount,
          date: values.date,
          frequency: values.frequency,
          categoryId: values.categoryId,
        });
        helpers.setSubmitting(false);
        return result;
      } else {
        const result = await createTransactionFn({
          name: values.name,
          description: values.description,
          type,
          amount: values.amount,
          date: values.date,
          frequency: values.frequency,
          categoryId: values.categoryId,
        });
        helpers.setSubmitting(false);
        return result;
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form className="pt-4">
        <FormItem
          colon
          required
          hasFeedback
          label="Name"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.name ? "error" : ""}
          help={<ErrorMessage name="name" className="text-red" />}
        >
          <Input name="name" fast />
        </FormItem>

        <FormItem
          colon
          hasFeedback
          label="Description"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.description ? "error" : ""}
          help={<ErrorMessage name="description" className="text-red" />}
        >
          <Input.TextArea name="description" showCount={false} />
        </FormItem>

        <Row gutter={16}>
          <Col span={6}>
            <FormItem
              colon
              hasFeedback
              label="Amount"
              labelCol={{ span: 24 }}
              validateStatus={formik.errors.amount ? "error" : ""}
              help={<ErrorMessage name="amount" className="text-red" />}
            >
              <InputNumber
                name="amount"
                className="w-full"
                formatter={formatCurrency}
                parser={parseCurrency}
                min={0.01}
                step={1}
              />
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem
              colon
              hasFeedback
              label="Date"
              labelCol={{ span: 24 }}
              validateStatus={formik.errors.date ? "error" : ""}
              help={<ErrorMessage name="date" className="text-red" />}
            >
              <DatePicker className="w-full" name="date" format="YYYY-MM-DD" />
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem
              colon
              hasFeedback
              label="Frequency"
              labelCol={{ span: 24 }}
              validateStatus={formik.errors.frequency ? "error" : ""}
              help={<ErrorMessage name="frequency" className="text-red" />}
            >
              <Select
                name="frequency"
                className="w-full"
                options={Object.keys($Enums.TransactionFrequency).map(
                  (key) => ({
                    label: TransactionFrequency.toString(
                      key as $Enums.TransactionFrequency,
                    ),
                    value: key,
                  }),
                )}
              />
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem
              colon
              hasFeedback
              label="Category"
              labelCol={{ span: 24 }}
              validateStatus={formik.errors.categoryId ? "error" : ""}
              help={<ErrorMessage name="categoryId" className="text-red" />}
            >
              <Select
                name="categoryId"
                className="w-full"
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </FormItem>
          </Col>
        </Row>

        <div
          className={classNames("flex w-full items-center", {
            "justify-between": !!transaction?.id,
            "justify-end": !transaction?.id,
          })}
        >
          {transaction?.id && (
            <Popconfirm
              title={`Are you sure you want to delete this ${TransactionType.toString(
                type,
              ).toLowerCase()}?`}
              description="This action cannot be undone."
              onConfirm={async () => {
                await deleteTransactionFn({ id: transaction.id });
                clearCachesByServerAction(TransactionType.toRoute(type));
                router.push(TransactionType.toRoute(type));
              }}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          )}
          <div className="inline-flex items-center space-x-2">
            <Link href={TransactionType.toRoute(type)}>
              <Button>Cancel</Button>
            </Link>

            <SubmitButton
              type="primary"
              disabled={!formik.dirty || !formik.isValid}
              onSubmit={async (shouldClose) => {
                const result = (await formik.submitForm()) as Transaction;
                if (shouldClose) {
                  clearCachesByServerAction(TransactionType.toRoute(type));
                  router.push(TransactionType.toRoute(type));
                } else {
                  router.push(
                    `${TransactionType.toRoute(type)}/edit/${result.id}`,
                  );
                }
              }}
              loading={formik.isSubmitting}
            />
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
}
