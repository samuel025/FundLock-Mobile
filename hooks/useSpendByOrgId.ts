import { SpendByOrgIdRequest, postSpendByOrgId } from "@/services/spend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type SpendByOrgIdPayload = {
  data: SpendByOrgIdRequest;
  idempotencyKey?: string;
};

export function useSpendByOrgId() {
  const [isSpending, setIsSpending] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);
  const [spendMessage, setSpendMessage] = useState<string | null>(null);

  const lockMutation = useMutation({
    mutationFn: ({ data, idempotencyKey }: SpendByOrgIdPayload) =>
      postSpendByOrgId(data, { idempotencyKey }),
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

  function spendLockedFundsByOrgID(
    data: SpendByOrgIdRequest,
    idempotencyKey?: string,
  ) {
    lockMutation.mutate({ data, idempotencyKey });
  }

  return {
    isSpending,
    spendError,
    spendMessage,
    spendLockedFundsByOrgID,
  };
}
