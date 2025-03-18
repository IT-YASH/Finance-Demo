"use client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { usenewTransaction } from "@/features/transcations/hooks/use-new-transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";

import { useGetTransactions } from "@/features/transcations/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transcations/api/use-bulk-delete-transaction";
import { useBulkCreateTransactions } from "@/features/transcations/api/use-bulk-create-transaction";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { transactions as transactionSchema } from "@/db/schema";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTranscation = usenewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTrnasactions = useBulkDeleteTransactions();
  const TransactionQuery = useGetTransactions();
  const Transactions = TransactionQuery.data || [];

  const isDisabled = TransactionQuery.isLoading || deleteTrnasactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an Account to continue");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));
    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction history
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              className="w-full lg:w-auto"
              size="sm"
              onClick={newTranscation.onOpen}
            >
              <Plus className="size-4" />
              Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={Transactions}
            filterkey="payee"
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
