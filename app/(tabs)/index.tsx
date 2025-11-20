import SpendingInsights from "@/components/SpendingInsights";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { walletStore } from "@/lib/walletStore";
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
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";

export default function Index() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    transactions,
    fetchWalletData,
    insights,
    successMessage,
  } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (successMessage) {
      setShowSuccessMessage(true);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessMessage(false);
          walletStore.getState().setSuccessMessage(null);
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const dismissSuccessMessage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessMessage(false);
      walletStore.getState().setSuccessMessage(null);
    });
  };

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
    t.entryType === "CREDIT" ? theme.colors.primary : theme.colors.danger;

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

  const recentTransactions = transactions?.slice(0, 3) || [];

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.muted }]}>
              Good Morning
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.firstName}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary]}
              style={styles.profileGradient}
            >
              <Ionicons
                name="person"
                size={24}
                color={theme.colors.balanceText}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showSuccessMessage && successMessage && (
          <Animated.View
            style={[
              styles.successBanner,
              {
                opacity: fadeAnim,
                backgroundColor: theme.colors.card,
                shadowColor: theme.colors.success,
              },
            ]}
          >
            <View
              style={[
                styles.successBannerContent,
                {
                  backgroundColor: theme.colors.successBannerBg,
                  borderLeftColor: theme.colors.successBannerBorder,
                },
              ]}
            >
              <View style={styles.successBannerIconWrapper}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.colors.success}
                />
              </View>
              <Text
                style={[
                  styles.successBannerText,
                  { color: theme.colors.successBannerText },
                ]}
              >
                {successMessage}
              </Text>
              <TouchableOpacity
                onPress={dismissSuccessMessage}
                style={styles.successBannerClose}
              >
                <Ionicons name="close" size={20} color={theme.colors.success} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Balance Overview Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={[
              theme.colors.balanceCardStart,
              theme.colors.balanceCardEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <View>
                <Text
                  style={[
                    styles.balanceLabel,
                    { color: theme.colors.balanceLabel },
                  ]}
                >
                  Total Balance
                </Text>
                <Text
                  style={[
                    styles.balanceAmount,
                    { color: theme.colors.balanceText },
                  ]}
                >
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
                  color={theme.colors.balanceLabel}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.balanceStats,
                { backgroundColor: theme.colors.statBackground },
              ]}
            >
              <View style={styles.balanceStat}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: theme.colors.actionIconLockBg },
                  ]}
                >
                  <Ionicons
                    name="lock-closed"
                    size={16}
                    color={theme.colors.actionIconLock}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.balanceLabel },
                    ]}
                  >
                    Budgeted
                  </Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: theme.colors.balanceText },
                    ]}
                  >
                    {showBalance ? formatCurrency(totalLockedAmount) : "••••••"}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.colors.statBackground },
                ]}
              />

              <View style={styles.balanceStat}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: theme.colors.actionIconLockBg },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.colors.accent}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.balanceLabel },
                    ]}
                  >
                    Redeemed
                  </Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: theme.colors.balanceText },
                    ]}
                  >
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
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/wallet")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconDepositBg },
                ]}
              >
                <Ionicons
                  name="wallet"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                My Wallet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/budget")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconSpendBg },
                ]}
              >
                <Ionicons
                  name="lock-closed"
                  size={24}
                  color={theme.colors.danger}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                Budget Funds
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/budgets")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconLockBg },
                ]}
              >
                <Ionicons name="layers" size={24} color={theme.colors.accent} />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                View Budgets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/spend")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconLockBg },
                ]}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={24}
                  color={theme.colors.accent}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                Spend Budgeted Funds
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/spendByOrgId")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconLockBg },
                ]}
              >
                <Ionicons
                  name="storefront"
                  size={24}
                  color={theme.colors.accent}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                Spend by Vendor ID
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: theme.colors.actionIconRedeemBg },
                ]}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={theme.colors.actionIconRedeem}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.muted }]}>
                Profile
              </Text>
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/wallet")}>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <View
                key={index}
                style={[
                  styles.activityItem,
                  isDark
                    ? {
                        // Parent is transparent; clipping only
                        backgroundColor: "transparent",
                      }
                    : {
                        backgroundColor: theme.colors.surface,
                      },
                ]}
              >
                {isDark && (
                  <BlurView
                    intensity={30}
                    tint="dark"
                    pointerEvents="none"
                    style={styles.activityBlur}
                  />
                )}
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor:
                        transaction.entryType === "CREDIT"
                          ? theme.colors.actionIconDepositBg
                          : theme.colors.actionIconSpendBg,
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
                    color={
                      transaction.entryType === "CREDIT"
                        ? theme.colors.primary
                        : theme.colors.danger
                    }
                  />
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.activityTitleRow}>
                    <Text
                      style={[
                        styles.activityLabel,
                        { color: theme.colors.muted },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {getTitle(transaction)}
                    </Text>
                    <Text
                      style={[
                        styles.activityRecipient,
                        { color: theme.colors.text },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {getRecipient(transaction)}
                    </Text>
                  </View>
                  <Text
                    style={[styles.activityDate, { color: theme.colors.muted }]}
                  >
                    {formatDateTime(transaction.createdAt)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    {
                      color:
                        transaction.entryType === "CREDIT"
                          ? theme.colors.primary
                          : theme.colors.danger,
                    },
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
                color={theme.colors.emptyStateIcon}
              />
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                No recent activity
              </Text>
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
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 5,
    }),
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
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
    fontFamily: "Poppins_400Regular",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
  },
  eyeButton: {
    padding: 8,
  },
  balanceStats: {
    flexDirection: "row",
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
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
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
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  activityRecipient: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    flexShrink: 1,
    maxWidth: "70%",
  },
  activityName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  activityDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
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
  },
  successBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  successBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
  },
  successBannerIconWrapper: {
    marginRight: 12,
  },
  successBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
  },
  successBannerClose: {
    padding: 4,
    marginLeft: 8,
  },
  activityBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
});
