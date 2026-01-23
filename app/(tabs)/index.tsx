import BalanceOverviewCard from "@/components/home/BalanceOverviewCard";
import HomeHeader from "@/components/home/HomeHeader";
import QuickActionsGrid from "@/components/home/QuickActionsGrid";
import RecentActivityList from "@/components/home/RecentActivityList";
import SuccessBanner from "@/components/home/SuccessBanner";
import { NetworkError } from "@/components/NetworkError";
import { OfflineBanner } from "@/components/OfflineBanner";
import SpendingInsights from "@/components/SpendingInsights";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { walletStore } from "@/lib/walletStore";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const { theme } = useTheme();

  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  const { isConnected, isInternetReachable } = useNetworkStatus();

  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    transactions,
    fetchWalletData,
    insights,
    successMessage,
  } = useWallet();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setHasNetworkError(false);
    try {
      await authActions.getUser();
      fetchWalletData();
    } catch (error: any) {
      if (
        error?.status === 0 ||
        isConnected === false ||
        isInternetReachable === false
      ) {
        setHasNetworkError(true);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async () => {
    setHasNetworkError(false);
    await onRefresh();
  };

  if (!fontsLoaded || (isLoadingUser && !user)) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: theme.colors.muted }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // Show full-screen network error if there's a network issue
  if (
    hasNetworkError ||
    isConnected === false ||
    isInternetReachable === false
  ) {
    return (
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.container}
      >
        <NetworkError onRetry={handleRetry} />
      </LinearGradient>
    );
  }

  const actions = [
    {
      key: "wallet",
      label: "My Wallet",
      icon: "wallet" as const,
      iconBg: theme.colors.actionIconDepositBg,
      iconColor: theme.colors.primary,
      onPress: () => router.push("/wallet"),
    },
    {
      key: "budget",
      label: "Budget Funds",
      icon: "lock-closed" as const,
      iconBg: theme.colors.actionIconSpendBg,
      iconColor: theme.colors.danger,
      onPress: () => router.push("/budget"),
    },
    {
      key: "budgets",
      label: "View Budgets",
      icon: "layers" as const,
      iconBg: theme.colors.actionIconLockBg,
      iconColor: theme.colors.accent,
      onPress: () => router.push("/(tabs)/budgets"),
    },
    {
      key: "spend",
      label: "Spend Budgeted Funds",
      icon: "swap-horizontal" as const,
      iconBg: theme.colors.actionIconLockBg,
      iconColor: theme.colors.accent,
      onPress: () => router.push("/(tabs)/spend"),
    },
    {
      key: "spendByVendor",
      label: "Spend by Vendor ID",
      icon: "storefront" as const,
      iconBg: theme.colors.actionIconLockBg,
      iconColor: theme.colors.accent,
      onPress: () => router.push("/spendByOrgId"),
    },
    {
      key: "profile",
      label: "Profile",
      icon: "person" as const,
      iconBg: theme.colors.actionIconRedeemBg,
      iconColor: theme.colors.actionIconRedeem,
      onPress: () => router.push("/profileDetails"),
    },
  ];

  return (
    <>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.container}
      >
        <OfflineBanner />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <HomeHeader
            firstName={user?.firstName}
            onPressProfile={() => router.push("/profileDetails")}
          />

          <SuccessBanner
            message={successMessage}
            onCleared={() => walletStore.getState().setSuccessMessage(null)}
          />

          <BalanceOverviewCard
            balance={balance}
            totalLockedAmount={totalLockedAmount}
            totalRedeemedAmount={totalRedeemedAmount}
            showBalance={showBalance}
            onToggleShowBalance={() => setShowBalance((s) => !s)}
          />

          <QuickActionsGrid actions={actions} />

          <SpendingInsights
            insights={
              insights || {
                spentThisWeek: "0",
                receivedThisWeek: "0",
              }
            }
          />

          <RecentActivityList
            transactions={transactions}
            onPressViewAll={() => router.push("/wallet")}
            onPressTransaction={(reference) =>
              router.push({
                pathname: "/transactionDetails",
                params: { reference },
              })
            }
          />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, fontFamily: "Poppins_500Medium" },
});
