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

export const options = { headerShown: false };

export default function LocksPage() {
  const router = useRouter();

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
    }, [fetchLocks])
  );

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>My Locks</Text>
            <Text style={styles.subtitle}>Active locked funds by category</Text>
          </View>

          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={26} color="#38B2AC" />
          </View>
        </View>
      </SafeAreaView>

      {/* Lock Funds button — navigates to the lock form */}
      <View style={styles.lockActionWrap}>
        <TouchableOpacity
          style={styles.lockCard}
          onPress={() => router.push("/lock")}
          accessibilityRole="button"
        >
          <View style={styles.lockCardLeft}>
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={18} color="#fff" />
            </View>
            <View style={styles.lockText}>
              <Text style={styles.lockTitle}>Lock Funds</Text>
              <Text style={styles.lockSubtitle}>
                Create a new locked savings
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2D3748" />
        </TouchableOpacity>
      </View>

      {/* List header / separator */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Your active locks</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{locksList.length}</Text>
        </View>
      </View>

      <FlatList
        data={locksList}
        keyExtractor={(item, index) => `${item.categoryName ?? index}`}
        refreshControl={
          <RefreshControl
            refreshing={isLocksLoading}
            onRefresh={onRefresh}
            colors={["#38B2AC"]}
            tintColor="#38B2AC"
          />
        }
        contentContainerStyle={locksList.length ? undefined : { flex: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No active locks</Text>
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
            <View style={styles.card}>
              <View style={styles.left}>
                <Text style={styles.category}>{category}</Text>
                <Text style={styles.expires}>Expires: {expires}</Text>
              </View>
              <Text style={styles.amount}>₦{amount.toLocaleString()}</Text>
            </View>
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
  title: { fontSize: 20, fontFamily: "Poppins_700Bold", color: "#1B263B" },
  subtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#778DA9", fontFamily: "Poppins_500Medium" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  left: { flex: 1 },
  category: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    fontSize: 16,
  },
  expires: { fontFamily: "Poppins_400Regular", color: "#778DA9", marginTop: 4 },
  amount: { fontFamily: "Poppins_600SemiBold", color: "#1B263B", fontSize: 16 },
  lockActionWrap: { paddingHorizontal: 20, marginBottom: 12 },
  lockCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#38B2AC",
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
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lockText: { flex: 1 },
  lockTitle: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  lockSubtitle: {
    color: "#E2E8F0",
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
    color: "#1B263B",
    fontSize: 18,
  },
  countBadge: {
    backgroundColor: "#38B2AC",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  countText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
});
