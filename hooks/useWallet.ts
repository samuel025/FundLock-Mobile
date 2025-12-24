import { useToastConfig } from "@/config/toastConfig";
import { useAuthStore } from "@/lib/useAuthStore";
import { walletStore } from "@/lib/walletStore";
import {
  getWalletDetails,
  getWalletTransactions,
  getWeeklyTransactionInsights,
  Insights,
  Transaction,
  WalletData,
} from "@/services/wallet";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";

export function useWallet() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<Insights>({
    spentThisWeek: "0",
    receivedThisWeek: "0",
  });
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const hasFetchedRef = useRef(false);
  const previousTokenRef = useRef<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasPinStored, setHasPinStored] = useState<boolean | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(true);
  const [networkError, setNetworkError] = useState<Error | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [unknownError, setUnknownError] = useState<string | null>(null);
  const toastConfig = useToastConfig();

  const HAS_PIN = "HAS_PIN";

  const walletState = walletStore();
  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoading: isLoadingWallet,
    setIsLoading,
    hasPin,
    successMessage,
  } = walletState;

  useEffect(() => {
    const checkStoredPin = async () => {
      try {
        const storedPin = await SecureStore.getItemAsync(HAS_PIN);
        const hasPinValue = storedPin === "true";
        setHasPinStored(hasPinValue);
        walletStore.getState().setHasPin(hasPinValue);
      } catch (error) {
        setHasPinStored(false);
      } finally {
        setIsCheckingPin(false);
      }
    };
    checkStoredPin();
  }, []);

  const walletMutation = useMutation({
    mutationFn: getWalletDetails,
    onSuccess: async (data) => {
      const {
        balance,
        walletNumber,
        totalLockedAmount,
        totalRedeemedAmount,
        hasPin,
      } = data;
      await SecureStore.setItemAsync(HAS_PIN, String(hasPin));
      setHasPinStored(hasPin);
      const {
        setBalance,
        setTotalLockedAmount,
        setTotalRedeemedAmount,
        setWalletNumber,
        setHasPin,
      } = walletStore.getState();
      setBalance(balance);
      setTotalLockedAmount(totalLockedAmount);
      setTotalRedeemedAmount(totalRedeemedAmount);
      setWalletNumber(walletNumber);
      setHasPin(hasPin);
      setHasNetworkError(false);
      setNetworkError(null);
    },
    onError: (error: any) => {
      if (error?.status === 0 || error?.message?.includes("network")) {
        setHasNetworkError(true);
        setNetworkError(error);
      }

      setUnknownError("An error occured, try again later");

      const { setBalance, setTotalLockedAmount, setTotalRedeemedAmount } =
        walletStore.getState();
      setBalance("0.00");
      setTotalLockedAmount("0.00");
      setTotalRedeemedAmount("0.00");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  type page = { page?: number };

  const transactionsMutation = useMutation({
    mutationFn: (opts: page) => getWalletTransactions(opts.page ?? undefined),
    onMutate: () => setIsLoadingTransactions(true),
    onSuccess: (data) => {
      setWalletData(data);
      setTransactions(data.transactions);
      setHasNetworkError(false);
      setNetworkError(null);
    },
    onError: (error: any) => {
      // Check if it's a network error
      if (error?.status === 0 || error?.message?.includes("network")) {
        setHasNetworkError(true);
        setNetworkError(error);
      }

      setUnknownError("An error occured, try again later");

      setTransactions([]);
    },
    onSettled: () => setIsLoadingTransactions(false),
  });

  const weeklyInsightMutation = useMutation({
    mutationFn: getWeeklyTransactionInsights,
    onSuccess: (data) => {
      setInsights(data ?? { spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
      setHasNetworkError(false);
      setNetworkError(null);
    },
    onError: (error: any) => {
      // Check if it's a network error
      if (error?.status === 0 || error?.message?.includes("network")) {
        setHasNetworkError(true);
        setNetworkError(error);
      }

      setUnknownError("An error occured, try again later");

      setInsights({ spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
    },
    onSettled: () => setIsLoadingInsights(false),
  });

  const fetchWalletData = useCallback(async () => {
    if (user && accessToken) {
      try {
        setHasNetworkError(false);
        setNetworkError(null);

        await Promise.all([
          walletMutation.mutateAsync(),
          transactionsMutation.mutateAsync({}),
          weeklyInsightMutation.mutateAsync(),
        ]);
      } catch (error: any) {
        // If it's a network error, propagate it
        if (error?.status === 0 || error?.message?.includes("network")) {
          setHasNetworkError(true);
          setNetworkError(error);
          throw error;
        }

        setUnknownError("An error occured, try again later");
      }
    }
  }, [user, accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (user && accessToken && !hasFetchedRef.current) {
        fetchWalletData().catch((error) => {
          console.error("Failed to fetch wallet data on focus:", error);
        });
        hasFetchedRef.current = true;
      }
      return () => {
        hasFetchedRef.current = false;
      };
    }, [user, accessToken, fetchWalletData])
  );

  useEffect(() => {
    if (!hasNetworkError && unknownError != null) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: unknownError,
        position: "top",
        topOffset: 60,
      });

      setTimeout(() => {}, 200);
    }
  }, [unknownError]);

  useEffect(() => {
    if (
      accessToken &&
      previousTokenRef.current &&
      previousTokenRef.current !== accessToken &&
      user
    ) {
      hasFetchedRef.current = false;
      fetchWalletData().catch((error) => {
        console.error("Failed to fetch wallet data on token change:", error);
      });
      hasFetchedRef.current = true;
    }
    previousTokenRef.current = accessToken;
  }, [accessToken, user, fetchWalletData]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !walletData?.hasNext) return;
    try {
      setIsLoadingMore(true);
      setHasNetworkError(false);
      setNetworkError(null);

      const nextPage = (walletData.currentPage ?? 0) + 1;
      const data = await getWalletTransactions(nextPage);

      setWalletData((prev) => {
        const prevTx = prev?.transactions ?? [];
        return { ...data, transactions: [...prevTx, ...data.transactions] };
      });
      setTransactions((prev) => [...prev, ...data.transactions]);
    } catch (error: any) {
      console.error("Failed to load more transactions:", error);

      // Check if it's a network error
      if (error?.status === 0 || error?.message?.includes("network")) {
        setHasNetworkError(true);
        setNetworkError(error);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [walletData, isLoadingMore]);

  const retryFetch = useCallback(async () => {
    setHasNetworkError(false);
    setNetworkError(null);
    await fetchWalletData();
  }, [fetchWalletData]);

  return {
    toastConfig,
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoadingWallet,
    transactions,
    isLoadingTransactions,
    isLoadingInsights,
    insights,
    fetchWalletData,
    walletData,
    loadMore,
    isLoadingMore,
    hasPin: hasPinStored !== null ? hasPinStored : hasPin,
    isCheckingPin,
    successMessage,
    hasNetworkError,
    networkError,
    retryFetch,
    unknownError,
  };
}
