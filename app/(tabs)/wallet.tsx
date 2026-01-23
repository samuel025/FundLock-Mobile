import ModernTransactionList from "@/components/ModernTransactionList";
import { NetworkError } from "@/components/NetworkError";
import { OfflineBanner } from "@/components/OfflineBanner";
import { PinGuard } from "@/components/PinGuard";
import QuickActions from "@/components/QuickActions";
import RecentStatistics from "@/components/RecentStatistics";
import WalletBalanceCard from "@/components/WalletBalanceCard";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useWallet } from "@/hooks/useWallet";
import { useAuthStore } from "@/lib/useAuthStore";
import { useTheme } from "@/theme";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Wallet() {
  const { theme } = useTheme();
  const { isConnected, isInternetReachable } = useNetworkStatus();

  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoadingWallet,
    transactions,
    isLoadingTransactions,
    fetchWalletData,
    walletData,
    loadMore,
    isLoadingMore,
    toastConfig,
  } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleBudget = () => {
    router.push({ pathname: "/budget" });
  };

  const handleAddMoney = () => {
    router.push({
      pathname: "/(tabs)/accountActions",
      params: { openDeposit: "1" },
    });
  };

  const handleSpend = () => {
    router.push({ pathname: "/(tabs)/spend", params: { openDeposit: "1" } });
  };

  const handleWithdraw = () => {
    console.log("Withdraw pressed");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasNetworkError(false);
    try {
      await fetchWalletData();
    } catch (error: any) {
      // console.error("Failed to refresh wallet data:", error);
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (
      isCloseToBottom &&
      !isLoadingMore &&
      !isLoadingTransactions &&
      walletData?.hasNext
    ) {
      loadMore();
    }
  };

  if (!fontsLoaded || (isLoadingUser && !user)) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show network error if offline or has network error
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
        <NetworkError
          onRetry={onRefresh}
          message="Unable to load wallet data. Please check your internet connection."
          isFullScreen={true}
        />
      </LinearGradient>
    );
  }

  return (
    <>
    <PinGuard>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.container}
      >
        <OfflineBanner />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={handleScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.actionIconDepositBg },
                ]}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text
                  style={[styles.greetingText, { color: theme.colors.text }]}
                >
                  Hey, {user?.firstName} 👋
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Ionicons name="add" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <WalletBalanceCard
            balance={formatCurrency(balance || "0.00")}
            totalRedeemed={formatCurrency(totalRedeemedAmount || "0.00")}
            totalLocked={formatCurrency(totalLockedAmount || "0.00")}
            isLoading={isLoadingWallet}
            showBalance={showBalance}
            onToggleShowBalance={() => setShowBalance((s) => !s)}
          />

          {/* Quick Actions */}
          <QuickActions
            onAddMoney={handleAddMoney}
            onWithdraw={handleWithdraw}
            onBudget={handleBudget}
            onSpend={handleSpend}
          />

          {/* Recent Statistics */}
          <RecentStatistics
            totalSpent={formatCurrency(balance || "0")}
            isLoading={isLoadingWallet}
            transactions={transactions}
          />

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Transactions
              </Text>
            </View>

            <ModernTransactionList
              transactions={walletData?.transactions || []}
              isLoading={isLoadingTransactions}
              isLoadingMore={isLoadingMore}
              hasNext={walletData?.hasNext ?? false}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      </PinGuard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#415A77",
    fontFamily: "Poppins_500Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 8,
    }),
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },
});
