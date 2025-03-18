import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { ConvertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to Fetch summary");
      }
      const { data } = await response.json();
      return {
        ...data,
        incomeAmount: ConvertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: ConvertAmountFromMiliunits(data.expenseAmount),
        remainingAmount: ConvertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: ConvertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: ConvertAmountFromMiliunits(day.income),
          expenses: ConvertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });
  return query;
};
