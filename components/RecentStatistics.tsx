import { Transaction } from "@/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";

interface RecentStatisticsProps {
  totalSpent: string;
  isLoading: boolean;
  transactions: Transaction[];
}

function hexToRgba(hex: string, alpha: number) {
  const raw = hex.replace("#", "");
  const bigint = parseInt(
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function RecentStatistics({
  totalSpent,
  isLoading,
  transactions = [],
}: RecentStatisticsProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const days = 7;
  const now = new Date();
  const dailyNet = Array(days).fill(0);

  transactions.forEach((tx) => {
    const txDate = new Date(tx.createdAt);
    const diffDays = Math.floor(
      (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
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

  const first = cumulative[0] ?? 0;
  const last = cumulative[cumulative.length - 1] ?? 0;
  let percentLabel: string = "—";
  let isPositive = true;

  if (Math.abs(first) < 1e-9) {
    percentLabel = "—";
    isPositive = last >= 0;
  } else {
    const percent = ((last - first) / Math.abs(first)) * 100;
    const rounded = Math.round(percent * 10) / 10;
    percentLabel = (rounded >= 0 ? "+" : "") + rounded.toString() + "%";
    isPositive = rounded >= 0;
  }

  return (
    <View
      style={[
        styles.container,
        isDark
          ? {
              // Glassy dark: subtle translucency + border
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            }
          : {
              backgroundColor: theme.colors.card,
            },
      ]}
    >
      {isDark && (
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: theme.colors.muted }]}>
            Recent statistic
          </Text>
          <Text style={[styles.amount, { color: theme.colors.text }]}>
            ₦{totalSpent}
          </Text>
        </View>
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor: isPositive
                ? theme.colors.actionIconDepositBg
                : theme.colors.actionIconSpendBg,
            },
          ]}
        >
          <Ionicons
            name={isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={isPositive ? theme.colors.primary : theme.colors.danger}
          />
          <Text
            style={[
              styles.trendText,
              {
                color: isPositive ? theme.colors.primary : theme.colors.danger,
              },
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
          color={theme.colors.primary}
          thickness={2}
          startFillColor={hexToRgba(theme.colors.primary, 0.3)}
          endFillColor={hexToRgba(theme.colors.primary, 0.01)}
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  amount: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 8,
  },
});
