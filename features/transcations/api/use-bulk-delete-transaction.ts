import { toast, ToastT } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type Requesttype = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTransactions = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions Deleted");
      queryclient.invalidateQueries({ queryKey: ["transactions"] });
      queryclient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed To Delete transactions");
    },
  });
  return mutation;
};
