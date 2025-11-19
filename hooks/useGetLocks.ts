import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getLocksClient } from "../services/getLocksClient";

export function useGetLocks() {
  const [isLocksLoading, setIsLocksLoading] = useState<boolean>(false);
  const [locksList, setLocksList] = useState<
    { categoryName: string; amount: string; expiresAt: string }[]
  >([]);

  const getLocksMutation = useMutation({
    mutationFn: getLocksClient,
    onMutate: () => setIsLocksLoading(true),
    onSuccess: (data) => {
      const list = Array.isArray(data) ? data : [];
      setLocksList(
        list.map((c: any) => ({
          categoryName: c.categoryName,
          amount: c.amount,
          expiresAt: c.expiresAt,
        })),
      );
    },
    onError: (error) => {
      console.error("Failed to fetch companies", error);
      setLocksList([]);
    },
    onSettled: () => {
      setIsLocksLoading(false);
    },
  });

  const fetchLocks = useCallback(() => {
    getLocksMutation.mutate();
  }, []);

  return {
    isLocksLoading,
    locksList,
    fetchLocks,
  };
}
