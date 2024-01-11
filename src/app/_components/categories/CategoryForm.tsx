"use client";

import { $Enums, type Category } from "@prisma/client";
import FormItem from "antd/lib/form/FormItem";
import classNames from "classnames";
import { ErrorMessage, Form, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ZodError, z } from "zod";
import { useEffect } from "react";
import { Button, Popconfirm } from "antd";
import Link from "next/link";

import { Input } from "~/app/_components/shared/form/Input";
import Select from "~/app/_components/shared/form/Select";
import { TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

const formValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  type: z.nativeEnum($Enums.TransactionType),
});

type CategoryFormProps = {
  category: Category | null;
  userId: string;
  clearCachesByServerAction: (path?: string) => void;
};

export function CategoryForm({
  category,
  userId,
  clearCachesByServerAction,
}: CategoryFormProps) {
  const router = useRouter();

  const { mutateAsync: createCategoryFn } =
    api.category.createCategory.useMutation();
  const { mutateAsync: updateCategoryFn } =
    api.category.updateCategory.useMutation();
  const { mutateAsync: deleteCategoryFn } =
    api.category.deleteCategory.useMutation();

  const validateForm = (values: Omit<Category, "id">) => {
    try {
      formValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
    if (!nameIsValid) {
      return {
        name: `Another category called '${values.name}' already exists`,
      };
    }
  };

  const formik = useFormik<Omit<Category, "id">>({
    initialValues: {
      ownerId: userId,
      name: category?.name ?? "",
      description: category?.description ?? "",
      type: category?.type ?? $Enums.TransactionType.EXPENSE,
      ownerType: $Enums.CategoryOwnerType.USER,
    },
    validate: validateForm,
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      if (category?.id) {
        await updateCategoryFn({
          id: category.id,
          name: values.name,
          description: values.description,
          type: values.type,
        });
      } else {
        await createCategoryFn({
          name: values.name,
          description: values.description,
          type: values.type,
        });
      }
      helpers.setSubmitting(false);
      clearCachesByServerAction("/categories");
      router.push("/categories");
    },
  });

  const { data: nameIsValid, isFetching: nameIsValidating } =
    api.category.getCategoryNameIsUnique.useQuery(
      {
        name: formik.values.name,
      },
      {
        enabled: formik.values.name?.length > 0,
        initialData: true,
      },
    );

  const { values, errors, setErrors, setTouched } = formik;
  useEffect(() => {
    if (!nameIsValid) {
      void setTouched({ name: true });
      setErrors({
        name: `Another category called '${values.name}' already exists`,
      });
      return;
    }

    if (errors.name) {
      setErrors({ name: undefined });
    }
  }, [values.name, errors.name, setTouched, setErrors, nameIsValid]);

  return (
    <FormikProvider value={formik}>
      <Form>
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
            options={Object.keys($Enums.TransactionType).map((key) => ({
              label: TransactionType.toString(key as $Enums.TransactionType),
              value: key,
            }))}
          />
        </FormItem>

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
