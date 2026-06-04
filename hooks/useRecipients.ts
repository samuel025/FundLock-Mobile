import {
  getRecipients,
  Recipient,
  redeemToRecipient,
  RedeemToRecipientRequest,
} from "@/services/recipient";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useRecipients() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isRecipientsLoading, setIsRecipientsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);

  const fetchMutation = useMutation({
    mutationFn: ({
      categoryId,
      categoryType,
    }: {
      categoryId: string;
      categoryType: "SYSTEM" | "CUSTOM";
    }) => getRecipients(categoryId, categoryType),
    onMutate: () => {
      setIsRecipientsLoading(true);
      setRecipients([]);
    },
    onSuccess: (data) => {
      setRecipients(data);
    },
    onError: () => {
      setRecipients([]);
    },
    onSettled: () => {
      setIsRecipientsLoading(false);
    },
  });

  const redeemMutation = useMutation({
    mutationFn: (data: RedeemToRecipientRequest) => redeemToRecipient(data),
    onMutate: () => {
      setIsRedeeming(true);
      setRedeemError(null);
      setRedeemMessage(null);
    },
    onSuccess: (message) => {
      setRedeemMessage(message);
    },
    onError: (error: any) => {
      setRedeemError(error?.message || "Failed to send funds to recipient");
    },
    onSettled: () => {
      setIsRedeeming(false);
    },
  });

  const fetchRecipients = useCallback(
    (categoryId: string, categoryType: "SYSTEM" | "CUSTOM") => {
      fetchMutation.mutate({ categoryId, categoryType });
    },
    [],
  );

  const clearRecipients = useCallback(() => {
    setRecipients([]);
  }, []);

  const redeem = useCallback(
    (data: RedeemToRecipientRequest) => {
      redeemMutation.mutate(data);
    },
    [],
  );

  const clearRedeemState = useCallback(() => {
    setRedeemError(null);
    setRedeemMessage(null);
  }, []);

  return {
    recipients,
    isRecipientsLoading,
    fetchRecipients,
    clearRecipients,
    isRedeeming,
    redeemError,
    redeemMessage,
    redeem,
    clearRedeemState,
  };
}
