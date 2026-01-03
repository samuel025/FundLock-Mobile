import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecentActivityList({
  transactions,
  onPressViewAll,
  onPressTransaction,
  limit = 3,
}: {
  transactions?: any[];
  onPressViewAll: () => void;
  onPressTransaction: (reference: string) => void;
  limit?: number;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const items = useMemo(
    () => (transactions ?? []).slice(0, limit),
    [transactions, limit]
  );

  const getTitle = useCallback((t: any) => {
    switch (t.type) {
      case "DEPOSIT":
        return "Received";
      case "LOCK":
        return t.recipientName ? "Budgeted" : "Budgeted";
      case "TRANSFER":
        return t.entryType === "CREDIT" ? "Received" : "Sent";
      case "REFUND":
        return "Refunded";
      default:
        return t.type || "Transaction";
    }
  }, []);

  const getRecipient = (t: any) =>
    t.type === "DEPOSIT" ? "DEPOSIT" : t.recipientName || "";

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    try {
      // Append 'Z' if not present to indicate UTC
      const utcString = iso.endsWith("Z") ? iso : iso + "Z";
      return new Date(utcString).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Lagos",
      });
    } catch {
      return iso;
    }
  };

  const formatAmount = (t: any) =>
    `${t.entryType === "CREDIT" ? "+" : "-"}₦${Number(t.amount).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  return (
    <View style={styles.recentActivity}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Activity
        </Text>
        <TouchableOpacity onPress={onPressViewAll}>
          <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {items.length > 0 ? (
        items.map((transaction, index) => (
          <TouchableOpacity
            key={transaction.reference ?? String(index)}
            onPress={() => onPressTransaction(transaction.reference)}
            activeOpacity={0.7}
            style={[
              styles.activityItem,
              isDark
                ? {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  }
                : { backgroundColor: theme.colors.surface },
            ]}
          >
            {isDark && (
              <BlurView
                intensity={30}
                tint="dark"
                pointerEvents="none"
                style={styles.activityBlur}
              />
            )}

            <View
              style={[
                styles.activityIcon,
                {
                  backgroundColor:
                    transaction.entryType === "CREDIT"
                      ? theme.colors.actionIconDepositBg
                      : theme.colors.actionIconSpendBg,
                },
              ]}
            >
              <Ionicons
                name={
                  transaction.entryType === "CREDIT" ? "arrow-down" : "arrow-up"
                }
                size={20}
                color={
                  transaction.entryType === "CREDIT"
                    ? theme.colors.primary
                    : theme.colors.danger
                }
              />
            </View>

            <View style={styles.activityDetails}>
              <View style={styles.activityTitleRow}>
                <Text
                  style={[styles.activityLabel, { color: theme.colors.muted }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getTitle(transaction)}
                </Text>
                <Text
                  style={[
                    styles.activityRecipient,
                    { color: theme.colors.text },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getRecipient(transaction)}
                </Text>
              </View>

              <Text
                style={[styles.activityDate, { color: theme.colors.muted }]}
              >
                {formatDateTime(transaction.createdAt)}
              </Text>
            </View>

            <Text
              style={[
                styles.activityAmount,
                {
                  color:
                    transaction.entryType === "CREDIT"
                      ? theme.colors.primary
                      : theme.colors.danger,
                },
              ]}
            >
              {formatAmount(transaction)}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="document-text-outline"
            size={48}
            color={theme.colors.emptyStateIcon}
          />
          <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
            No recent activity
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recentActivity: {
    paddingHorizontal: 20,
    marginTop: 8,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  viewAll: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activityDetails: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  activityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityLabel: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  activityRecipient: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    flexShrink: 1,
    maxWidth: "70%",
  },
  activityDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    minWidth: 110,
    textAlign: "right",
    flexShrink: 0,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  activityBlur: {
    ...StyleSheet.absoluteFillObject,
  },
});
