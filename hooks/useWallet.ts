import { useAuthStore } from "@/lib/useAuthStore";
import { walletStore } from "@/lib/walletStore";
import {
  getWalletDetails,
  getWalletTransactions,
  getWeeklyTransactionInsights,
  Insights,
  Transaction,
} from "@/services/wallet";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export function useWallet() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  // default to a safe object so UI never sees `undefined`
  const [insights, setInsights] = useState<Insights>({
    spentThisWeek: "0",
    receivedThisWeek: "0",
  });
  const hasFetchedRef = useRef(false);
  const previousTokenRef = useRef<string | null>(null);

  const walletState = walletStore();
  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoading: isLoadingWallet,
    setIsLoading,
  } = walletState;

  const walletMutation = useMutation({
    mutationFn: getWalletDetails,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (data) => {
      const { balance, walletNumber, totalLockedAmount, totalRedeemedAmount } =
        data;

      const {
        setBalance,
        setTotalLockedAmount,
        setTotalRedeemedAmount,
        setWalletNumber,
      } = walletStore.getState();

      setBalance(balance);
      setTotalLockedAmount(totalLockedAmount);
      setTotalRedeemedAmount(totalRedeemedAmount);
      setWalletNumber(walletNumber);
    },
    onError: (error) => {
      console.error("Failed to fetch wallet details:", error);
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

  const transactionsMutation = useMutation({
    mutationFn: getWalletTransactions,
    onMutate: () => {
      setIsLoadingTransactions(true);
    },
    onSuccess: (data) => {
      setTransactions(data);
    },
    onError: (error) => {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    },
    onSettled: () => {
      setIsLoadingTransactions(false);
    },
  });

  const weeklyInsightMutation = useMutation({
    mutationFn: getWeeklyTransactionInsights,
    onMutate: () => {},
    onSuccess: (data) => {
      setInsights(data ?? { spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
    },
    onError: (error) => {
      console.error("failed to fetch insights", error);
      setInsights({ spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
    },
    onSettled: () => {
      setIsLoadingInsights(false);
    },
  });

  const fetchWalletData = useCallback(() => {
    if (user && accessToken) {
      walletMutation.mutate();
      transactionsMutation.mutate();
      weeklyInsightMutation.mutate();
    }
  }, [user, accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (user && accessToken && !hasFetchedRef.current) {
        console.log("Screen focused - fetching data");
        fetchWalletData();
        hasFetchedRef.current = true;
      }

      return () => {
        hasFetchedRef.current = false;
      };
    }, [user, accessToken])
  );

  // Handle token refresh scenario
  useEffect(() => {
    if (
      accessToken &&
      previousTokenRef.current &&
      previousTokenRef.current !== accessToken &&
      user
    ) {
      console.log("Token refreshed, refetching wallet data...");
      hasFetchedRef.current = false;
      fetchWalletData();
      hasFetchedRef.current = true;
    }
    previousTokenRef.current = accessToken;
  }, [accessToken, user, fetchWalletData]);

  return {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoadingWallet,
    transactions,
    isLoadingTransactions,
    isLoadingInsights,
    insights,
    fetchWalletData,
  };
}
