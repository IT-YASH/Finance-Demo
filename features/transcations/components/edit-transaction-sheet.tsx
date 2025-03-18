import { z } from "zod";

import { useGetTransaction } from "@/features/transcations/api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { usegetaccounts } from "@/features/accounts/api/use-get-accounts";

import { useCreateCategroy } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { insertTransactionSchema } from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { TransactionForm } from "./transaction-form";

const formschema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formschema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialouge, Confirm] = useConfirm(
    "Are you confirm",
    "You are about to delete this Transaction"
  );

  const Transactionquery = useGetTransaction(id);
  const editMuation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategroy();
  const onCreateCategory = (name?: string) => {
    if (!name?.trim()) return;
    categoryMutation.mutate({ name: name.trim() });
  };
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const AccountQuery = usegetaccounts();
  const AccountMutation = useCreateAccount();
  const onCreateAccount = (name?: string) => {
    if (!name?.trim()) return;
    AccountMutation.mutate({ name: name.trim() });
  };

  const AccountOptions = (AccountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMuation.isPending ||
    deleteMutation.isPending ||
    Transactionquery.isLoading ||
    categoryMutation.isPending ||
    AccountMutation.isPending;

  const isLoading =
    Transactionquery.isLoading ||
    categoryQuery.isLoading ||
    AccountQuery.isLoading;
  const onSubmit = (values: FormValues) => {
    editMuation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await Confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = Transactionquery.data
    ? {
        accountId: Transactionquery.data.accountId,
        categoryId: Transactionquery.data.categoryId || "",
        amount: Transactionquery.data.amount.toString(),
        date: Transactionquery.data.date
          ? new Date(Transactionquery.data.date)
          : new Date(),
        payee: Transactionquery.data.payee || "",
        notes: Transactionquery.data.notes || "", // Ensure it's a string
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "", // Ensure it's a string
      };

  return (
    <>
      <ConfirmDialouge />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an Existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={isPending}
              onDelete={onDelete}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={AccountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
