import { Glass } from "@/components/ui/Glass";
import { TopCategory } from "@/services/analytics";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TopCategoriesCardProps {
  categories: TopCategory[];
}

const COLORS = ["#38B2AC", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

export function TopCategoriesCard({ categories }: TopCategoriesCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500, delay: 300 }}
      style={styles.container}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Top Spending Categories
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
        {categories.slice(0, 5).map((category, index) => (
          <View
            key={index}
            style={[
              styles.item,
              index < Math.min(categories.length, 5) - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : theme.colors.border,
              },
            ]}
          >
            <View style={styles.rank}>
              <View
                style={[
                  styles.rankBadge,
                  { backgroundColor: `${COLORS[index]}20` },
                ]}
              >
                <Text style={[styles.rankText, { color: COLORS[index] }]}>
                  #{index + 1}
                </Text>
              </View>
            </View>

            <View style={styles.info}>
              <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                {category.categoryName}
              </Text>
              <View style={styles.amountRow}>
                <Text style={[styles.amount, { color: theme.colors.muted }]}>
                  ₦{category.amount.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.percentBadge,
                    { backgroundColor: `${COLORS[index]}15` },
                  ]}
                >
                  <Ionicons
                    name="trending-up"
                    size={12}
                    color={COLORS[index]}
                  />
                  <Text style={[styles.percentText, { color: COLORS[index] }]}>
                    {category.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
    borderRadius: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  rank: {
    width: 44,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },
  info: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amount: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  percentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  percentText: {
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
  },
});
