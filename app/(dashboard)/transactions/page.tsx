"use client";
import { Loader2, Plus } from "lucide-react";

import { usenewTransaction } from "@/features/transcations/hooks/use-new-transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";

import { useGetTransactions } from "@/features/transcations/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transcations/api/use-bulk-delete-transaction";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionPage = () => {
  const newTranscation = usenewTransaction();
  const deleteTrnasactions = useBulkDeleteTransactions();
  const TransactionQuery = useGetTransactions();
  const Transactions = TransactionQuery.data || [];

  const isDisabled = TransactionQuery.isLoading || deleteTrnasactions.isPending;

  if (TransactionQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin " />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction history
          </CardTitle>
          <Button size="sm" onClick={newTranscation.onOpen}>
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={Transactions}
            filterkey="date"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTrnasactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;
