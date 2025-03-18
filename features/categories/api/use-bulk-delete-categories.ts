import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type Requesttype = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteCategories = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Deleted");
      queryclient.invalidateQueries({ queryKey: ["categories"] });
      queryclient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed To Delete Category");
    },
  });
  return mutation;
};
