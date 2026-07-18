"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums, type Category, type Transaction } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Calendar } from "~/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { TransactionFrequency, TransactionType } from "~/lib/enumUtils";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  amount: z.coerce.number<number>().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  frequency: z.enum($Enums.TransactionFrequency),
  categoryId: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

type TransactionFormProps = {
  type: $Enums.TransactionType;
  transaction: Transaction | null;
  categories: Category[];
};

export function TransactionForm({
  type,
  transaction,
  categories,
}: TransactionFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const listRoute = TransactionType.toRoute(type);
  const noun = TransactionType.toString(type).toLowerCase();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: transaction?.name ?? "",
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? 0,
      date: transaction?.date ?? new Date(),
      frequency: transaction?.frequency ?? $Enums.TransactionFrequency.MONTHLY,
      categoryId: transaction?.categoryId ?? categories[0]?.id ?? "",
    },
  });

  const onDone = async (message: string) => {
    await utils.transaction.invalidate();
    toast.success(message);
    router.push(listRoute);
  };

  const createTransaction = api.transaction.createTransaction.useMutation({
    onSuccess: () => onDone(`Tracked ${noun}`),
    onError: (error) => toast.error(error.message),
  });
  const updateTransaction = api.transaction.updateTransaction.useMutation({
    onSuccess: () => onDone(`Updated ${noun}`),
    onError: (error) => toast.error(error.message),
  });
  const deleteTransaction = api.transaction.deleteTransaction.useMutation({
    onSuccess: () => onDone(`Deleted ${noun}`),
    onError: (error) => toast.error(error.message),
  });

  const isPending =
    createTransaction.isPending ||
    updateTransaction.isPending ||
    deleteTransaction.isPending;

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      amount: values.amount,
      type,
      date: values.date,
      frequency: values.frequency,
      categoryId: values.categoryId,
    };
    if (transaction) {
      updateTransaction.mutate({ id: transaction.id, ...payload });
    } else {
      createTransaction.mutate(payload);
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
                <Input placeholder="e.g. Rent" {...field} />
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
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      className="pl-7"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value
                          ? format(field.value, "MMM d, yyyy")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) field.onChange(date);
                        setDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values($Enums.TransactionFrequency).map(
                      (frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {TransactionFrequency.toString(frequency)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          {transaction ? (
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
                  <AlertDialogTitle>Delete this {noun}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the record. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteTransaction.mutate({ id: transaction.id })
                    }
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
              onClick={() => router.push(listRoute)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {transaction ? "Save changes" : `Track ${noun}`}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
