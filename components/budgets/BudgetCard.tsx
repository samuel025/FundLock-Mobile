import { Glass } from "@/components/ui/Glass";
import { useTheme } from "@/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BudgetCardProps {
  category: string;
  amount: number;
  expiresAt: string;
  index: number;
}

export function BudgetCard({
  category,
  amount,
  expiresAt,
  index,
}: BudgetCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const expires = expiresAt
    ? new Date(expiresAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No expiry";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: index * 80 }}
    >
      <Glass
        radius={16}
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : theme.colors.card,
          },
        ]}
      >
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: theme.colors.actionIconLockBg },
            ]}
          >
            <MaterialCommunityIcons
              name="folder-outline"
              size={22}
              color={theme.colors.actionIconLock}
            />
          </View>
          <View style={styles.cardText}>
            <Text
              style={[styles.category, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {category}
            </Text>
            <View style={styles.expiryRow}>
              <Ionicons
                name="time-outline"
                size={12}
                color={theme.colors.muted}
              />
              <Text style={[styles.expires, { color: theme.colors.muted }]}>
                {expires}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            ₦{amount.toLocaleString()}
          </Text>
        </View>
      </Glass>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expires: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
