import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
  onAddMoney: () => void;
  onWithdraw: () => void;
  onSignOut: () => void;
}

export default function QuickActions({
  onAddMoney,
  onWithdraw,
  onSignOut,
  onSpend,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem} onPress={onAddMoney}>
          <View style={[styles.actionIcon, { backgroundColor: "#E7F6F2" }]}>
            <Ionicons name="add" size={24} color="#38B2AC" />
          </View>
          <Text style={styles.actionText}>Add Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onWithdraw}>
          <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="arrow-up" size={24} color="#DC2626" />
          </View>
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onSpend}>
          <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="swap-horizontal" size={24} color="#4F46E5" />
          </View>
          <Text style={styles.actionText}>Spend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onSignOut}>
          <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="log-out-outline" size={24} color="#D97706" />
          </View>
          <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#415A77",
  },
});
