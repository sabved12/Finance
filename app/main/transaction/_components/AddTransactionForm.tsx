"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TransactionSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreateAccountDrawer } from "@/components/createAccountDrawer";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ReceiptScanner from "./ReceiptScanner";
import { motion } from "framer-motion";

interface AddTransactionFormProps {
  accounts: any[];
  categories: any[];
  editMode?: boolean;
  initialData?: {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    accountId: string;
    date: string | Date;
    category: string;
    isRecurring: boolean;
    recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  } | null;
}

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null
}: AddTransactionFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register, setValue,
    handleSubmit, formState: { errors }, watch,
    control,
    getValues, reset
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      category: "",
      isRecurring: false,
    }
  });

  useEffect(() => {
    if (editMode && initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount.toString(),
        description: initialData.description,
        accountId: initialData.accountId,
        date: new Date(initialData.date),
        category: initialData.category,
        isRecurring: initialData.isRecurring,
        ...(initialData.recurringInterval && {
          recurringInterval: initialData.recurringInterval
        })
      });
    }
  }, [initialData, editMode, reset]);

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
    const formData = { ...data, amount: parseFloat(data.amount) };

    if (editMode) {
      transactionFn(editId, formData);
    }
    else transactionFn(formData);
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction Updated!" : "Transaction Added!");
      reset();
      router.push(`/main/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  // When a receipt is scanned, populate appropriate fields
  const handleScan = (scannedData) => {
    if (!scannedData) return;
    setValue("amount", scannedData.amount?.toString() || "");
    if (scannedData.date) {
      setValue("date", new Date(scannedData.date));
    }
    setValue("description", scannedData.description || "");

    if (scannedData.category) {
      const scannedCategoryName = scannedData.category.toString().toLowerCase();
      const matchingCategory = filteredCategories.find(
        (cat) => cat.name.toLowerCase() === scannedCategoryName
      );
      if (matchingCategory) setValue("category", matchingCategory.id);
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-center min-h-screen bg-gradient-to-br from-[#211c39] via-[#2e2158] to-[#f5f3ff]",
      "dark:from-[#0e0a1f] dark:via-[#20173b] dark:to-[#191429] px-3 sm:px-6 py-10"
    )}>
      <motion.form
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white dark:bg-[#18152a]/85 rounded-3xl shadow-2xl p-7 sm:p-9 space-y-8 border border-violet-200 dark:border-violet-800/40 backdrop-blur"
      >
        {!editMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
            <ReceiptScanner onScanComplete={handleScan} />
          </motion.div>
        )}
        <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-100 text-center mb-6 tracking-tight">
          {editMode ? "Edit Transaction" : "Add Transaction"}
        </h2>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            onValueChange={(value) => setValue("type", value)}
            value={type}
          >
            <SelectTrigger className="hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-700 focus:ring-violet-400 dark:focus:ring-violet-400">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-400">{errors.type.message}</p>
          )}
        </div>

        {/* Amount and Account */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="hover:border-violet-300 dark:hover:border-violet-500 focus:border-violet-500 dark:focus:border-violet-400"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-400">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account</label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              value={getValues("accountId")}
            >
              <SelectTrigger className="hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-600 focus:ring-violet-400 dark:focus:ring-violet-400">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-center items-center py-1.5 text-sm"
                  >
                    Create Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-400">{errors.accountId.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-600 focus:ring-violet-400 dark:focus:ring-violet-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-red-400">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-700 focus:ring-violet-400 group transition",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50 group-hover:text-violet-700" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-400">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="Enter description"
            className="hover:border-violet-300 dark:hover:border-violet-400 focus:border-violet-500 dark:focus:border-violet-400"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Recurring Toggle */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 hover:shadow-md transition bg-violet-50/30 dark:bg-violet-950/25 border-violet-100 dark:border-violet-800/30">
          <div className="space-y-0.5">
            <label className="text-base font-medium">Recurring Transaction</label>
            <div className="text-sm text-muted-foreground">
              Set up a recurring schedule for this transaction
            </div>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
            className="data-[state=checked]:bg-violet-600"
          />
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recurring Interval</label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              value={getValues("recurringInterval")}
            >
              <SelectTrigger className="hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-700 focus:ring-violet-400 dark:focus:ring-violet-400">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-red-400">
                {errors.recurringInterval.message}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-row gap-4 mt-3">
          <Button
            type="button"
            variant="outline"
            className="w-1/2 hover:bg-violet-50 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-200 hover:text-violet-900"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-1/2 bg-violet-700 dark:bg-violet-800 hover:bg-violet-800 dark:hover:bg-violet-900 transition text-white"
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : editMode ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddTransactionForm;
