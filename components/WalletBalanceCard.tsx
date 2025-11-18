import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1B263B", "#415A77"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            {isLoading ? (
              <View style={styles.loadingPlaceholder} />
            ) : (
              <Text style={styles.balanceAmount}>
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
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Budgeted</Text>
            <Text style={styles.statValue}>
              {showBalance ? `₦${totalLocked}` : "••••••"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Redeemed</Text>
            <Text style={styles.statValue}>
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
    color: "rgba(255,255,255,0.8)",
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
  loadingPlaceholder: {
    height: 36,
    width: 150,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
});
