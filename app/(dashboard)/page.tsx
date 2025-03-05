"use client";

import { usenewaccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { onOpen } = usenewaccount();

  return (
    <div>
      <Button onClick={onOpen}>Add an Account</Button>
    </div>
  );
}
