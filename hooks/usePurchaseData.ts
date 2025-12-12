import { purchaseData, PurchaseDataRequest } from "@/services/billPayment";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function usePurchaseData() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const dataMutation = useMutation({
    mutationFn: (request: PurchaseDataRequest) => purchaseData(request),
    onMutate: () => {
      setIsPurchasing(true);
      setError(null);
      setMessage(null);
    },
    onSuccess: (data) => {
      setMessage(data.message || "Data purchased successfully");
      setIsPurchasing(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsPurchasing(false);
    },
  });

  const purchaseDataRequest = (request: PurchaseDataRequest) => {
    dataMutation.mutate(request);
  };

  return {
    isPurchasing,
    error,
    message,
    purchaseDataRequest,
  };
}
