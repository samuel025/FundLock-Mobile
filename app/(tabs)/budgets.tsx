import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetSummaryCard } from "@/components/budgets/BudgetSummaryCard";
import { CreateBudgetCTA } from "@/components/budgets/CreateBudgetCTA";
import { EmptyBudgets } from "@/components/budgets/EmptyBudgets";
import { useGetLocks } from "@/hooks/useGetLocks";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const options = { headerShown: false };

export default function BudgetsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const { isLocksLoading, locksList, fetchLocks } = useGetLocks();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const totalBudgeted = useMemo(() => {
    return locksList.reduce(
      (sum, item) => sum + Number((item as any).amount ?? 0),
      0
    );
  }, [locksList]);

  const onRefresh = useCallback(() => {
    fetchLocks();
    setTimeout(() => {
      if (locksList.length > 0) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  }, [fetchLocks, locksList.length]);

  useFocusEffect(
    useCallback(() => {
      fetchLocks();
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
    }, [fetchLocks])
  );

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.actionIconDepositBg },
            ]}
          >
            <Ionicons name="pie-chart" size={24} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              My Budgets
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
              Track your category spending
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push("/budget")}
        >
          <Ionicons name="add" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <BudgetSummaryCard
        totalBudgeted={totalBudgeted}
        activeCount={locksList.length}
      />

      {/* CTA */}
      <CreateBudgetCTA />

      {/* List */}
      <View style={styles.listSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Active Budgets
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.actionIconDepositBg },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              {locksList.length}
            </Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={locksList}
          keyExtractor={(item, index) => `${item.categoryName ?? index}`}
          refreshControl={
            <RefreshControl
              refreshing={isLocksLoading}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            locksList.length ? styles.listContent : styles.emptyContent
          }
          ListEmptyComponent={<EmptyBudgets />}
          renderItem={({ item, index }) => (
            <BudgetCard
              category={item.categoryName}
              amount={Number((item as any).amount ?? 0)}
              expiresAt={(item as any).expiresAt ?? ""}
              index={index}
            />
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 8,
    }),
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
