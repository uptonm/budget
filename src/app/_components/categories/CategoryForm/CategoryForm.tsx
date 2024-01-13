"use client";

import { $Enums, type Category } from "@prisma/client";
import { Button, Col, Popconfirm, Row } from "antd";
import FormItem from "antd/lib/form/FormItem";
import classNames from "classnames";
import { ErrorMessage, Form, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ZodError, z } from "zod";

import { Input } from "~/app/_components/shared/form/Input";
import Select from "~/app/_components/shared/form/Select";
import { SubmitButton } from "~/app/_components/shared/form/SubmitButton";
import { TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

const formValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  type: z.nativeEnum($Enums.TransactionType),
});

type FormValues = z.infer<typeof formValidationSchema>;

export type CategoryFormProps = {
  category: Category | null;
  clearCachesByServerAction: (path?: string) => void;
};

export function CategoryForm({
  category,
  clearCachesByServerAction,
}: CategoryFormProps) {
  const router = useRouter();

  const { mutateAsync: createCategoryFn } =
    api.category.createCategory.useMutation();
  const { mutateAsync: updateCategoryFn } =
    api.category.updateCategory.useMutation();
  const { mutateAsync: deleteCategoryFn } =
    api.category.deleteCategory.useMutation();

  const validateForm = (values: FormValues) => {
    try {
      formValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
    if (!!categoryWithSameName && categoryWithSameName.id !== category?.id) {
      return {
        name: `Another category called '${values.name}' already exists`,
      };
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      type: category?.type ?? $Enums.TransactionType.EXPENSE,
    },
    validate: validateForm,
    onSubmit: async (values, helpers): Promise<Category> => {
      helpers.setSubmitting(true);
      if (category?.id) {
        const result = await updateCategoryFn({
          id: category.id,
          name: values.name,
          description: values.description,
          type: values.type,
        });
        helpers.setSubmitting(false);
        return result;
      } else {
        const result = await createCategoryFn({
          name: values.name,
          description: values.description,
          type: values.type,
        });
        helpers.setSubmitting(false);
        return result;
      }
    },
  });

  const { data: categoryWithSameName, isFetching: nameIsValidating } =
    api.category.getCategoryByName.useQuery(
      {
        name: formik.values.name,
      },
      {
        enabled: formik.values.name?.length > 0,
      },
    );

  const { values, errors, setErrors, setTouched } = formik;
  useEffect(() => {
    if (!!categoryWithSameName && categoryWithSameName.id !== category?.id) {
      void setTouched({ name: true });
      setErrors({
        name: `Another category called '${values.name}' already exists`,
      });
      return;
    }

    if (errors.name) {
      setErrors({ name: undefined });
    }
  }, [
    values.name,
    errors.name,
    setTouched,
    setErrors,
    categoryWithSameName,
    category?.id,
  ]);

  return (
    <FormikProvider value={formik}>
      <Form className="pt-4">
        <FormItem
          colon
          required
          hasFeedback
          label="Name"
          labelCol={{ span: 24 }}
          validateStatus={
            formik.errors.name ? "error" : nameIsValidating ? "validating" : ""
          }
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
              label="Type"
              labelCol={{ span: 24 }}
              validateStatus={formik.errors.type ? "error" : ""}
              help={<ErrorMessage name="type" className="text-red" />}
            >
              <Select
                name="type"
                className="w-full"
                options={Object.keys($Enums.TransactionType).map((key) => ({
                  label: TransactionType.toString(
                    key as $Enums.TransactionType,
                  ),
                  value: key,
                }))}
              />
            </FormItem>
          </Col>
        </Row>

        <div
          className={classNames("flex w-full items-center", {
            "justify-between": !!category?.id,
            "justify-end": !category?.id,
          })}
        >
          {category?.id && (
            <Popconfirm
              title="Are you sure you want to delete this category?"
              description="All transactions associated with this category will be deleted."
              onConfirm={async () => {
                await deleteCategoryFn({ id: category.id });
                clearCachesByServerAction("/categories");
                router.push("/categories");
              }}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          )}
          <div className="inline-flex items-center space-x-2">
            <Link href="/categories">
              <Button>Cancel</Button>
            </Link>
            <SubmitButton
              type="primary"
              disabled={!formik.dirty || !formik.isValid}
              onSubmit={async (shouldClose) => {
                const result = (await formik.submitForm()) as Category;
                if (shouldClose) {
                  clearCachesByServerAction("/categories");
                  router.push("/categories");
                } else {
                  router.push(`/categories/edit/${result.id}`);
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
