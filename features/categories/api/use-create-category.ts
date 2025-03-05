import { toast, ToastT } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type Responsetype = InferResponseType<typeof client.api.categories.$post>;
type Requesttype = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategroy = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation<Responsetype, Error, Requesttype>({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Created ");
      queryclient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed To Create category");
    },
  });
  return mutation;
};
