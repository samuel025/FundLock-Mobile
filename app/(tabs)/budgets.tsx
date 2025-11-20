import { useGetLocks } from "@/hooks/useGetLocks";
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
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";

export const options = { headerShown: false };

export default function BudgetsPage() {
  const router = useRouter();
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const { isLocksLoading, locksList, fetchLocks } = useGetLocks();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  async function onRefresh() {
    fetchLocks();
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchLocks();
    }, [fetchLocks]),
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

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              My Budgets
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
              Active locked funds by category
            </Text>
          </View>

          <Glass
            radius={12}
            style={[
              styles.iconBox,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : theme.colors.card,
              },
            ]}
          >
            <Ionicons
              name="pie-chart-sharp"
              size={26}
              color={theme.colors.primary}
            />
          </Glass>
        </View>
      </SafeAreaView>

      {/* Lock Funds button */}
      <View style={styles.lockActionWrap}>
        <TouchableOpacity
          style={[styles.lockCard, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/budget")}
          accessibilityRole="button"
        >
          <View style={styles.lockCardLeft}>
            <View
              style={[
                styles.lockIcon,
                { backgroundColor: theme.colors.balanceCardStart },
              ]}
            >
              <Ionicons
                name="pie-chart"
                size={18}
                color={theme.colors.balanceText}
              />
            </View>
            <View style={styles.lockText}>
              <Text
                style={[styles.lockTitle, { color: theme.colors.balanceText }]}
              >
                Budget Funds
              </Text>
              <Text
                style={[
                  styles.lockSubtitle,
                  { color: theme.colors.balanceLabel },
                ]}
              >
                Create a new locked savings
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* List header */}
      <View style={styles.listHeader}>
        <Text style={[styles.listHeaderTitle, { color: theme.colors.text }]}>
          Your active budgets
        </Text>
        <View
          style={[styles.countBadge, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.countText, { color: theme.colors.balanceText }]}>
            {locksList.length}
          </Text>
        </View>
      </View>

      <FlatList
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
        contentContainerStyle={locksList.length ? undefined : { flex: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
              No active budgets
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const category = item.categoryName;
          const amount = Number((item as any).amount ?? 0);
          const expiresRaw = (item as any).expiresAt ?? "";
          const expires =
            expiresRaw && expiresRaw !== ""
              ? new Date(expiresRaw).toISOString().split("T")[0]
              : "No expiry";
          return (
            <Glass
              radius={12}
              style={[
                styles.card,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                },
              ]}
            >
              <View style={styles.left}>
                <Text style={[styles.category, { color: theme.colors.text }]}>
                  {category}
                </Text>
                <Text style={[styles.expires, { color: theme.colors.muted }]}>
                  Expires: {expires}
                </Text>
              </View>
              <Text style={[styles.amount, { color: theme.colors.text }]}>
                ₦{amount.toLocaleString()}
              </Text>
            </Glass>
          );
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "transparent" },
  safe: { backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    marginRight: 8,
  },
  headerCenter: { flex: 1, paddingLeft: 4 },
  title: { fontSize: 20, fontFamily: "Poppins_700Bold" },
  subtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontFamily: "Poppins_500Medium" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
  },
  left: { flex: 1 },
  category: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  expires: {
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    fontSize: 12,
  },
  amount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  lockActionWrap: { paddingHorizontal: 20, marginBottom: 12 },
  lockCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
  },
  lockCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  lockIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lockText: { flex: 1 },
  lockTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  lockSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  countBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  countText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
});
