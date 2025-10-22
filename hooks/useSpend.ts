import { SpendRequest, postSpend } from "@/services/spend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useSpend() {
  const [isSpending, setIsSpending] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);
  const [spendMessage, setSpendMessage] = useState<string | null>(null);

  const lockMutation = useMutation({
    mutationFn: (data: SpendRequest) => postSpend(data),
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
      setSpendError(error?.message || "Failed to lock funds");
      setIsSpending(false);
    },
    onSettled: () => {
      setIsSpending(false);
    },
  });

  function spendLockedFunds(data: SpendRequest) {
    lockMutation.mutate(data);
  }

  return {
    isSpending,
    spendError,
    spendMessage,
    spendLockedFunds,
  };
}
