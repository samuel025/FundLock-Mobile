import { getCompanies } from "@/services/company";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useCompany() {
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );

  const companyMutation = useMutation({
    mutationFn: (id: string) => getCompanies(id),
    onMutate: () => setIsCompanyLoading(true),
    onSuccess: (data) => {
      const list = Array.isArray(data) ? data : [];
      setCompanies(list.map((c: any) => ({ id: String(c.id), name: c.name })));
    },
    onError: (error) => {
      // console.error("Failed to fetch companies", error);
      setCompanies([]);
    },
    onSettled: () => {
      setIsCompanyLoading(false);
    },
  });

  const fetchCompanies = useCallback((id: string) => {
    if (!id) return;
    companyMutation.mutate(id);
  }, []);

  return {
    isCompanyLoading,
    companies,
    fetchCompanies,
  };
}
