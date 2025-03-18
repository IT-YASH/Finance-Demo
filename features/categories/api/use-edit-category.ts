import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type Requesttype = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

export const useEditCategory = (id?: string) => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Category ID is required for editing.");
      }
      const response = await client.api.categories[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Updated");

      queryclient.invalidateQueries({ queryKey: ["category", { id }] });
      queryclient.invalidateQueries({ queryKey: ["categories"] });
      queryclient.invalidateQueries({ queryKey: ["transactions"] });
      queryclient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit categroy");
    },
  });

  return mutation;
};
