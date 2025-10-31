import { SpendByOrgIdRequest, postSpendByOrgId } from "@/services/spend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useSpendByOrgId() {
  const [isSpending, setIsSpending] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);
  const [spendMessage, setSpendMessage] = useState<string | null>(null);

  const lockMutation = useMutation({
    mutationFn: (data: SpendByOrgIdRequest) => postSpendByOrgId(data),
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

  function spendLockedFundsByOrgID(data: SpendByOrgIdRequest) {
    lockMutation.mutate(data);
  }

  return {
    isSpending,
    spendError,
    spendMessage,
    spendLockedFundsByOrgID,
  };
}
