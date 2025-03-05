import { z } from "zod";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { insertaccountschema } from "@/db/schema";
import { usegetaccount } from "../api/use-get-account";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-accounts";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

const formschema = insertaccountschema.pick({
  name: true,
});

type FormValues = z.input<typeof formschema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmDialouge, Confirm] = useConfirm(
    "Are you confirm",
    "You are about to delete this Account"
  );

  const Accountquery = usegetaccount(id);
  const editMuation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMuation.isPending || deleteMutation.isPending;
  const isLoading = Accountquery.isLoading;
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

  const defaultValues = Accountquery.data
    ? {
        name: Accountquery.data.name,
      }
    : {
        name: "",
      };
  return (
    <>
      <ConfirmDialouge />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an Existing Account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
