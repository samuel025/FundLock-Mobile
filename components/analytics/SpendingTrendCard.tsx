import { Glass } from "@/components/ui/Glass";
import { WeeklySpending } from "@/services/analytics";
import { useTheme } from "@/theme";
import { MotiView } from "moti";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 100;
const CHART_HEIGHT = 180;
const BAR_MAX_WIDTH = 45; // Maximum width for bars

interface SpendingTrendCardProps {
  weeklySpending: WeeklySpending[];
}

export function SpendingTrendCard({ weeklySpending }: SpendingTrendCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const { maxValue, bars } = useMemo(() => {
    if (!weeklySpending || weeklySpending.length === 0) {
      return { maxValue: 0, bars: [] };
    }

    const max = Math.max(...weeklySpending.map((w) => w.amount), 1);

    const processedBars = weeklySpending.map((week) => ({
      ...week,
      height: (week.amount / max) * CHART_HEIGHT,
    }));

    return { maxValue: max, bars: processedBars };
  }, [weeklySpending]);

  if (!weeklySpending || weeklySpending.length === 0) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500, delay: 200 }}
      style={styles.container}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Weekly Spending Trend
      </Text>

      <Glass
        radius={16}
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : theme.colors.card,
          },
        ]}
      >
        {/* Chart wrapper with padding for top labels */}
        <View style={styles.chartWrapper}>
          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              <Text style={[styles.axisLabel, { color: theme.colors.muted }]}>
                ₦{(maxValue / 1000).toFixed(0)}k
              </Text>
              <Text style={[styles.axisLabel, { color: theme.colors.muted }]}>
                ₦{(maxValue / 2000).toFixed(0)}k
              </Text>
              <Text style={[styles.axisLabel, { color: theme.colors.muted }]}>
                ₦0
              </Text>
            </View>

            {/* Chart area */}
            <View style={styles.chart}>
              {/* Grid lines */}
              <View
                style={[
                  styles.gridLine,
                  {
                    top: 0,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  {
                    top: CHART_HEIGHT / 2,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  {
                    top: CHART_HEIGHT,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                ]}
              />

              {/* Bars container */}
              <View style={styles.barsContainer}>
                {bars.map((bar, index) => (
                  <View key={index} style={styles.barColumn}>
                    {/* Amount label above bar */}
                    <MotiView
                      from={{ opacity: 0, translateY: 10 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{
                        type: "timing",
                        duration: 500,
                        delay: index * 150 + 400,
                      }}
                      style={styles.amountLabel}
                    >
                      <Text
                        style={[
                          styles.amountText,
                          { color: theme.colors.text },
                        ]}
                      >
                        ₦{(bar.amount / 1000).toFixed(1)}k
                      </Text>
                    </MotiView>

                    <View style={styles.barWrapper}>
                      <MotiView
                        from={{ height: 0, opacity: 0 }}
                        animate={{ height: bar.height, opacity: 1 }}
                        transition={{
                          type: "timing",
                          duration: 700,
                          delay: index * 150,
                        }}
                        style={[
                          styles.bar,
                          {
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      >
                        {/* Gradient overlay */}
                        <View
                          style={[
                            styles.barGradient,
                            {
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(255,255,255,0.3)",
                            },
                          ]}
                        />
                      </MotiView>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxis}>
          {bars.map((bar, index) => (
            <View key={index} style={styles.xAxisLabel}>
              <Text style={[styles.weekText, { color: theme.colors.text }]}>
                {bar.weekLabel}
              </Text>
              <Text
                style={[styles.dateRangeText, { color: theme.colors.muted }]}
              >
                {new Date(bar.startDate).getDate()}-
                {new Date(bar.endDate).getDate()}
              </Text>
            </View>
          ))}
        </View>
      </Glass>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 12,
  },
  card: {
    padding: 20,
    borderRadius: 16,
  },
  chartWrapper: {
    paddingTop: 32, // Space for amount labels at the top
  },
  chartContainer: {
    flexDirection: "row",
    height: CHART_HEIGHT,
    marginBottom: 16,
  },
  yAxis: {
    width: 45,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
  },
  chart: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
    justifyContent: "space-evenly",
    paddingHorizontal: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    maxWidth: BAR_MAX_WIDTH + 20,
  },
  barWrapper: {
    width: "100%",
    alignItems: "center",
    maxWidth: BAR_MAX_WIDTH,
  },
  bar: {
    width: "100%",
    minHeight: 8,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  amountLabel: {
    marginBottom: 8, // Space between label and bar
    alignItems: "center",
  },
  amountText: {
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    marginTop: 12,
  },
  xAxisLabel: {
    flex: 1,
    alignItems: "center",
    maxWidth: BAR_MAX_WIDTH + 20,
  },
  weekText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 2,
  },
  dateRangeText: {
    fontSize: 10,
    fontFamily: "Poppins_400Regular",
  },
});
