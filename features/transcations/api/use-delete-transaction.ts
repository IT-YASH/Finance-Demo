import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("transaction Deleted");
      queryclient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryclient.invalidateQueries({ queryKey: ["transactions"] });
      queryclient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to Delete transaction");
    },
  });

  return mutation;
};
