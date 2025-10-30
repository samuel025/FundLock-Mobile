import { getOutlets } from "@/services/outlet";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

type OutletsStateItem = {
  id: string;
  name: string;
  orgId?: string;
};

type FetchOpts = { companyId?: string; categoryId?: string };

export function useOutlet() {
  const [isOutletLoading, setIsOutletLoading] = useState(false);
  const [outlets, setOutlets] = useState<OutletsStateItem[]>([]);

  const outletMutation = useMutation({
    mutationFn: (opts: FetchOpts) => {
      const hasCompany = Boolean(opts?.companyId);
      const hasCategory = Boolean(opts?.categoryId);
      if (hasCompany === hasCategory) {
        throw new Error(
          "Invalid arguments: pass exactly one of { companyId } or { categoryId }"
        );
      }
      return getOutlets(
        opts.companyId ?? undefined,
        opts.categoryId ?? undefined
      );
    },
    onMutate: () => setIsOutletLoading(true),
    onSuccess: (data) => {
      const list = Array.isArray(data) ? data : [];
      setOutlets(
        list.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          orgId: c.orgId,
        }))
      );
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
    outletMutation.mutate({ companyId });
  }, []);

  const fetchAllOutlets = useCallback((categoryId: string) => {
    if (!categoryId) return;
    outletMutation.mutate({ categoryId });
  }, []);

  const clearOutlets = useCallback(() => setOutlets([]), []);

  return {
    isOutletLoading,
    outlets,
    fetchOutlets,
    clearOutlets,
    fetchAllOutlets,
  };
}
