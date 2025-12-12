import {
  purchaseAirtime,
  PurchaseAirtimeRequest,
} from "@/services/billPayment";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function usePurchaseAirtime() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const airtimeMutation = useMutation({
    mutationFn: (request: PurchaseAirtimeRequest) => purchaseAirtime(request),
    onMutate: () => {
      setIsPurchasing(true);
      setError(null);
      setMessage(null);
    },
    onSuccess: (data) => {
      setMessage(data.message || "Airtime purchased successfully");
      setIsPurchasing(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsPurchasing(false);
    },
  });

  const purchaseAirtimeRequest = (request: PurchaseAirtimeRequest) => {
    airtimeMutation.mutate(request);
  };

  return {
    isPurchasing,
    error,
    message,
    purchaseAirtimeRequest,
  };
}
