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
  }) => (
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

        <View>
          <Text style={styles.transactionName}>
            {transaction.type === "DEPOSIT"
              ? "Received"
              : transaction.type === "LOCK"
              ? "Locked for " + transaction.recipientName
              : transaction.type === "TRANSFER"
              ? "Spent with " + transaction.recipientName.slice(0, 10)
              : transaction.type === "REFUND"
              ? "Refunded from " + transaction.recipientName + " category"
              : "Withdrawn"}
          </Text>
          <Text style={styles.transactionCategory}>{transaction.type}</Text>
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
            {
              color: transaction.entryType === "CREDIT" ? "#38B2AC" : "#1B263B",
            },
          ]}
        >
          {transaction.entryType === "CREDIT" ? "+" : "-"}₦{transaction.amount}
        </Text>
      </MotiView>
    </MotiView>
  );

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
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  transactionCategory: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    textTransform: "capitalize",
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
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
