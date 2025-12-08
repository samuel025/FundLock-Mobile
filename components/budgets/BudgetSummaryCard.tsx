import { Glass } from "@/components/ui/Glass";
import { useTheme } from "@/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BudgetSummaryCardProps {
  totalBudgeted: number;
  activeCount: number;
}

export function BudgetSummaryCard({
  totalBudgeted,
  activeCount,
}: BudgetSummaryCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
      style={styles.container}
    >
      <Glass
        radius={20}
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : theme.colors.card,
          },
        ]}
      >
        <View style={styles.row}>
          {/* Total Budgeted */}
          <View style={styles.item}>
            <View
              style={[
                styles.icon,
                { backgroundColor: theme.colors.actionIconLockBg },
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={theme.colors.actionIconLock}
              />
            </View>
            <View style={styles.text}>
              <Text style={[styles.label, { color: theme.colors.muted }]}>
                Total Budgeted
              </Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>
                ₦{totalBudgeted.toLocaleString()}
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          {/* Active Count */}
          <View style={styles.item}>
            <View
              style={[
                styles.icon,
                { backgroundColor: theme.colors.actionIconDepositBg },
              ]}
            >
              <Ionicons
                name="layers-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.text}>
              <Text style={[styles.label, { color: theme.colors.muted }]}>
                Active
              </Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>
                {activeCount}
              </Text>
            </View>
          </View>
        </View>
      </Glass>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
});
