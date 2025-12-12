import { getNetworkProviders, NetworkProvider } from "@/services/billPayment";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useNetworkProvider() {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<NetworkProvider[]>([]);
  const [error, setError] = useState<string | null>(null);

  const providerMutation = useMutation({
    mutationFn: getNetworkProviders,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setProviders(data);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setProviders([]);
      setIsLoading(false);
    },
  });

  const fetchProviders = useCallback(() => {
    providerMutation.mutate();
  }, []);

  return {
    isLoading,
    providers,
    error,
    fetchProviders,
  };
}
