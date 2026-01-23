import { Glass } from "@/components/ui/Glass";
import { CategoryBreakdown } from "@/services/analytics";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CategoryBreakdownCardProps {
  categories: CategoryBreakdown[];
}

export function CategoryBreakdownCard({
  categories,
}: CategoryBreakdownCardProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "#EF4444";
    if (percent >= 70) return "#F59E0B";
    return theme.colors.primary;
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500, delay: 100 }}
      style={styles.container}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Category Breakdown
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
        {categories.map((category, index) => (
          <View
            key={category.categoryId}
            style={[
              styles.categoryItem,
              index < categories.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : theme.colors.border,
              },
            ]}
          >
            <View style={styles.categoryHeader}>
              <View style={styles.categoryLeft}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                >
                  <Ionicons
                    name="pricetag"
                    size={16}
                    color={theme.colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.categoryName, { color: theme.colors.text }]}
                  >
                    {category.categoryName}
                  </Text>
                  <Text
                    style={[
                      styles.categorySubtext,
                      { color: theme.colors.muted },
                    ]}
                  >
                    ₦{category.spent.toLocaleString()} of ₦
                    {category.budgeted.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.categoryRight}>
                <Text
                  style={[
                    styles.categoryPercent,
                    { color: getProgressColor(category.percentUsed) },
                  ]}
                >
                  {Math.round(category.percentUsed)}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9",
                },
              ]}
            >
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(category.percentUsed, 100)}%`,
                    backgroundColor: getProgressColor(category.percentUsed),
                  },
                ]}
              />
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
  categoryItem: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  categorySubtext: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryPercent: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
});
