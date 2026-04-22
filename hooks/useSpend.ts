import { SpendRequest, postSpend } from "@/services/spend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type SpendPayload = {
  data: SpendRequest;
  idempotencyKey?: string;
};

export function useSpend() {
  const [isSpending, setIsSpending] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);
  const [spendMessage, setSpendMessage] = useState<string | null>(null);

  const lockMutation = useMutation({
    mutationFn: ({ data, idempotencyKey }: SpendPayload) =>
      postSpend(data, { idempotencyKey }),
    onMutate: () => {
      setIsSpending(true);
      setSpendError(null);
      setSpendMessage(null);
    },
    onSuccess: (message: string) => {
      setSpendMessage(message);
      setIsSpending(false);
    },
    onError: (error: any) => {
      setSpendError(error?.message || "Failed to budget funds");
      setIsSpending(false);
    },
    onSettled: () => {
      setIsSpending(false);
    },
  });

  function spendLockedFunds(data: SpendRequest, idempotencyKey?: string) {
    lockMutation.mutate({ data, idempotencyKey });
  }

  return {
    isSpending,
    spendError,
    spendMessage,
    spendLockedFunds,
  };
}
