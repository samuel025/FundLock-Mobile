import { LockRequest, postLock } from "@/services/lock";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useLock() {
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  const lockMutation = useMutation({
    mutationFn: (data: LockRequest) => postLock(data),
    onMutate: () => {
      setIsLocking(true);
      setLockError(null);
      setLockMessage(null);
    },
    onSuccess: (message: string) => {
      setLockMessage(message);
      setIsLocking(false);
    },
    onError: (error: any) => {
      setLockError(error?.message || "Failed to lock funds");
      setIsLocking(false);
    },
    onSettled: () => {
      setIsLocking(false);
    },
  });

  function lockFunds(data: LockRequest) {
    lockMutation.mutate(data);
  }

  return {
    isLocking,
    lockError,
    lockMessage,
    lockFunds,
  };
}
