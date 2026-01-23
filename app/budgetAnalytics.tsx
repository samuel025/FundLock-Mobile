import { AnalyticsSummaryCard } from "@/components/analytics/AnalyticsSummaryCard";
import { CategoryBreakdownCard } from "@/components/analytics/CategoryBreakdownCard";
import { EmptyAnalytics } from "@/components/analytics/EmptyAnalytics";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { SpendingTrendCard } from "@/components/analytics/SpendingTrendCard";
import { TopCategoriesCard } from "@/components/analytics/TopCategoriesCard";
import { Glass } from "@/components/ui/Glass";
import { useBudgetAnalytics } from "@/hooks/useBudgetAnalytics";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetAnalytics() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Use TanStack Query
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useBudgetAnalytics(selectedMonth + 1, selectedYear);

  const handleMonthSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // TanStack Query will automatically refetch when queryKey changes
  };

  const handleRefresh = () => {
    refetch();
  };

  const isRefreshLoading = isRefetching && !isLoading;

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/budgets")}
          style={styles.backButtonWrapper}
        >
          <Glass
            radius={14}
            style={[
              styles.backButton,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : theme.colors.card,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.colors.primary}
            />
          </Glass>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Budget Analytics
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.muted }]}>
            Track your monthly spending
          </Text>
        </View>

        <Glass
          radius={14}
          style={[
            styles.headerIcon,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : theme.colors.card,
            },
          ]}
        >
          <Ionicons name="analytics" size={22} color={theme.colors.primary} />
        </Glass>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Month Picker */}
        <View style={styles.pickerSection}>
          <MonthPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSelect={handleMonthSelect}
          />
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.muted }]}>
              Loading analytics...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={theme.colors.danger}
            />
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              {error instanceof Error
                ? error.message
                : "Failed to load analytics"}
            </Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : analytics ? (
          <>
            {/* Summary Card */}
            <AnalyticsSummaryCard
              totalBudgeted={analytics.totalBudgeted}
              totalSpent={analytics.totalSpent}
              totalRemaining={analytics.totalRemaining}
            />

            {/* Category Breakdown */}
            <CategoryBreakdownCard categories={analytics.categoryBreakdown} />

            {/* Weekly Spending Trend */}
            <SpendingTrendCard weeklySpending={analytics.weeklySpending} />

            {/* Top Categories */}
            <TopCategoriesCard categories={analytics.topCategories} />
          </>
        ) : (
          <EmptyAnalytics month={MONTHS[selectedMonth]} year={selectedYear} />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 16,
    }),
    paddingBottom: 16,
    gap: 12,
  },
  backButtonWrapper: {},
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pickerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
});
