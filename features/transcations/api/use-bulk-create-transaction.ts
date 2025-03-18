import { toast, ToastT } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type Requesttype = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useBulkCreateTransactions = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions Created");
      queryclient.invalidateQueries({ queryKey: ["transactions"] });
      queryclient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed To Create transactions");
    },
  });
  return mutation;
};
