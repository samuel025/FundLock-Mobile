import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface RecentStatisticsProps {
  totalSpent: string;
  isLoading: boolean;
}

export default function RecentStatistics({
  totalSpent,
  isLoading,
}: RecentStatisticsProps) {
  const chartData = [
    { value: 50 },
    { value: 80 },
    { value: 90 },
    { value: 70 },
    { value: 100 },
    { value: 120 },
    { value: 85 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Recent statistic</Text>
          <Text style={styles.amount}>₦{totalSpent}</Text>
        </View>
        <View style={styles.trendBadge}>
          <Ionicons name="trending-up" size={16} color="#38B2AC" />
          <Text style={styles.trendText}>+12%</Text>
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
