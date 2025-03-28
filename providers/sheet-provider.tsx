"use client";

import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";

import { NewTransactionSheet } from "@/features/transcations/components/new-transaction-sheet";
import { EditTransactionSheet } from "@/features/transcations/components/edit-transaction-sheet";

export const SheetProvider = () => {
  const ismounted = useMountedState();

  if (!ismounted) {
    return null;
  }
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
