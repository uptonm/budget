"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums, type Category } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  type: z.enum($Enums.TransactionType),
});

type FormValues = z.infer<typeof formSchema>;

export function CategoryForm({ category }: { category: Category | null }) {
  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      type: category?.type ?? $Enums.TransactionType.EXPENSE,
    },
  });

  const onDone = async (message: string) => {
    await utils.category.invalidate();
    toast.success(message);
    router.push("/categories");
  };

  const createCategory = api.category.createCategory.useMutation({
    onSuccess: () => onDone("Created category"),
    onError: (error) => toast.error(error.message),
  });
  const updateCategory = api.category.updateCategory.useMutation({
    onSuccess: () => onDone("Updated category"),
    onError: (error) => toast.error(error.message),
  });
  const deleteCategory = api.category.deleteCategory.useMutation({
    onSuccess: () => onDone("Deleted category"),
    onError: (error) => toast.error(error.message),
  });

  const isPending =
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending;

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      type: values.type,
    };
    if (category) {
      updateCategory.mutate({ id: category.id, ...payload });
    } else {
      createCategory.mutate(payload);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-2xl flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values($Enums.TransactionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {TransactionType.toString(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          {category ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                >
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Categories with tracked transactions cannot be deleted. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteCategory.mutate({ id: category.id })}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/categories")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {category ? "Save changes" : "Create category"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
