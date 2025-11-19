import ModernTransactionList from "@/components/ModernTransactionList";
import QuickActions from "@/components/QuickActions";
import RecentStatistics from "@/components/RecentStatistics";
import WalletBalanceCard from "@/components/WalletBalanceCard";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
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
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Wallet() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

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
  } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignOut = async () => {
    await authActions.signOut();
    router.replace("/signIn");
  };

  const handleAddMoney = () => {
    router.push({ pathname: "/profile", params: { openDeposit: "1" } });
  };

  const handleSpend = () => {
    router.push({ pathname: "/(tabs)/spend", params: { openDeposit: "1" } });
  };

  const handleWithdraw = () => {
    console.log("Withdraw pressed");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await authActions.getUser();
      fetchWalletData();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!fontsLoaded || (isLoadingUser && !user)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38B2AC" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#38B2AC"]}
            tintColor="#38B2AC"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#38B2AC" />
            </View>
            <View>
              <Text style={styles.greetingText}>Hey, {user?.firstName} 👋</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="add" size={24} color="#1B263B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1B263B"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <WalletBalanceCard
          balance={balance || "0.00"}
          totalRedeemed={totalRedeemedAmount || "0.00"}
          totalLocked={totalLockedAmount || "0.00"}
          isLoading={isLoadingWallet}
          showBalance={showBalance}
          onToggleShowBalance={() => setShowBalance((s) => !s)}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddMoney={handleAddMoney}
          onWithdraw={handleWithdraw}
          onSignOut={handleSignOut}
          onSpend={handleSpend}
        />

        {/* Recent Statistics */}
        <RecentStatistics
          totalSpent={balance || "0"}
          isLoading={isLoadingWallet}
          transactions={transactions}
        />

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            {/*<TouchableOpacity>
              <Ionicons name="options-outline" size={24} color="#1B263B" />
            </TouchableOpacity>*/}
          </View>

          <ModernTransactionList
            transactions={walletData?.transactions || []}
            isLoading={isLoadingTransactions}
            onLoadMore={loadMore}
          />
        </View>
      </ScrollView>
    </LinearGradient>
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
    backgroundColor: "#F8F9FA",
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
      android: 16,
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
    backgroundColor: "rgba(56, 178, 172, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
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
    color: "#1B263B",
  },
});
