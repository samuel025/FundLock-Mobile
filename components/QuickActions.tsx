import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/theme";

interface QuickActionsProps {
  onAddMoney: () => void;
  onWithdraw: () => void;
  onSignOut: () => void;
  onSpend: () => void;
}

export default function QuickActions({
  onAddMoney,
  onWithdraw,
  onSignOut,
  onSpend,
}: QuickActionsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Quick actions
      </Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem} onPress={onAddMoney}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: theme.colors.actionIconDepositBg },
            ]}
          >
            <Ionicons name="add" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: theme.colors.muted }]}>
            Add Money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onWithdraw}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: theme.colors.actionIconSpendBg },
            ]}
          >
            <Ionicons name="arrow-up" size={24} color={theme.colors.danger} />
          </View>
          <Text style={[styles.actionText, { color: theme.colors.muted }]}>
            Withdraw
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onSpend}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: theme.colors.actionIconLockBg },
            ]}
          >
            <Ionicons
              name="swap-horizontal"
              size={24}
              color={theme.colors.accent}
            />
          </View>
          <Text style={[styles.actionText, { color: theme.colors.muted }]}>
            Spend
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onSignOut}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: theme.colors.actionIconRedeemBg },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.actionIconRedeem}
            />
          </View>
          <Text style={[styles.actionText, { color: theme.colors.muted }]}>
            Sign Out
          </Text>
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
  },
});
