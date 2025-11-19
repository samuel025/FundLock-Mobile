import SpendingInsights from "@/components/SpendingInsights";
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

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    transactions,
    fetchWalletData,
    insights,
    hasPin,
  } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const getTitle = (t: any) => {
    switch (t.type) {
      case "DEPOSIT":
        return "Received";
      case "LOCK":
        return t.recipientName ? `Budgeted` : "Budgeted";
      case "TRANSFER":
        return t.entryType === "CREDIT" ? "Received" : "Sent";
      case "REFUND":
        return "Refunded";
      default:
        return t.type || "Transaction";
    }
  };

  const getRecipient = (t: any) =>
    t.type === "DEPOSIT" ? "DEPOSIT" : t.recipientName || "";

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const formatAmount = (t: any) =>
    `${t.entryType === "CREDIT" ? "+" : "-"}₦${Number(t.amount).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;

  const formatCurrency = (val: any) =>
    `₦${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const amountColor = (t: any) =>
    t.entryType === "CREDIT" ? "#38B2AC" : "#DC2626";

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
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const recentTransactions = transactions?.slice(0, 3) || [];

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
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>{user?.firstName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={["#38B2AC", "#2C9A8F"]}
              style={styles.profileGradient}
            >
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Balance Overview Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={["#1B263B", "#415A77"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>
                  {showBalance ? formatCurrency(balance) : "₦ •••• ••••"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowBalance((s) => !s)}
                accessibilityLabel={
                  showBalance ? "Hide balance" : "Show balance"
                }
              >
                <Ionicons
                  name={showBalance ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="rgba(255,255,255,0.8)"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceStats}>
              <View style={styles.balanceStat}>
                <View style={styles.statIcon}>
                  <Ionicons name="lock-closed" size={16} color="#38B2AC" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Budgeted</Text>
                  <Text style={styles.statValue}>
                    {showBalance ? formatCurrency(totalLockedAmount) : "••••••"}
                  </Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.balanceStat}>
                <View style={[styles.statIcon, { backgroundColor: "#E0E7FF" }]}>
                  <Ionicons name="checkmark-circle" size={16} color="#4F46E5" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Redeemed</Text>
                  <Text style={styles.statValue}>
                    {showBalance
                      ? formatCurrency(totalRedeemedAmount)
                      : "••••••"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/wallet")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E7F6F2" }]}>
                <Ionicons name="wallet" size={24} color="#38B2AC" />
              </View>
              <Text style={styles.actionText}>My Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/budget")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="lock-closed" size={24} color="#DC2626" />
              </View>
              <Text style={styles.actionText}>Budget Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/budgets")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="layers" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>View Budgets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/spend")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="swap-horizontal" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>Spend Budgeted Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/spendByOrgId")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="storefront" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>Spend by Vendor ID</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="person" size={24} color="#D97706" />
              </View>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spending Insights */}
        <SpendingInsights
          insights={
            insights || {
              spentThisWeek: "0",
              receivedThisWeek: "0",
            }
          }
        />

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/wallet")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <View key={index} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor:
                        transaction.entryType === "CREDIT"
                          ? "#E7F6F2"
                          : "#FEE2E2",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      transaction.entryType === "CREDIT"
                        ? "arrow-down"
                        : "arrow-up"
                    }
                    size={20}
                    color={amountColor(transaction)}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.activityTitleRow}>
                    <Text
                      style={styles.activityLabel}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {getTitle(transaction)}
                    </Text>
                    <Text
                      style={styles.activityRecipient}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {getRecipient(transaction)}
                    </Text>
                  </View>
                  <Text style={styles.activityDate}>
                    {formatDateTime(transaction.createdAt)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    { color: amountColor(transaction) },
                  ]}
                >
                  {formatAmount(transaction)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#CED4DA"
              />
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          )}
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
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins_400Regular",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
  },
  eyeButton: {
    padding: 8,
  },
  balanceStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  balanceStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E7F6F2",
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins_400Regular",
  },
  statValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  actionCard: {
    width: "30%", // three items per row, extra items wrap to next line
    alignItems: "center",
    marginRight: "3.33%",
    marginBottom: 12,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#415A77",
    textAlign: "center",
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginTop: 8,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#38B2AC",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activityDetails: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  activityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityLabel: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
  },
  activityRecipient: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    flexShrink: 1,
    maxWidth: "70%",
  },
  activityName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
  activityDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    minWidth: 92,
    width: 92,
    textAlign: "right",
    flexShrink: 0,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#778DA9",
  },
});
