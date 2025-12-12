import { DataBundle, getDataBundles } from "@/services/billPayment";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useDataBundle() {
  const [isLoading, setIsLoading] = useState(false);
  const [bundles, setBundles] = useState<DataBundle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const bundleMutation = useMutation({
    mutationFn: (networkCode: string) => getDataBundles(networkCode),
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setBundles(data);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setBundles([]);
      setIsLoading(false);
    },
  });

  const fetchBundles = useCallback((networkCode: string) => {
    if (!networkCode) {
      setBundles([]);
      return;
    }
    bundleMutation.mutate(networkCode);
  }, []);

  return {
    isLoading,
    bundles,
    error,
    fetchBundles,
  };
}
