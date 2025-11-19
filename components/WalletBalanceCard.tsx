import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/theme";

interface WalletBalanceCardProps {
  balance: string;
  totalRedeemed: string;
  totalLocked: string;
  isLoading: boolean;
  showBalance?: boolean;
  onToggleShowBalance?: () => void;
}

export default function WalletBalanceCard({
  balance,
  totalRedeemed,
  totalLocked,
  isLoading,
  showBalance = true,
  onToggleShowBalance,
}: WalletBalanceCardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.balanceCardStart, theme.colors.balanceCardEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceSection}>
            <Text
              style={[
                styles.balanceLabel,
                { color: theme.colors.balanceLabel },
              ]}
            >
              Total Balance
            </Text>
            {isLoading ? (
              <View
                style={[
                  styles.loadingPlaceholder,
                  { backgroundColor: theme.colors.statBackground },
                ]}
              />
            ) : (
              <Text
                style={[
                  styles.balanceAmount,
                  { color: theme.colors.balanceText },
                ]}
              >
                {showBalance ? `₦${balance}` : "₦ •••• ••••"}
              </Text>
            )}
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
            styles.statsRow,
            { backgroundColor: theme.colors.statBackground },
          ]}
        >
          <View style={styles.statItem}>
            <Text
              style={[styles.statLabel, { color: theme.colors.balanceLabel }]}
            >
              Budgeted
            </Text>
            <Text
              style={[styles.statValue, { color: theme.colors.balanceText }]}
            >
              {showBalance ? `₦${totalLocked}` : "••••••"}
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: theme.colors.statBackground },
            ]}
          />
          <View style={styles.statItem}>
            <Text
              style={[styles.statLabel, { color: theme.colors.balanceLabel }]}
            >
              Redeemed
            </Text>
            <Text
              style={[styles.statValue, { color: theme.colors.balanceText }]}
            >
              {showBalance ? `₦${totalRedeemed}` : "••••••"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  balanceSection: {
    marginBottom: 0,
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
  loadingPlaceholder: {
    height: 36,
    width: 150,
    borderRadius: 8,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardNumber: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Poppins_500Medium",
  },
  cardExpiry: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
});
