import { useTheme } from "@/theme";
import { formatCurrency } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BalanceOverviewCard({
  balance,
  totalLockedAmount,
  totalRedeemedAmount,
  showBalance,
  onToggleShowBalance,
}: {
  balance: any;
  totalLockedAmount: any;
  totalRedeemedAmount: any;
  showBalance: boolean;
  onToggleShowBalance: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.balanceCard}>
      <LinearGradient
        colors={[theme.colors.balanceCardStart, theme.colors.balanceCardEnd]}
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
            onPress={onToggleShowBalance}
            accessibilityLabel={showBalance ? "Hide balance" : "Show balance"}
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
                style={[styles.statLabel, { color: theme.colors.balanceLabel }]}
              >
                Budgeted
              </Text>
              <Text
                style={[styles.statValue, { color: theme.colors.balanceText }]}
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
                style={[styles.statLabel, { color: theme.colors.balanceLabel }]}
              >
                Redeemed
              </Text>
              <Text
                style={[styles.statValue, { color: theme.colors.balanceText }]}
              >
                {showBalance ? formatCurrency(totalRedeemedAmount) : "••••••"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
