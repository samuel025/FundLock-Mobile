import { Glass } from "@/components/ui/Glass";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnalyticsSummaryCardProps {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
}

export function AnalyticsSummaryCard({
  totalBudgeted,
  totalSpent,
  totalRemaining,
}: AnalyticsSummaryCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const spentPercentage =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const getStatusColor = () => {
    if (spentPercentage >= 90) return "#EF4444";
    if (spentPercentage >= 70) return "#F59E0B";
    return theme.colors.primary;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.container}
    >
      <Glass
        radius={20}
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : theme.colors.card,
          },
        ]}
      >
        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressRing,
              {
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getStatusColor(),
                  transform: [
                    { rotate: `${Math.min(spentPercentage, 100) * 3.6}deg` },
                  ],
                },
              ]}
            />
            <View
              style={[
                styles.progressInner,
                {
                  backgroundColor: isDark
                    ? "rgba(27, 38, 59, 0.95)"
                    : theme.colors.card,
                },
              ]}
            >
              <Text
                style={[styles.progressPercent, { color: getStatusColor() }]}
              >
                {Math.round(spentPercentage)}%
              </Text>
              <Text
                style={[styles.progressLabel, { color: theme.colors.muted }]}
              >
                used
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}
            >
              <Ionicons name="wallet" size={18} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.muted }]}>
              Budgeted
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ₦{totalBudgeted.toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : theme.colors.border,
              },
            ]}
          />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#EF444420" }]}>
              <Ionicons name="trending-down" size={18} color="#EF4444" />
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.muted }]}>
              Spent
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ₦{totalSpent.toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : theme.colors.border,
              },
            ]}
          />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#10B98120" }]}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.muted }]}>
              Remaining
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ₦{totalRemaining.toLocaleString()}
            </Text>
          </View>
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
  card: {
    padding: 20,
    borderRadius: 20,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    width: 10,
    height: 60,
    top: 0,
    left: "50%",
    marginLeft: -5,
    transformOrigin: "center bottom",
  },
  progressInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: -2,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  statDivider: {
    width: 1,
    height: 50,
  },
});
