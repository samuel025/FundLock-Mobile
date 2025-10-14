import { Transaction } from "@/services/wallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({
  transactions,
  isLoading,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <View style={styles.emptyTransactionsContainer}>
        <Ionicons name="receipt-outline" size={48} color="#415A77" />
        <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
      </View>
    );
  }

  return (
    <>
      {transactions.map((transaction, index) => (
        <View key={index} style={styles.transactionCard}>
          <View style={styles.iconContainer}>
            {transaction.type === "TRANSFER" ? (
              <Octicons name="arrow-switch" size={22} color="#1B263B" />
            ) : transaction.type === "DEPOSIT" ? (
              <Octicons name="arrow-up" size={22} color="#38B2AC" />
            ) : transaction.type === "WITHDRAWAL" ? (
              <Octicons name="arrow-down" size={22} color="#E53E3E" />
            ) : transaction.type === "REFUND" ? (
              <Octicons name="arrow-left" size={22} color="#38B2AC" />
            ) : null}
          </View>

          <View style={styles.transactionDetails}>
            <Text style={styles.recipientName}>
              {transaction.recipientName || "Unknown Recipient"}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(transaction.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    transaction.entryType === "CREDIT" ? "#38B2AC" : "#E53E3E",
                },
              ]}
            >
              {transaction.entryType === "CREDIT"
                ? `+₦${transaction.amount}`
                : `-₦${transaction.amount}`}
            </Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "rgba(72, 202, 228, 0.1)",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(56, 178, 172, 0.25)",
    borderWidth: 1,
    width: "90%",
    marginBottom: 16,
  },
  loadingText: {
    color: "#1B263B",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  emptyTransactionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTransactionsText: {
    marginTop: 10,
    color: "#415A77",
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "rgba(56, 178, 172, 0.15)",
    borderRadius: 12,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recipientName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1B263B",
  },
  transactionDate: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#778DA9",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
});
