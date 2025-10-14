import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SavingsGoalCardProps {
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  daysLeft: number;
}

export default function SavingsGoalCard({
  goalName,
  currentAmount,
  targetAmount,
  daysLeft,
}: SavingsGoalCardProps) {
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={24} color="#F59E0B" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.goalName}>{goalName}</Text>
          <Text style={styles.daysLeft}>{daysLeft} days left</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
      </View>

      <View style={styles.amountContainer}>
        <View>
          <Text style={styles.amountLabel}>Current</Text>
          <Text style={styles.amount}>₦{currentAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.targetContainer}>
          <Text style={styles.amountLabel}>Target</Text>
          <Text style={styles.targetAmount}>
            ₦{targetAmount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
  },
  daysLeft: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#38B2AC",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#38B2AC",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
  },
  targetContainer: {
    alignItems: "flex-end",
  },
  targetAmount: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
  },
});
