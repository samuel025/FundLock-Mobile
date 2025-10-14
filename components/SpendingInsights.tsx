import { Transaction } from "@/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export default function SpendingInsights({
  transactions,
}: SpendingInsightsProps) {
  const totalSpent = transactions
    .filter((t) => t.entryType === "DEBIT")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalReceived = transactions
    .filter((t) => t.entryType === "CREDIT")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={24} color="#F59E0B" />
        <Text style={styles.title}>Spending Insights</Text>
      </View>

      <View style={styles.insightCard}>
        <Ionicons name="information-circle" size={20} color="#4F46E5" />
        <Text style={styles.insightText}>
          You&apos;ve spent ₦{totalSpent.toLocaleString()} this week.
          That&apos;s 12% less than last week!
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="arrow-up" size={20} color="#DC2626" />
          </View>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>₦{totalSpent.toLocaleString()}</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: "#E7F6F2" }]}>
            <Ionicons name="arrow-down" size={20} color="#38B2AC" />
          </View>
          <Text style={styles.statLabel}>Received</Text>
          <Text style={styles.statValue}>
            ₦{totalReceived.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#415A77",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
});
