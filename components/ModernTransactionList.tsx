import { Transaction } from "@/services/wallet";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModernTransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function ModernTransactionList({
  transactions,
  isLoading,
}: ModernTransactionListProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Suggested", icon: null },
    { id: "travel", label: "Travel", icon: "airplane" },
    { id: "food", label: "Food", icon: "restaurant" },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
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

  return (
    <View>
      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            {filter.icon && (
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? "#FFFFFF" : "#415A77"}
              />
            )}
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Swipe for Insights */}
      <TouchableOpacity style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <Ionicons name="bulb" size={24} color="#F59E0B" />
        </View>
        <Text style={styles.insightText}>SWIPE FOR INSIGHTS</Text>
        <Ionicons name="chevron-forward" size={20} color="#1B263B" />
      </TouchableOpacity>

      {/* Transaction Items - Show ALL transactions instead of just 3 */}
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `${item.transactionReference}-${index}`}
        renderItem={({ item: transaction }) => (
          <View style={styles.transactionCard}>
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
                <Text style={styles.transactionEmoji}>
                  {transaction.type === "DEPOSIT"
                    ? "🎒"
                    : transaction.type === "WITHDRAWAL"
                    ? "🍔"
                    : "💎"}
                </Text>
              </View>
              <View>
                <Text style={styles.transactionName}>
                  {transaction.recipientName || "Unknown"}
                </Text>
                <Text style={styles.transactionCategory}>
                  {transaction.type}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    transaction.entryType === "CREDIT" ? "#38B2AC" : "#1B263B",
                },
              ]}
            >
              {transaction.entryType === "CREDIT" ? "+" : "-"}₦
              {transaction.amount}
            </Text>
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  filterChipActive: {
    backgroundColor: "#A78BFA",
    borderColor: "#A78BFA",
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#415A77",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B263B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
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
  transactionEmoji: {
    fontSize: 24,
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
});
