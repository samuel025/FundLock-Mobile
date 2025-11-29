import { useGetLocks } from "@/hooks/useGetLocks";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useRef } from "react";
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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const flatListRef = useRef<FlatList>(null);

  const { isLocksLoading, locksList, fetchLocks } = useGetLocks();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  async function onRefresh() {
    fetchLocks();
    setTimeout(() => {
      if (locksList.length > 0) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchLocks();
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
    }, [fetchLocks])
  );

  if (!fontsLoaded) return null;

  const Glass = ({
    children,
    style,
    radius = 12,
  }: {
    children: React.ReactNode;
    style?: any;
    radius?: number;
  }) => {
    if (!isDark) {
      return <View style={style}>{children}</View>;
    }
    return (
      <View
        style={[
          style,
          {
            position: "relative",
            overflow: "hidden",
            borderRadius: radius,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
          },
        ]}
      >
        <BlurView
          intensity={30}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        {children}
      </View>
    );
  };

  const getTotalBudgeted = () => {
    return locksList.reduce((sum, item) => {
      return sum + Number((item as any).amount ?? 0);
    }, 0);
  };

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
            <Text style={[styles.greetingText, { color: theme.colors.text }]}>
              My Budgets
            </Text>
            <Text style={[styles.subText, { color: theme.colors.muted }]}>
              Track your category spending
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push("/budget")}
        >
          <Ionicons name="add" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.summarySection}
      >
        <Glass
          radius={20}
          style={[
            styles.summaryCard,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : theme.colors.card,
            },
          ]}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: theme.colors.actionIconLockBg },
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={theme.colors.actionIconLock}
                />
              </View>
              <View style={styles.summaryText}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.muted }]}
                >
                  Total Budgeted
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.text }]}
                >
                  ₦{getTotalBudgeted().toLocaleString()}
                </Text>
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.colors.border }]}
            />

            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: theme.colors.actionIconDepositBg },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.summaryText}>
                <Text
                  style={[styles.summaryLabel, { color: theme.colors.muted }]}
                >
                  Active
                </Text>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.text }]}
                >
                  {locksList.length}
                </Text>
              </View>
            </View>
          </View>
        </Glass>
      </MotiView>

      {/* Create Budget CTA */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 400, delay: 100 }}
        style={styles.ctaSection}
      >
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/budget")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.primary, "#2C9A92"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaLeft}>
              <View style={styles.ctaIconBox}>
                <Ionicons name="lock-closed" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.ctaTitle}>Budget Funds</Text>
                <Text style={styles.ctaSubtitle}>
                  Create a new category budget
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>

      {/* List Section */}
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
          ListEmptyComponent={
            <View style={styles.empty}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: theme.colors.actionIconLockBg },
                ]}
              >
                <Ionicons
                  name="pie-chart-outline"
                  size={40}
                  color={theme.colors.muted}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Active Budgets
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                Start budgeting by creating your first category allocation
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push("/budget")}
              >
                <LinearGradient
                  colors={[theme.colors.primary, "#2C9A92"]}
                  style={styles.emptyButtonGradient}
                >
                  <Ionicons name="add-circle-outline" size={18} color="#fff" />
                  <Text style={styles.emptyButtonText}>Create Budget</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => {
            const category = item.categoryName;
            const amount = Number((item as any).amount ?? 0);
            const expiresRaw = (item as any).expiresAt ?? "";
            const expires =
              expiresRaw && expiresRaw !== ""
                ? new Date(expiresRaw).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No expiry";

            return (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 400,
                  delay: index * 80,
                }}
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
                        <Text
                          style={[
                            styles.expires,
                            { color: theme.colors.muted },
                          ]}
                        >
                          {expires}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text
                      style={[styles.amount, { color: theme.colors.primary }]}
                    >
                      ₦{amount.toLocaleString()}
                    </Text>
                  </View>
                </Glass>
              </MotiView>
            );
          }}
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
  greetingText: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  subText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  iconButton: {
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
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ctaIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  ctaSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
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
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    maxWidth: 240,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
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
