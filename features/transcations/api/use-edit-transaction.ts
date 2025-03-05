import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type Requesttype = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEditTransaction = (id?: string) => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("transaction Updated");
      if (id) {
        queryclient.invalidateQueries({ queryKey: ["transaction", { id }] });
      }
      queryclient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to edit transaction");
    },
  });

  return mutation;
};
