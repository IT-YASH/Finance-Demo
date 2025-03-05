import { z } from "zod";
import { usenewCategory } from "../hooks/use-new-categories";
import { CategoryForm } from "./category-form";
import { useCreateCategroy } from "../api/use-create-category";
import { insertcategoriesschema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formschema = insertcategoriesschema.pick({
  name: true,
});

type FormValues = z.input<typeof formschema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose } = usenewCategory();
  const mutation = useCreateCategroy();
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a New Category to organize your transaction
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
