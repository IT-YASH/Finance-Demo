import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const usegetaccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Failed to Fetch Accounts");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
