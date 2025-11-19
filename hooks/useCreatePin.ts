import {
  createWalletPin,
  CreatePinRequest,
  CreatePinResponse,
} from "@/services/createPin";
import { useMutation } from "@tanstack/react-query";
import { walletStore } from "@/lib/walletStore";
import { useState } from "react";
import { router } from "expo-router";

export function useCreatePin() {
  const [isCreating, setIsCreating] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: CreatePinRequest) => createWalletPin(payload),
    onMutate: () => {
      setIsCreating(true);
      setPinError(null);
      setPinMessage(null);
    },
    onSuccess: (resp: CreatePinResponse) => {
      const message = resp.message || "PIN created successfully";
      setPinMessage(message);
      setIsCreating(false);

      const store = walletStore.getState();
      store.setHasPin(true);
      store.setSuccessMessage(message);

      // small delay ensures navigation sees updated store
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 250);
    },
    onError: (err: any) => {
      setPinError(err?.message || "Failed to create PIN");
      setIsCreating(false);
    },
    onSettled: () => {
      setIsCreating(false);
    },
  });

  function createPin(pin: string) {
    const createPinReq: CreatePinRequest = { pin };
    mutation.mutate(createPinReq);
  }

  return {
    createPin,
    isCreating,
    pinError,
    pinMessage,
  };
}
