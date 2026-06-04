import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { getLocksClient } from "../services/getLocksClient";

export function useGetLocks() {
  const [isLocksLoading, setIsLocksLoading] = useState<boolean>(false);
  const [locksList, setLocksList] = useState<
    { categoryName: string; amount: string; expiresAt: string }[]
  >([]);
  const hasFetchedOnce = useRef(false);

  const getLocksMutation = useMutation({
    mutationFn: getLocksClient,
    onMutate: () => {
      // Only show loading spinner on initial load (no cached data yet)
      if (!hasFetchedOnce.current) {
        setIsLocksLoading(true);
      }
    },
    onSuccess: (data) => {
      const list = Array.isArray(data) ? data : [];
      setLocksList(
        list.map((c: any) => ({
          categoryName: c.categoryName,
          amount: c.amount,
          expiresAt: c.expiresAt,
        }))
      );
      hasFetchedOnce.current = true;
    },
    onError: (error: any) => {
      // Show toast on failure if user has no cached data to fall back on
      if (locksList.length === 0) {
        const isNetwork =
          error?.status === 0 || error?.message?.includes("network") || error?.message?.includes("timeout");
        Toast.show({
          type: "error",
          text1: isNetwork ? "Connection Issue" : "Error",
          text2: isNetwork
            ? "Couldn't load budgets. Check your connection."
            : "Failed to load budgets. Pull to retry.",
          position: "top",
          topOffset: 60,
        });
      }
      // Don't clear existing budgets — keep stale data visible
    },
    onSettled: () => {
      setIsLocksLoading(false);
    },
  });

  const fetchLocks = useCallback(async () => {
    await getLocksMutation.mutateAsync().catch(() => {});
  }, []);

  return {
    isLocksLoading,
    locksList,
    fetchLocks,
  };
}
