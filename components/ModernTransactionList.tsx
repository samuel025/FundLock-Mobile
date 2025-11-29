import { Transaction } from "@/services/wallet";
import { useTheme } from "@/theme";
import { formatCurrency } from "@/utils/formatCurrency";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ModernTransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  hasNext?: boolean;
  currentPage?: number;
}

export default function ModernTransactionList({
  transactions,
  isLoading,
  isLoadingMore = false,
  onLoadMore,
  hasNext = false,
}: ModernTransactionListProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const renderIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <Ionicons
            name="arrow-down-circle"
            size={24}
            color={theme.colors.primary}
          />
        );
      case "WITHDRAWAL":
        return (
          <Ionicons
            name="arrow-up-circle"
            size={24}
            color={theme.colors.danger}
          />
        );
      case "LOCK":
        return (
          <Feather name="lock" size={22} color={theme.colors.actionIconLock} />
        );
      case "TRANSFER":
        return (
          <Ionicons
            name="swap-horizontal"
            size={24}
            color={theme.colors.accent}
          />
        );
      case "REFUND":
        return (
          <MaterialCommunityIcons
            name="cash-refund"
            size={24}
            color={theme.colors.actionIconRedeem}
          />
        );
      default:
        return (
          <Feather name="help-circle" size={22} color={theme.colors.muted} />
        );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.muted }]}>
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="receipt-outline"
          size={64}
          color={theme.colors.emptyStateIcon}
        />
        <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
          No transactions yet
        </Text>
      </View>
    );
  }

  const renderTransaction = ({
    item: transaction,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => {
    const getTitle = (t: Transaction) => {
      switch (t.type) {
        case "DEPOSIT":
          return "Received";
        case "LOCK":
          return t.recipientName ? `Budgeted` : "Budgeted";
        case "TRANSFER":
          return t.entryType === "CREDIT" ? "Received" : "Sent";
        case "REFUND":
          return "Refunded";
        case "WITHDRAWAL":
          return "Withdrawal";
        default:
          return t.type || "Transaction";
      }
    };

    const getRecipient = (t: any) =>
      t.type === "DEPOSIT" ? "DEPOSIT" : t.recipientName || t.reference || "";

    const formatDateTime = (iso?: string) => {
      if (!iso) return "";
      try {
        return new Date(iso).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } catch {
        return iso;
      }
    };

    const amountColor = (t: Transaction) =>
      t.entryType === "CREDIT" ? theme.colors.primary : theme.colors.danger;

    const iconBg = (() => {
      switch (transaction.type) {
        case "DEPOSIT":
          return theme.colors.actionIconDepositBg;
        case "WITHDRAWAL":
          return theme.colors.actionIconSpendBg;
        case "LOCK":
        case "TRANSFER":
          return theme.colors.actionIconLockBg;
        case "REFUND":
          return theme.colors.actionIconRedeemBg;
        default:
          return theme.colors.actionIconLockBg;
      }
    })();

    const getStatusColor = (status: string) => {
      const statusLower = status.toLowerCase();
      if (
        statusLower.includes("success") ||
        statusLower.includes("completed")
      ) {
        return theme.colors.primary;
      }
      if (
        statusLower.includes("pending") ||
        statusLower.includes("processing")
      ) {
        return "#F59E0B"; // amber/warning color
      }
      if (statusLower.includes("failed") || statusLower.includes("error")) {
        return theme.colors.danger;
      }
      return theme.colors.muted;
    };

    return (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          delay: index * 50,
          type: "timing",
          duration: 300,
        }}
        style={[
          styles.transactionCard,
          isDark
            ? {
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }
            : { backgroundColor: theme.colors.card },
        ]}
      >
        {isDark && (
          <BlurView
            intensity={25}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, { backgroundColor: iconBg }]}>
            <MotiView
              from={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              {renderIcon(transaction.type)}
            </MotiView>
          </View>

          <View style={styles.transactionDetails}>
            <View style={styles.transactionTitleRow}>
              <Text
                style={[styles.transactionLabel, { color: theme.colors.muted }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getTitle(transaction)}
              </Text>
              <Text
                style={[
                  styles.transactionRecipient,
                  { color: theme.colors.text },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getRecipient(transaction)}
              </Text>
            </View>
            <Text
              style={[styles.transactionDate, { color: theme.colors.muted }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatDateTime(transaction.createdAt)}
            </Text>
            {transaction.status && (
              <View style={styles.statusBadgeRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isDark
                        ? `${getStatusColor(transaction.status)}20`
                        : `${getStatusColor(transaction.status)}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(transaction.status) },
                    ]}
                  >
                    {transaction.status}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateX: 10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: index * 50 + 150, duration: 300 }}
          style={styles.amountContainer}
        >
          <Text
            style={[
              styles.transactionAmount,
              { color: amountColor(transaction) },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {transaction.entryType === "CREDIT" ? "+" : "-"}₦
            {formatCurrency(transaction.amount)}
          </Text>
        </MotiView>
      </MotiView>
    );
  };

  return (
    <View>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `${item.reference}-${index}`}
        renderItem={renderTransaction}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Auto-loading footer */}
      {isLoadingMore && (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.footerText, { color: theme.colors.muted }]}>
            Loading more...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Poppins_500Medium",
    marginTop: 12,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 10,
  },
  transactionCard: {
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
    overflow: "hidden",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
  transactionDetails: {
    flex: 1,
    minWidth: 0,
  },
  transactionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "100%",
  },
  transactionLabel: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  transactionRecipient: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    flexShrink: 1,
    maxWidth: "70%",
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  statusBadgeRow: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
  },
  amountContainer: {
    flexShrink: 0,
    minWidth: 100,
    maxWidth: 140,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "right",
  },
  loadMoreContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  loadMoreText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
});
