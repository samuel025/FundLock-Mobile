import { useTheme } from "@/theme"; // + use theme
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AccountActions({
  onDeposit,
  onWithdraw,
  onVirtual,
  onSignOut,
  virtualExists,
  hasBvn,
  disabledStyle,
}: {
  onDeposit: () => void;
  onWithdraw: () => void;
  onVirtual: () => void;
  onSignOut?: () => void;
  virtualExists: boolean;
  hasBvn: boolean | undefined;
  disabledStyle?: any; // make optional
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const chevronColor = theme.colors.muted;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
        Account Actions
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#fff",
            borderColor: theme.colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <TouchableOpacity style={styles.row} onPress={onDeposit}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(56,178,172,0.15)" : "#E7F6F2" },
            ]}
          >
            <Ionicons name="add" size={20} color="#38B2AC" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Deposit
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.muted }]}>
              Generate payment link
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <TouchableOpacity style={styles.row} onPress={onWithdraw}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(217,119,6,0.15)" : "#FEF3C7" },
            ]}
          >
            <Ionicons name="cash-outline" size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Withdraw
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.muted }]}>
              Request money back to your bank
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <TouchableOpacity style={styles.row} onPress={onVirtual}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(79,70,229,0.15)" : "#E0E7FF" },
            ]}
          >
            <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Virtual Account
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.muted }]}>
              {virtualExists
                ? "View virtual account"
                : "Create a virtual account"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <TouchableOpacity
          style={[styles.row, hasBvn && disabledStyle]}
          onPress={() => router.push("/addBvn")}
          disabled={hasBvn}
          accessibilityState={{ disabled: !!hasBvn }}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(220,38,38,0.15)" : "#FEE2E2" },
            ]}
          >
            <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.rowTitle,
                { color: theme.colors.text },
                hasBvn && { opacity: 0.6 },
              ]}
            >
              Bank Verification Number
            </Text>
            <Text
              style={[
                styles.rowSubtitle,
                { color: theme.colors.muted },
                hasBvn && { opacity: 0.6 },
              ]}
            >
              {hasBvn ? "You already have a BVN" : "Add your BVN"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={hasBvn ? theme.colors.border : chevronColor}
          />
        </TouchableOpacity>

        {onSignOut && (
          <>
            <View
              style={[styles.divider, { backgroundColor: theme.colors.border }]}
            />
            <TouchableOpacity style={styles.row} onPress={onSignOut}>
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(220,38,38,0.12)"
                      : "#FFEFEF",
                  },
                ]}
              >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
                  Sign Out
                </Text>
                <Text
                  style={[styles.rowSubtitle, { color: theme.colors.muted }]}
                >
                  Sign out of your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={chevronColor} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    padding: 8,
    overflow: "hidden",
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  rowSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  divider: { height: 1, marginHorizontal: 8 },
});
