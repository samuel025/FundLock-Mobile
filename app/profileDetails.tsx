import { PinGuard } from "@/components/PinGuard";
import { ProfileHeader } from "@/components/profileComponents/ProfileHeader";
import { useAuthStore } from "@/lib/useAuthStore";
import { getProfile } from "@/services/profile";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileData = {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  hasBvn?: boolean;
  hasBankDetails?: boolean;
};

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | number | null;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const showValue =
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <View
      style={[
        styles.detailItem,
        {
          borderBottomColor: isDark
            ? "rgba(255,255,255,0.08)"
            : theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.detailIcon,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : theme.colors.card,
          },
        ]}
      >
        <Ionicons name={icon} size={16} color={theme.colors.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
          {showValue}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileDetails() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const a = user?.firstName?.charAt(0) ?? "U";
    const b = user?.lastName?.charAt(0) ?? "";
    return `${a}${b}`.toUpperCase();
  }, [user?.firstName, user?.lastName]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile();
        const p = res?.data?.Profile;
        if (mounted && p) {
          setProfile({
            id: p.id,
            email: p.email,
            firstName: p.firstName,
            lastName: p.lastName,
            phoneNumber: p.phoneNumber,
            hasBvn: p.hasBvn,
            hasBankDetails: p.hasBankDetails,
          });
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load profile details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const fullName = `${profile?.firstName ?? user?.firstName ?? ""} ${
    profile?.lastName ?? user?.lastName ?? ""
  }`.trim();

  const cardBg = isDark ? "rgba(255,255,255,0.06)" : theme.colors.card;
  const border = isDark ? "rgba(255,255,255,0.12)" : theme.colors.border;

  return (
    <PinGuard>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { backgroundColor: "transparent" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backBtn,
                {
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
                  borderColor: border,
                },
              ]}
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <Text style={[styles.topTitle, { color: theme.colors.text }]}>
              Profile Details
            </Text>

            <View style={{ width: 44 }} />
          </View>

          {/* Header */}
          <ProfileHeader
            initials={initials}
            firstName={profile?.firstName ?? user?.firstName}
            lastName={profile?.lastName ?? user?.lastName}
            email={profile?.email ?? user?.email}
          />

          {/* Personal Info */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="person-circle-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Personal info
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  style={[styles.loadingText, { color: theme.colors.muted }]}
                >
                  Loading your details...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorBox}>
                <Text
                  style={[styles.errorText, { color: theme.colors.danger }]}
                >
                  {error}
                </Text>
              </View>
            ) : (
              <>
                <DetailItem
                  icon="id-card"
                  label="Full name"
                  value={fullName || undefined}
                />
                <DetailItem
                  icon="mail"
                  label="Email"
                  value={profile?.email ?? user?.email}
                />
                <DetailItem
                  icon="call"
                  label="Phone number"
                  value={profile?.phoneNumber}
                />
              </>
            )}
          </View>

          {/* Verification & Bank */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={theme.colors.accent}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Verification & bank
              </Text>
            </View>

            <DetailItem
              icon="card"
              label="BVN status"
              value={profile?.hasBvn ?? !!user?.bvn ? "Added" : "Not added"}
            />
            <DetailItem
              icon="wallet"
              label="Bank details"
              value={
                profile?.hasBankDetails ?? !!user?.bankDetails
                  ? "Added"
                  : "Not added"
              }
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => router.push("/(tabs)/accountActions")}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={theme.colors.balanceText}
            />
            <Text
              style={[
                styles.primaryBtnText,
                { color: theme.colors.balanceText },
              ]}
            >
              Account actions
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </PinGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 8,
    }),
    paddingBottom: 40,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  topTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },

  // Sections
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },

  // Detail item
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  // Loading & error
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: { fontSize: 13, fontFamily: "Poppins_500Medium" },
  errorBox: { paddingVertical: 14 },
  errorText: { fontSize: 13, fontFamily: "Poppins_500Medium" },

  // CTA
  primaryBtn: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
});
