import { MessageBanner } from "@/components/MessageBanner";
import { useSpendByOrgId } from "@/hooks/useSpendByOrgId";
import { getOutletByOrgId, OutletByOrgId } from "@/services/outlet";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
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

export default function SpendByOrgId() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [outlet, setOutlet] = useState<OutletByOrgId | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const scrollRef = useRef<any>(null);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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
      setBanner({ message: spendError, type: "error" });
    }
    if (spendMessage) {
      setBanner({ message: spendMessage, type: "success" });
      reset();
      setOutlet(null);
    }
  }, [spendError, spendMessage, reset]);

  useEffect(() => {
    if (banner) {
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
      const timer = setTimeout(() => setBanner(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  const handleFetchOutlet = async () => {
    setLoading(true);
    setOutlet(null);
    try {
      const data = await getOutletByOrgId(orgId.trim().toUpperCase());
      setOutlet(data);
    } catch (err: any) {
      setBanner({
        message: err?.message || "Failed to fetch outlet",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    await spendLockedFundsByOrgID(data);
  };

  if (!fontsLoaded) return null;

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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
          {banner && (
            <MessageBanner
              message={banner.message}
              type={banner.type}
              onClose={() => setBanner(null)}
            />
          )}

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
                Spend by Org ID
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
                Quickly pay vendors using their Org ID
              </Text>
            </View>

            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? "rgba(56,178,172,0.15)" : "#E7F6F2",
                },
              ]}
            >
              <Ionicons name="storefront" size={20} color="#38B2AC" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
              Org ID
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : theme.colors.border,
                },
              ]}
            >
              <Controller
                control={control}
                name="orgId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <TextInput
                      mode="outlined"
                      placeholder="Enter Org ID"
                      value={value}
                      onChangeText={(text) => onChange(text.toUpperCase())}
                      outlineColor={
                        isDark ? "rgba(255,255,255,0.2)" : theme.colors.border
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
                      outlineStyle={{ borderRadius: 12 }}
                      theme={{
                        fonts: {
                          regular: { fontFamily: "Poppins_500Medium" },
                        },
                        colors: inputTheme(!!fieldState.error).colors,
                      }}
                      editable={!loading}
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

              <TouchableOpacity
                style={[
                  styles.fetchButton,
                  (loading || !orgId || orgId.length < 3) &&
                    styles.disabledButton,
                ]}
                onPress={handleFetchOutlet}
                disabled={loading || !orgId || orgId.length < 3}
              >
                <LinearGradient
                  colors={[theme.colors.primary, "#2C9A92"]}
                  style={styles.fetchGradient}
                >
                  <Ionicons name="search" size={16} color="#fff" />
                  <Text style={styles.fetchText}>
                    {loading ? "Searching..." : "Find Outlet"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {outlet && (
            <View
              style={[
                styles.outletCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.outletInfoRow,
                  {
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : theme.colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.outletIconContainer,
                    {
                      backgroundColor: isDark
                        ? "rgba(56,178,172,0.15)"
                        : "#E6F7F5",
                    },
                  ]}
                >
                  <Ionicons name="storefront" size={20} color="#2C9A92" />
                </View>
                <View style={styles.outletMeta}>
                  <Text
                    style={[styles.outletName, { color: theme.colors.text }]}
                  >
                    {(outlet as any).name ?? (outlet as any).outlet?.name}
                  </Text>
                  <Text
                    style={[styles.outletDetail, { color: theme.colors.muted }]}
                  >
                    {(outlet as any).address ?? (outlet as any).outlet?.address}
                    {", "}
                    {(outlet as any).state ?? (outlet as any).outlet?.state}
                  </Text>
                </View>
              </View>

              <View style={styles.verticalForm}>
                <View style={styles.fullWidthFormItem}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.colors.muted }]}
                  >
                    Amount
                  </Text>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          placeholder="Amount to spend"
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
                            isDark
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

                <View style={styles.fullWidthFormItem}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.colors.muted }]}
                  >
                    PIN
                  </Text>
                  <Controller
                    control={control}
                    name="pin"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          placeholder="4-digit PIN"
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
                                  size={20}
                                  color={
                                    isDark
                                      ? "rgba(255,255,255,0.6)"
                                      : theme.colors.muted
                                  }
                                />
                              )}
                            />
                          }
                          right={
                            <TextInput.Icon
                              icon={showPin ? "eye-off" : "eye"}
                              onPress={() => setShowPin((s) => !s)}
                            />
                          }
                          outlineColor={
                            isDark
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

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (isSpending || !formState.isValid) && styles.disabledButton,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSpending || !formState.isValid}
              >
                <LinearGradient
                  colors={["#2C9A92", "#238276"]}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>
                    {isSpending ? "Processing..." : "Pay Vendor"}
                  </Text>
                  <Ionicons name="card" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerCenter: { flex: 1, paddingHorizontal: 12 },
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
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },

  inputContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  input: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  inputError: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
    marginLeft: 4,
  },

  fetchButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 12,
  },
  disabledButton: { opacity: 0.5 },
  fetchGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  fetchText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  outletCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
  },
  outletInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  outletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  outletMeta: { flex: 1 },
  outletName: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  outletDetail: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    lineHeight: 18,
  },

  verticalForm: {
    flexDirection: "column",
    gap: 20,
    marginBottom: 20,
  },
  fullWidthFormItem: {
    width: "100%",
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },

  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2C9A92",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  currency: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});
