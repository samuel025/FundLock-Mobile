import { Transaction } from "@/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface RecentStatisticsProps {
  totalSpent: string;
  isLoading: boolean;
  transactions: Transaction[]; // Add this prop
}

export default function RecentStatistics({
  totalSpent,
  isLoading,
  transactions = [],
}: RecentStatisticsProps) {
  const now = new Date();

  // Helper to check if a date is today or yesterday
  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Calculate today's and yesterday's spending
  let todaySpent = 0;
  let yesterdaySpent = 0;

  transactions.forEach((tx) => {
    if (tx.entryType === "DEBIT") {
      const txDate = new Date(tx.createdAt);
      if (isSameDay(txDate, now)) {
        todaySpent += tx.amount;
      } else {
        // Check if it's yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (isSameDay(txDate, yesterday)) {
          yesterdaySpent += tx.amount;
        }
      }
    }
  });

  // Calculate percentage change
  let percentChange = 0;
  if (yesterdaySpent > 0) {
    percentChange = ((todaySpent - yesterdaySpent) / yesterdaySpent) * 100;
  }

  // Format for display
  const percentChangeDisplay =
    yesterdaySpent === 0
      ? "N/A"
      : `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(1)}%`;

  // Group transactions by day (or week) and sum DEBIT amounts
  const days = 7;
  const dailyTotals = Array(days).fill(0);

  transactions.forEach((tx) => {
    if (tx.entryType === "DEBIT") {
      const txDate = new Date(tx.createdAt);
      const diffDays = Math.floor(
        (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays < days) {
        dailyTotals[days - diffDays - 1] += tx.amount;
      }
    }
  });

  const chartData = dailyTotals.map((value) => ({ value }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Today's Spending</Text>
          <Text style={styles.amount}>₦{todaySpent.toLocaleString()}</Text>
        </View>
        <View style={styles.trendBadge}>
          <Ionicons
            name={percentChange >= 0 ? "trending-up" : "trending-down"}
            size={16}
            color={percentChange >= 0 ? "#38B2AC" : "#DC2626"}
          />
          <Text style={styles.trendText}>{percentChangeDisplay}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          height={80}
          width={280}
          spacing={40}
          color="#38B2AC"
          thickness={2}
          startFillColor="rgba(56, 178, 172, 0.3)"
          endFillColor="rgba(56, 178, 172, 0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={3}
          yAxisColor="transparent"
          xAxisColor="transparent"
          hideDataPoints
          hideYAxisText
          curved
          areaChart
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#778DA9",
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  amount: {
    fontSize: 28,
    color: "#1B263B",
    fontFamily: "Poppins_700Bold",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F6F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    color: "#38B2AC",
    fontFamily: "Poppins_600SemiBold",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 8,
  },
});
