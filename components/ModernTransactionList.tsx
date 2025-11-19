import { Transaction } from "@/services/wallet";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";

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
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateX: 10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: index * 50 + 150, duration: 300 }}
        >
          <Text
            style={[
              styles.transactionAmount,
              { color: amountColor(transaction) },
            ]}
          >
            {transaction.entryType === "CREDIT" ? "+" : "-"}₦
            {transaction.amount}
          </Text>
        </MotiView>
      </MotiView>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.footerText, { color: theme.colors.muted }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item, index) => `${item.reference}-${index}`}
      renderItem={renderTransaction}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
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
    marginRight: 12,
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
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    minWidth: 92,
    width: 92,
    textAlign: "right",
    flexShrink: 0,
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
