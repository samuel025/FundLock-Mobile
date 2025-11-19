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
import { useCallback, useEffect, useRef, useState } from "react";

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

  type page = { page?: number };

  const transactionsMutation = useMutation({
    mutationFn: (opts: page) => getWalletTransactions(opts.page ?? undefined),
    onMutate: () => setIsLoadingTransactions(true),
    onSuccess: (data) => {
      setWalletData(data);
      setTransactions(data.transactions);
    },
    onError: (error) => {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    },
    onSettled: () => setIsLoadingTransactions(false),
  });

  const weeklyInsightMutation = useMutation({
    mutationFn: getWeeklyTransactionInsights,
    onSuccess: (data) => {
      setInsights(data ?? { spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
    },
    onError: (error) => {
      console.error("failed to fetch insights", error);
      setInsights({ spentThisWeek: "0", receivedThisWeek: "0" });
      setIsLoadingInsights(false);
    },
    onSettled: () => setIsLoadingInsights(false),
  });

  const fetchWalletData = useCallback(() => {
    if (user && accessToken) {
      walletMutation.mutate();
      transactionsMutation.mutate({});
      weeklyInsightMutation.mutate();
    }
  }, [user, accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (user && accessToken && !hasFetchedRef.current) {
        fetchWalletData();
        hasFetchedRef.current = true;
      }
      return () => {
        hasFetchedRef.current = false;
      };
    }, [user, accessToken]),
  );

  useEffect(() => {
    if (
      accessToken &&
      previousTokenRef.current &&
      previousTokenRef.current !== accessToken &&
      user
    ) {
      hasFetchedRef.current = false;
      fetchWalletData();
      hasFetchedRef.current = true;
    }
    previousTokenRef.current = accessToken;
  }, [accessToken, user, fetchWalletData]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !walletData?.hasNext) return;
    try {
      setIsLoadingMore(true);
      const nextPage = (walletData.currentPage ?? 0) + 1;
      const data = await getWalletTransactions(nextPage);
      setWalletData((prev) => {
        const prevTx = prev?.transactions ?? [];
        return { ...data, transactions: [...prevTx, ...data.transactions] };
      });
      setTransactions((prev) => [...prev, ...data.transactions]);
    } catch (e) {
      console.error("Failed to load more transactions:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [walletData, isLoadingMore]);

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
    walletData,
    loadMore,
    isLoadingMore,
    hasPin,
    successMessage,
  };
}
