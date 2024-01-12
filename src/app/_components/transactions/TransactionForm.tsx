"use client";

import { $Enums, type Category, type Transaction } from "@prisma/client";
import { Button, Popconfirm } from "antd";
import FormItem from "antd/lib/form/FormItem";
import classNames from "classnames";
import { ErrorMessage, Form, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZodError, z } from "zod";

import { Input } from "~/app/_components/shared/form/Input";
import { InputNumber } from "~/app/_components/shared/form/InputNumber";
import Select from "~/app/_components/shared/form/Select";
import { TransactionFrequency, TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";
import { DatePicker } from "../shared/form/DatePicker";

const formValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  type: z.nativeEnum($Enums.TransactionType),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  frequency: z.nativeEnum($Enums.TransactionFrequency),
  categoryId: z.string(),
});

type TransactionFormProps = {
  transaction: Transaction | null;
  categories: Category[];
  clearCachesByServerAction: (path?: string) => void;
};

export function TransactionForm({
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

  const validateForm = (
    values: Omit<Transaction, "id" | "userId" | "isProjected">,
  ) => {
    try {
      formValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  const formik = useFormik<Omit<Transaction, "id" | "userId" | "isProjected">>({
    initialValues: {
      name: transaction?.name ?? "",
      description: transaction?.description ?? "",
      type: transaction?.type ?? $Enums.TransactionType.EXPENSE,
      amount: transaction?.amount ?? 5,
      date: transaction?.date ?? new Date(),
      frequency: transaction?.frequency ?? $Enums.TransactionFrequency.MONTHLY,
      categoryId: transaction?.categoryId ?? categories.at(0)!.id,
    },
    validate: validateForm,
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      if (transaction?.id) {
        await updateTransactionFn({
          id: transaction.id,
          name: values.name,
          description: values.description,
          type: values.type,
          amount: values.amount,
          date: values.date,
          frequency: values.frequency,
          categoryId: values.categoryId,
        });
      } else {
        await createTransactionFn({
          name: values.name,
          description: values.description,
          type: values.type,
          amount: values.amount,
          date: values.date,
          frequency: values.frequency,
          categoryId: values.categoryId,
        });
      }
      helpers.setSubmitting(false);
      clearCachesByServerAction("/transactions");
      router.push("/transactions");
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
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
        <FormItem
          colon
          hasFeedback
          label="type"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.type ? "error" : ""}
          help={<ErrorMessage name="type" className="text-red" />}
        >
          <Select
            name="type"
            options={Object.keys($Enums.TransactionType).map((key) => ({
              label: TransactionType.toString(key as $Enums.TransactionType),
              value: key,
            }))}
          />
        </FormItem>
        <FormItem
          colon
          hasFeedback
          label="amount"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.amount ? "error" : ""}
          help={<ErrorMessage name="amount" className="text-red" />}
        >
          <InputNumber
            name="amount"
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
            min={0.01}
            step={1}
          />
        </FormItem>
        <FormItem
          colon
          hasFeedback
          label="date"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.date ? "error" : ""}
          help={<ErrorMessage name="date" className="text-red" />}
        >
          <DatePicker name="date" format="YYYY-MM-DD" />
        </FormItem>
        <FormItem
          colon
          hasFeedback
          label="frequency"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.frequency ? "error" : ""}
          help={<ErrorMessage name="frequency" className="text-red" />}
        >
          <Select
            name="frequency"
            options={Object.keys($Enums.TransactionFrequency).map((key) => ({
              label: TransactionFrequency.toString(
                key as $Enums.TransactionFrequency,
              ),
              value: key,
            }))}
          />
        </FormItem>
        <FormItem
          colon
          hasFeedback
          label="category"
          labelCol={{ span: 24 }}
          validateStatus={formik.errors.categoryId ? "error" : ""}
          help={<ErrorMessage name="categoryId" className="text-red" />}
        >
          <Select
            name="categoryId"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </FormItem>

        <div
          className={classNames("flex w-full items-center", {
            "justify-between": !!transaction?.id,
            "justify-end": !transaction?.id,
          })}
        >
          {transaction?.id && (
            <Popconfirm
              title="Are you sure you want to delete this transaction?"
              description="This action cannot be undone."
              onConfirm={async () => {
                await deleteTransactionFn({ id: transaction.id });
                router.push("/transactions");
              }}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          )}
          <div className="inline-flex items-center space-x-2">
            <Link href="/transactions">
              <Button>Cancel</Button>
            </Link>
            <Button
              type="primary"
              disabled={!formik.isValid}
              onClick={formik.submitForm}
              loading={formik.isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
}
