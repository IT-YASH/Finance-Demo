import { z } from "zod";
import { Loader2 } from "lucide-react";

import { CategoryForm } from "./category-form";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-categories";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useConfirm } from "@/hooks/use-confirm";
import { insertcategoriesschema } from "@/db/schema";

const formschema = insertcategoriesschema.pick({
  name: true,
});

type FormValues = z.input<typeof formschema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialouge, Confirm] = useConfirm(
    "Are you confirm",
    "You are about to delete this Category"
  );

  const Categoryquery = useGetCategory(id);
  const editMuation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMuation.isPending || deleteMutation.isPending;
  const isLoading = Categoryquery.isLoading;
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

  const defaultValues = Categoryquery.data
    ? {
        name: Categoryquery.data.name,
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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an Existing Category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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
