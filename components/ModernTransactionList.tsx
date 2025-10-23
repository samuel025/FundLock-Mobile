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

interface ModernTransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function ModernTransactionList({
  transactions,
  isLoading,
  isLoadingMore = false,
  onLoadMore,
}: ModernTransactionListProps) {
  // 🔹 Return different icons for each transaction type
  const renderIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <Ionicons name="arrow-down-circle" size={24} color="#38B2AC" />;
      case "WITHDRAWAL":
        return <Ionicons name="arrow-up-circle" size={24} color="#E53E3E" />;
      case "LOCK":
        return <Feather name="lock" size={22} color="#1E3A8A" />;
      case "TRANSFER":
        return <Ionicons name="swap-horizontal" size={24} color="#3182CE" />;
      case "REFUND":
        return (
          <MaterialCommunityIcons
            name="cash-refund"
            size={24}
            color="#4A5568"
          />
        );
      default:
        return <Feather name="help-circle" size={22} color="#A0AEC0" />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38B2AC" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color="#CED4DA" />
        <Text style={styles.emptyText}>No transactions yet</Text>
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
      // Keep titles short to avoid repeating sender name twice
      switch (t.type) {
        case "DEPOSIT":
          return "Received";
        case "LOCK":
          return t.recipientName ? `Locked` : "Locked";
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

    // amount color: green for credit, red for debit
    const amountColor = (t: Transaction) =>
      t.entryType === "CREDIT" ? "#38B2AC" : "#DC2626";

    return (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          delay: index * 50,
          type: "timing",
          duration: 300,
        }}
        style={styles.transactionCard}
      >
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              {
                backgroundColor:
                  transaction.type === "DEPOSIT"
                    ? "#E7F6F2"
                    : transaction.type === "WITHDRAWAL"
                    ? "#FEE2E2"
                    : "#E0E7FF",
              },
            ]}
          >
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
                style={styles.transactionLabel}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getTitle(transaction)}
              </Text>
              <Text
                style={styles.transactionRecipient}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getRecipient(transaction)}
              </Text>
            </View>
            <Text
              style={styles.transactionDate}
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
        <ActivityIndicator size="small" color="#38B2AC" />
        <Text style={styles.footerText}>Loading more...</Text>
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
    color: "#778DA9",
    fontFamily: "Poppins_500Medium",
    marginTop: 12,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    color: "#778DA9",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  // left column: icon + details - allow this column to shrink so amount stays visible
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
  // details should be able to shrink/wrap inside the left column
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
    color: "#778DA9",
  },
  transactionRecipient: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    flexShrink: 1,
    maxWidth: "70%", // prevent recipient from occupying entire row
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 2,
  },
  // amount container: fixed/min width, does not shrink
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
    color: "#778DA9",
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
});
