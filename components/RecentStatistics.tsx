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
  const days = 7;
  const now = new Date();
  const dailyNet = Array(days).fill(0);

  transactions.forEach((tx) => {
    const txDate = new Date(tx.createdAt);
    const diffDays = Math.floor(
      (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < days && diffDays >= 0) {
      const idx = days - diffDays - 1;
      const amt = Number(tx.amount) || 0;
      if (tx.entryType === "CREDIT") {
        dailyNet[idx] += amt;
      } else {
        dailyNet[idx] -= amt;
      }
    }
  });

  const cumulative: number[] = [];
  dailyNet.reduce((acc, val, i) => {
    const next = acc + val;
    cumulative[i] = next;
    return next;
  }, 0);

  const minVal = Math.min(...cumulative, 0);
  const offset = Math.abs(minVal);
  const chartData = cumulative.map((value) => ({ value: value + offset }));

  // percent display: show a dash "—" when baseline is zero (avoids misleading 100%)
  const first = cumulative[0] ?? 0;
  const last = cumulative[cumulative.length - 1] ?? 0;
  let percentLabel: string = "—";
  let isPositive = true;

  if (Math.abs(first) < 1e-9) {
    // baseline is effectively zero — show dash instead of arbitrary 100%
    percentLabel = "—";
    isPositive = last >= 0;
  } else {
    const percent = ((last - first) / Math.abs(first)) * 100;
    const rounded = Math.round(percent * 10) / 10; // one decimal
    percentLabel = (rounded >= 0 ? "+" : "") + rounded.toString() + "%";
    isPositive = rounded >= 0;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Recent statistic</Text>
          <Text style={styles.amount}>₦{totalSpent}</Text>
        </View>
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: isPositive ? "#E7F6F2" : "#FEE2E2" },
          ]}
        >
          <Ionicons
            name={isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={isPositive ? "#38B2AC" : "#DC2626"}
          />
          <Text
            style={[
              styles.trendText,
              { color: isPositive ? "#38B2AC" : "#DC2626" },
            ]}
          >
            {percentLabel}
          </Text>
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
