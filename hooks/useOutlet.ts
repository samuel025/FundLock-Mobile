import { getOutlets } from "@/services/outlet";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useOutlet() {
  const [isOutletLoading, setIsOutletLoading] = useState(false);
  const [outlets, setOutlets] = useState<{ id: string; name: string }[]>([]);

  const outletMutation = useMutation({
    mutationFn: (companyId: string) => getOutlets(companyId),
    onMutate: () => setIsOutletLoading(true),
    onSuccess: (data) => {
      const list = Array.isArray(data) ? data : [];
      setOutlets(list.map((c: any) => ({ id: String(c.id), name: c.name })));
    },
    onError: (error) => {
      console.error("Failed to fetch outlets", error);
      setOutlets([]);
    },
    onSettled: () => {
      setIsOutletLoading(false);
    },
  });

  const fetchOutlets = useCallback((companyId: string) => {
    if (!companyId) return;
    outletMutation.mutate(companyId);
  }, []);

  const clearOutlets = useCallback(() => setOutlets([]), []);

  return {
    isOutletLoading,
    outlets,
    fetchOutlets,
    clearOutlets,
  };
}
