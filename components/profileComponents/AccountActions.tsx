import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AccountActions({
  onDeposit,
  onWithdraw,
  onVirtual,
  virtualExists,
}: {
  onDeposit: () => void;
  onWithdraw: () => void;
  onVirtual: () => void;
  virtualExists: boolean;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={onDeposit}>
          <View style={[styles.actionIcon, { backgroundColor: "#E7F6F2" }]}>
            <Ionicons name="add" size={20} color="#38B2AC" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Deposit</Text>
            <Text style={styles.rowSubtitle}>
              Generate payment link (Paystack)
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#778DA9" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={onWithdraw}>
          <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="cash-outline" size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Withdraw</Text>
            <Text style={styles.rowSubtitle}>
              Request money back to your bank
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#778DA9" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={onVirtual}>
          <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Virtual Account</Text>
            <Text style={styles.rowSubtitle}>
              {virtualExists
                ? "View virtual account"
                : "Create a virtual account"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#778DA9" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 8,
    overflow: "hidden",
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    fontSize: 15,
  },
  rowSubtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 72 },
});
