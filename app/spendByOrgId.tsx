import { useToastConfig } from "@/config/toastConfig";
import { useSpendByOrgId } from "@/hooks/useSpendByOrgId";
import { getOutletByOrgId, OutletByOrgId } from "@/services/outlet";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message"; // Keep for Toast.show() calls
import * as yup from "yup";

const schema = yup.object({
  orgId: yup.string().required("Org ID is required"),
  amount: yup
    .number()
    .transform((value, original) =>
      original === "" ? undefined : Number(original)
    )
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required("PIN is required"),
});

type FormData = yup.InferType<typeof schema>;

// Moved outside the component to prevent re-creation on each render
const GlassCard = ({
  children,
  style,
  isDark,
  borderColor,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  isDark: boolean;
  borderColor: string;
}) => {
  if (!isDark) {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: borderColor,
          },
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <View
      style={[
        style,
        {
          backgroundColor: "rgba(255,255,255,0.05)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        },
      ]}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
};

export default function SpendByOrgId() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const toastConfig = useToastConfig();

  const [outlet, setOutlet] = useState<OutletByOrgId | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const scrollRef = useRef<any>(null);

  const { control, handleSubmit, watch, formState, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { orgId: "", amount: undefined as any, pin: "" },
    mode: "onChange",
  });

  const orgId = watch("orgId");

  const { spendLockedFundsByOrgID, spendError, spendMessage, isSpending } =
    useSpendByOrgId();

  useEffect(() => {
    if (spendError) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: spendError,
        position: "top",
        visibilityTime: 4000,
      });
    }
    if (spendMessage) {
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        text2: spendMessage,
        position: "top",
        visibilityTime: 4000,
      });
      reset();
      setOutlet(null);
    }
  }, [spendError, spendMessage, reset]);

  const handleFetchOutlet = async () => {
    setLoading(true);
    setOutlet(null);
    try {
      const data = await getOutletByOrgId(orgId.trim().toUpperCase());
      setOutlet(data);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Vendor Not Found",
        text2: err?.message || "Failed to fetch outlet",
        position: "top",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    await spendLockedFundsByOrgID(data);
  };

  const inputTheme = (error: boolean) => ({
    roundness: 12,
    colors: {
      primary: theme.colors.primary,
      outline: error
        ? theme.colors.danger
        : isDark
        ? "rgba(255,255,255,0.2)"
        : theme.colors.border,
      placeholder: isDark ? "rgba(255,255,255,0.5)" : theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: isDark ? "rgba(255,255,255,0.6)" : theme.colors.muted,
      background: isDark ? "rgba(255, 255, 255, 0.08)" : theme.colors.surface,
      surfaceVariant: isDark ? theme.colors.background : theme.colors.surface,
      onSurface: theme.colors.text,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#FFFFFF",
                },
              ]}
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Pay by Vendor ID
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
                Search and pay vendors instantly
              </Text>
            </View>

            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark
                    ? "rgba(56,178,172,0.15)"
                    : theme.colors.actionIconDepositBg,
                },
              ]}
            >
              <Ionicons
                name="storefront"
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>

          {/* Search Card */}
          <GlassCard
            style={styles.searchCard}
            isDark={isDark}
            borderColor={theme.colors.border}
          >
            <View style={styles.searchHeader}>
              <Ionicons name="search" size={20} color={theme.colors.primary} />
              <Text style={[styles.searchTitle, { color: theme.colors.text }]}>
                Find Vendor
              </Text>
            </View>

            <Controller
              control={control}
              name="orgId"
              render={({ field: { onChange, value }, fieldState }) => (
                <View style={styles.searchInputWrapper}>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter Vendor ID (e.g., ABC123)"
                    value={value}
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    outlineColor={
                      fieldState.error
                        ? theme.colors.danger
                        : isDark
                        ? "rgba(255,255,255,0.2)"
                        : theme.colors.border
                    }
                    activeOutlineColor={theme.colors.primary}
                    textColor={theme.colors.text}
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : theme.colors.surface,
                      },
                    ]}
                    contentStyle={styles.inputContent}
                    outlineStyle={{ borderRadius: 12 }}
                    theme={{
                      fonts: {
                        regular: { fontFamily: "Poppins_500Medium" },
                      },
                      colors: inputTheme(!!fieldState.error).colors,
                    }}
                    editable={!loading}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Ionicons
                            name="business-outline"
                            size={18}
                            color={
                              isDark
                                ? "rgba(255,255,255,0.5)"
                                : theme.colors.muted
                            }
                          />
                        )}
                      />
                    }
                  />
                  {fieldState.error && (
                    <Text
                      style={[
                        styles.inputError,
                        { color: theme.colors.danger },
                      ]}
                    >
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity
              style={[
                styles.searchButton,
                (loading || !orgId || orgId.length < 3) &&
                  styles.disabledButton,
              ]}
              onPress={handleFetchOutlet}
              disabled={loading || !orgId || orgId.length < 3}
            >
              <LinearGradient
                colors={[theme.colors.primary, "#2C9A92"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="search" size={18} color="#fff" />
                )}
                <Text style={styles.searchButtonText}>
                  {loading ? "Searching..." : "Search Vendor"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>

          {/* Outlet Result Card */}
          {outlet && (
            <GlassCard
              style={styles.resultCard}
              isDark={isDark}
              borderColor={theme.colors.border}
            >
              {/* Vendor Info Header */}
              <View style={styles.vendorHeader}>
                <View
                  style={[
                    styles.vendorAvatar,
                    {
                      backgroundColor: isDark
                        ? "rgba(56,178,172,0.2)"
                        : "#E6F7F5",
                    },
                  ]}
                >
                  <Ionicons name="storefront" size={28} color="#2C9A92" />
                </View>
                <View style={styles.vendorInfo}>
                  <Text
                    style={[styles.vendorName, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {(outlet as any).name ?? (outlet as any).outlet?.name}
                  </Text>
                  <View style={styles.vendorLocation}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={theme.colors.muted}
                    />
                    <Text
                      style={[
                        styles.vendorAddress,
                        { color: theme.colors.muted },
                      ]}
                      numberOfLines={2}
                    >
                      {(outlet as any).address ??
                        (outlet as any).outlet?.address}
                      {", "}
                      {(outlet as any).state ?? (outlet as any).outlet?.state}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.verifiedBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(72,187,120,0.2)"
                        : "#E6FFFA",
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={14} color="#48BB78" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : theme.colors.border,
                  },
                ]}
              />

              {/* Payment Form */}
              <View style={styles.paymentForm}>
                <Text
                  style={[
                    styles.formSectionTitle,
                    { color: theme.colors.text },
                  ]}
                >
                  Payment Details
                </Text>

                {/* Amount Input */}
                <View style={styles.formField}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.colors.muted }]}
                  >
                    Amount to Pay
                  </Text>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          placeholder="0.00"
                          value={value !== undefined ? String(value) : ""}
                          onChangeText={(t) => {
                            const cleaned = t
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*)\./g, "$1");
                            onChange(cleaned);
                          }}
                          keyboardType={
                            Platform.OS === "ios" ? "decimal-pad" : "numeric"
                          }
                          left={
                            <TextInput.Icon
                              icon={() => (
                                <Text
                                  style={[
                                    styles.currency,
                                    { color: theme.colors.primary },
                                  ]}
                                >
                                  ₦
                                </Text>
                              )}
                            />
                          }
                          outlineColor={
                            fieldState.error
                              ? theme.colors.danger
                              : isDark
                              ? "rgba(255,255,255,0.2)"
                              : theme.colors.border
                          }
                          activeOutlineColor={theme.colors.primary}
                          textColor={theme.colors.text}
                          style={[
                            styles.input,
                            {
                              backgroundColor: isDark
                                ? "rgba(255, 255, 255, 0.08)"
                                : theme.colors.surface,
                            },
                          ]}
                          contentStyle={styles.inputContent}
                          outlineStyle={{ borderRadius: 12 }}
                          theme={{
                            fonts: {
                              regular: { fontFamily: "Poppins_500Medium" },
                            },
                            colors: inputTheme(!!fieldState.error).colors,
                          }}
                        />
                        {fieldState.error && (
                          <Text
                            style={[
                              styles.inputError,
                              { color: theme.colors.danger },
                            ]}
                          >
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* PIN Input */}
                <View style={styles.formField}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.colors.muted }]}
                  >
                    Transaction PIN
                  </Text>
                  <Controller
                    control={control}
                    name="pin"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          placeholder="••••"
                          value={value}
                          onChangeText={(t) =>
                            onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                          }
                          keyboardType="number-pad"
                          secureTextEntry={!showPin}
                          left={
                            <TextInput.Icon
                              icon={() => (
                                <Ionicons
                                  name="lock-closed-outline"
                                  size={18}
                                  color={
                                    isDark
                                      ? "rgba(255,255,255,0.5)"
                                      : theme.colors.muted
                                  }
                                />
                              )}
                            />
                          }
                          right={
                            <TextInput.Icon
                              icon={showPin ? "eye-off-outline" : "eye-outline"}
                              onPress={() => setShowPin((s) => !s)}
                              color={
                                isDark
                                  ? "rgba(255,255,255,0.5)"
                                  : theme.colors.muted
                              }
                            />
                          }
                          outlineColor={
                            fieldState.error
                              ? theme.colors.danger
                              : isDark
                              ? "rgba(255,255,255,0.2)"
                              : theme.colors.border
                          }
                          activeOutlineColor={theme.colors.primary}
                          textColor={theme.colors.text}
                          style={[
                            styles.input,
                            {
                              backgroundColor: isDark
                                ? "rgba(255, 255, 255, 0.08)"
                                : theme.colors.surface,
                            },
                          ]}
                          contentStyle={styles.inputContent}
                          outlineStyle={{ borderRadius: 12 }}
                          theme={{
                            fonts: {
                              regular: { fontFamily: "Poppins_500Medium" },
                            },
                            colors: inputTheme(!!fieldState.error).colors,
                          }}
                          maxLength={4}
                        />
                        {fieldState.error && (
                          <Text
                            style={[
                              styles.inputError,
                              { color: theme.colors.danger },
                            ]}
                          >
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isSpending || !formState.isValid) && styles.disabledButton,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSpending || !formState.isValid}
              >
                <LinearGradient
                  colors={["#2C9A92", "#238276"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  {isSpending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={18} color="#fff" />
                  )}
                  <Text style={styles.submitButtonText}>
                    {isSpending ? "Processing Payment..." : "Confirm Payment"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* Empty State */}
          {!outlet && !loading && (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : theme.colors.surface,
                  },
                ]}
              >
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={theme.colors.muted}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                Search for a Vendor
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                Enter a vendor&apos;s unique ID above to find and pay them
                directly from your budgeted funds.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 20,
    }),
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search Card
  searchCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  searchInputWrapper: {
    marginBottom: 16,
  },
  searchButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  searchButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },

  // Result Card
  resultCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  vendorHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vendorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 14,
  },
  vendorName: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  vendorLocation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  vendorAddress: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    flex: 1,
    lineHeight: 18,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
    color: "#48BB78",
  },

  divider: {
    height: 1,
    marginVertical: 20,
  },

  // Payment Form
  paymentForm: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },

  // Inputs
  input: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  inputContent: {
    fontFamily: "Poppins_500Medium",
  },
  inputError: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
    marginLeft: 4,
  },
  currency: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },

  // Submit Button
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2C9A92",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },

  disabledButton: {
    opacity: 0.5,
  },
});
