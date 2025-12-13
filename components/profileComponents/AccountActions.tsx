import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AccountActions({
  onViewProfileDetails,
  onWithdraw,
  onFundingDetails,
  onSignOut,
  fundingDetailsExist,
  hasBvn,
  disabledStyle,
  hasBankDetails,
}: {
  onViewProfileDetails: () => void;
  onWithdraw: () => void;
  onFundingDetails: () => void;
  onSignOut?: () => void;
  fundingDetailsExist: boolean;
  hasBvn: boolean | undefined;
  disabledStyle?: any;
  hasBankDetails: boolean | undefined;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const chevronColor = theme.colors.muted;

  const canUseBankTransfer = !!hasBvn;

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
        {/* Profile Details */}
        <TouchableOpacity
          style={styles.row}
          onPress={onViewProfileDetails}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#DBEAFE" },
            ]}
          >
            <Ionicons name="person-circle-outline" size={20} color="#3B82F6" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Profile details
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.muted }]}>
              View your personal information
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        {/* Bank Transfer (Funding Details) */}
        <TouchableOpacity
          style={[styles.row, !canUseBankTransfer && disabledStyle]}
          onPress={() => {
            if (!canUseBankTransfer) {
              router.push("/addBvn");
              return;
            }
            onFundingDetails();
          }}
          accessibilityState={{ disabled: !canUseBankTransfer }}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: isDark ? "rgba(79,70,229,0.15)" : "#E0E7FF" },
            ]}
          >
            <Ionicons name="card-outline" size={20} color="#4F46E5" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Bank Transfer
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.muted }]}>
              {!canUseBankTransfer
                ? "Add your BVN to enable bank transfer deposits"
                : fundingDetailsExist
                ? "View your bank transfer details"
                : "Create your bank transfer details"}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={!canUseBankTransfer ? theme.colors.border : chevronColor}
          />
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        {/* Withdraw (unchanged) */}
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

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <TouchableOpacity
          style={[styles.row, hasBankDetails && disabledStyle]}
          onPress={() => router.push("/addBankDetails")}
          disabled={hasBankDetails}
          accessibilityState={{ disabled: !!hasBankDetails }}
        >
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#D1FAE5",
              },
            ]}
          >
            <Ionicons name="card-outline" size={20} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.rowTitle,
                { color: theme.colors.text },
                hasBankDetails && { opacity: 0.6 },
              ]}
            >
              Bank Account Details
            </Text>
            <Text
              style={[
                styles.rowSubtitle,
                { color: theme.colors.muted },
                hasBankDetails && { opacity: 0.6 },
              ]}
            >
              {hasBankDetails
                ? "Bank details already added"
                : "Add your bank account"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={hasBankDetails ? theme.colors.border : chevronColor}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  divider: { height: 1, marginHorizontal: 14 },
});
