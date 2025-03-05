import { z } from "zod";
import { Loader2 } from "lucide-react";

import { usenewTransaction } from "../hooks/use-new-transaction";
import { useCreateTransaction } from "../api/use-create-transaction";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { usegetaccounts } from "@/features/accounts/api/use-get-accounts";

import { useCreateCategroy } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { insertTransactionSchema } from "@/db/schema";
import { TransactionForm } from "./transaction-form";

const formschema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formschema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = usenewTransaction();

  const createmutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategroy();
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const AccountQuery = usegetaccounts();
  const AccountMutation = useCreateAccount();
  const onCreateAccount = (name: string) =>
    AccountMutation.mutate({
      name,
    });
  const AccountOptions = (AccountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    createmutation.isPending ||
    categoryMutation.isPending ||
    AccountMutation.isPending;

  const isLoading = categoryQuery.isLoading || AccountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createmutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a New Transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={AccountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
