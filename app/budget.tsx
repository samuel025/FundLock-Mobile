import { CategoryPicker } from "@/components/CategoryPicker";
import { ExpireDatePicker } from "@/components/ExpireDatePicker";
import { PinGuard } from "@/components/PinGuard";
import { useToastConfig } from "@/config/toastConfig";
import { useCategory } from "@/hooks/useCategory";
import { useGetLocks } from "@/hooks/useGetLocks";
import { useLock } from "@/hooks/useLock";
import { useWallet } from "@/hooks/useWallet";
import { walletStore } from "@/lib/walletStore";
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
import BlurView from "expo-blur/build/BlurView";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const schema = yup.object({
  amount: yup
    .number()
    .transform((value, original) =>
      original === "" ? undefined : Number(original),
    )
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required("PIN is required"),
  expireAt: yup
    .date()
    .nullable()
    .typeError("Select a valid date")
    .when("$isTopUp", {
      is: false,
      then: (schema) =>
        schema
          .required("Expiration date is required")
          .min(new Date(), "Expiration must be in the future"),
      otherwise: (schema) => schema.optional(),
    }),
});

type FormData = yup.InferType<typeof schema>;

export default function Budget() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const router = useRouter();
  const toastConfig = useToastConfig();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const { categories } = useCategory();
  const { isLocking, lockError, lockMessage, lockFunds } = useLock();
  const { fetchWalletData } = useWallet();
  const { locksList, fetchLocks } = useGetLocks();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useFocusEffect(
    useCallback(() => {
      fetchLocks();
    }, [fetchLocks]),
  );

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId, categories],
  );

  const existingBudget = useMemo(() => {
    if (!selectedCategory || !locksList) return null;
    return locksList.find(
      (lock: any) =>
        String(lock.categoryName).toLowerCase() ===
        String(selectedCategory.name).toLowerCase(),
    );
  }, [selectedCategory, locksList]);

  const { control, handleSubmit, formState, reset, trigger } =
    useForm<FormData>({
      resolver: yupResolver(schema) as any,
      context: { isTopUp: !!existingBudget },
      defaultValues: {
        amount: undefined as any,
        pin: "",
        expireAt: null as any,
      },
      mode: "onChange",
    });

  // Auto-populate expireAt when existing budget is found
  useEffect(() => {
    if (existingBudget) {
      // Use existing budget's expiration date
      const existingDate = new Date(existingBudget.expiresAt);
      reset(
        {
          amount: undefined as any,
          pin: "",
          expireAt: existingDate,
        },
        {
          keepErrors: false,
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepSubmitCount: false,
        },
      );
      // Recompute form validity after reset with new context
      setTimeout(() => trigger(), 0);
    }
  }, [existingBudget, reset, trigger]);

  const onSubmit = (data: FormData) => {
    if (!selectedCategory) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select a category",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    // Require expireAt only when creating a new budget
    if (!existingBudget && !data.expireAt) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Expiration date is required",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    const numericBalance = Number(balance) || 0;
    if (data.amount > numericBalance) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Insufficient balance",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    const expiresAtDate =
      data.expireAt ??
      (existingBudget ? new Date(existingBudget.expiresAt) : null);

    lockFunds({
      amountLocked: String(data.amount),
      category_id: selectedCategory.id,
      expiresAt: expiresAtDate
        ? expiresAtDate.toISOString().split("T")[0]
        : (undefined as any),
      pin: data.pin,
    });
  };

  const balance = walletStore((state) => state.balance);

  useEffect(() => {
    if (lockError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: lockError,
        position: "top",
        topOffset:
          Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 20,
      });
    }
    if (lockMessage) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: lockMessage,
        position: "top",
        topOffset:
          Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 20,
      });
      reset();
      setSelectedCategoryId(null);
      fetchWalletData();
      fetchLocks();
    }
  }, [lockError, lockMessage]);

  if (!fontsLoaded) return null;

  const Glass = ({
    children,
    style,
    radius = 12,
  }: {
    children: React.ReactNode;
    style?: any;
    radius?: number;
  }) => {
    if (!isDark) {
      return <View style={style}>{children}</View>;
    }
    return (
      <View
        style={[
          style,
          {
            position: "relative",
            overflow: "hidden",
            borderRadius: radius,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
          },
        ]}
      >
        <BlurView
          intensity={30}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        {children}
      </View>
    );
  };

  return (
    <>
      <PinGuard>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          style={styles.container}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? 0 : (StatusBar.currentHeight ?? 0)
            }
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  accessibilityLabel="Go back"
                  style={styles.backButton}
                >
                  <Glass
                    radius={12}
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : theme.colors.card,
                      },
                    ]}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={theme.colors.primary}
                    />
                  </Glass>
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                  <Text
                    style={[styles.lockTitle, { color: theme.colors.text }]}
                  >
                    Budget Funds
                  </Text>
                  <Text style={styles.subtitle}>
                    Set aside money for a category
                  </Text>
                </View>

                <Glass
                  radius={12}
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : theme.colors.card,
                    },
                  ]}
                >
                  <Ionicons name="lock-closed" size={26} color="#38B2AC" />
                </Glass>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose category</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Glass
                    style={[
                      styles.loadingRow,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : theme.colors.card,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.pickerText, { color: theme.colors.text }]}
                    >
                      {selectedCategory
                        ? selectedCategory.name
                        : "Select a category"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#778DA9" />
                  </Glass>
                </TouchableOpacity>
                <CategoryPicker
                  visible={categoryModalVisible}
                  categories={categories || []}
                  selectedCategoryId={selectedCategoryId}
                  onSelect={setSelectedCategoryId}
                  onClose={() => setCategoryModalVisible(false)}
                />
              </View>

              {selectedCategory && (
                <>
                  {/* Show info banner if budget exists */}
                  {existingBudget && (
                    <View
                      style={[
                        styles.infoBanner,
                        {
                          backgroundColor: isDark
                            ? "rgba(59, 130, 246, 0.15)"
                            : "#EFF6FF",
                          borderLeftColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Ionicons
                        name="information-circle"
                        size={20}
                        color={theme.colors.primary}
                        style={styles.infoBannerIcon}
                      />
                      <View style={styles.infoBannerContent}>
                        <Text
                          style={[
                            styles.infoBannerTitle,
                            { color: theme.colors.text },
                          ]}
                        >
                          Existing Budget Found
                        </Text>
                        <Text
                          style={[
                            styles.infoBannerText,
                            { color: theme.colors.muted },
                          ]}
                        >
                          Current Budget: ₦
                          {Number(existingBudget.amount || 0).toLocaleString()}
                          {"\n"}
                          Expires:{" "}
                          {new Date(
                            existingBudget.expiresAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {"\n"}
                          This will top up your existing budget.
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Amount</Text>
                    <View style={styles.inputCard}>
                      <Controller
                        control={control}
                        name="amount"
                        render={({
                          field: { onChange, value },
                          fieldState,
                        }) => {
                          // Format value for display with commas
                          const displayValue =
                            value !== undefined && value !== null
                              ? Number(value).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })
                              : "";

                          return (
                            <>
                              <TextInput
                                mode="outlined"
                                label="Amount to budget"
                                value={displayValue}
                                onChangeText={(t) => {
                                  let cleaned = t
                                    .replace(/,/g, "")
                                    .replace(/[^0-9.]/g, "");
                                  cleaned = cleaned.replace(/\.(?=.*\.)/g, "");

                                  const numericBalance = Number(balance) || 0;
                                  const parsed = Number(cleaned);

                                  if (!cleaned) {
                                    onChange(undefined as any);
                                    return;
                                  }
                                  if (
                                    !isNaN(parsed) &&
                                    parsed > numericBalance
                                  ) {
                                    onChange(numericBalance);
                                    return;
                                  }

                                  onChange(cleaned);
                                }}
                                keyboardType={
                                  Platform.OS === "ios"
                                    ? "decimal-pad"
                                    : "numeric"
                                }
                                left={
                                  <TextInput.Icon
                                    icon={() => (
                                      <Text style={styles.currency}>₦</Text>
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
                                outlineStyle={{
                                  borderRadius: 12,
                                }}
                                theme={{
                                  fonts: {
                                    regular: {
                                      fontFamily: "Poppins_500Medium",
                                    },
                                  },
                                  colors: {
                                    primary: theme.colors.primary,
                                    placeholder: isDark
                                      ? "rgba(255,255,255,0.5)"
                                      : theme.colors.muted,
                                    text: theme.colors.text,
                                    onSurfaceVariant: isDark
                                      ? "rgba(255,255,255,0.6)"
                                      : theme.colors.muted,
                                    background: isDark
                                      ? theme.colors.background
                                      : theme.colors.surface,
                                    onSurface: theme.colors.text,
                                    outline: isDark
                                      ? "rgba(255,255,255,0.2)"
                                      : theme.colors.border,
                                    surfaceVariant: isDark
                                      ? theme.colors.background
                                      : theme.colors.surface,
                                  },
                                }}
                              />
                              {fieldState.error && (
                                <Text style={styles.inputError}>
                                  {fieldState.error.message}
                                </Text>
                              )}
                              <Text style={styles.hint}>
                                Available: ₦
                                {Number(balance || 0).toLocaleString()}
                              </Text>
                            </>
                          );
                        }}
                      />
                    </View>
                  </View>

                  {!existingBudget && (
                    <View style={styles.section}>
                      <Controller
                        control={control}
                        name="expireAt"
                        render={({
                          field: { onChange, value },
                          fieldState,
                        }) => (
                          <ExpireDatePicker
                            value={value ?? null}
                            onChange={onChange}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </View>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PIN</Text>
                    <View style={styles.inputCard}>
                      <Controller
                        control={control}
                        name="pin"
                        render={({
                          field: { onChange, value },
                          fieldState,
                        }) => (
                          <>
                            <TextInput
                              mode="outlined"
                              label="4-digit PIN"
                              value={value}
                              onChangeText={(t) =>
                                onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                              }
                              keyboardType="number-pad"
                              secureTextEntry
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
                              outlineStyle={{
                                borderRadius: 12,
                              }}
                              theme={{
                                fonts: {
                                  regular: { fontFamily: "Poppins_500Medium" },
                                },
                                colors: {
                                  text: theme.colors.text,
                                  placeholder: isDark
                                    ? "rgba(255,255,255,0.5)"
                                    : theme.colors.muted,
                                  primary: theme.colors.primary,
                                  onSurfaceVariant: isDark
                                    ? "rgba(255,255,255,0.6)"
                                    : theme.colors.muted,
                                  background: isDark
                                    ? theme.colors.background
                                    : theme.colors.surface,
                                  onSurface: theme.colors.text,
                                  outline: isDark
                                    ? "rgba(255,255,255,0.2)"
                                    : theme.colors.border,
                                  surfaceVariant: isDark
                                    ? theme.colors.background
                                    : theme.colors.surface,
                                },
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
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      (isLocking || !formState.isValid) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLocking || !formState.isValid}
                  >
                    <LinearGradient
                      colors={["#38B2AC", "#2C9A92"]}
                      style={styles.actionGradient}
                    >
                      <Text style={styles.actionText}>
                        {isLocking
                          ? "Processing..."
                          : existingBudget
                            ? "Top Up Budget"
                            : "Budget Funds"}
                      </Text>
                      <Ionicons name="lock-closed" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </PinGuard>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    marginRight: 20,
    marginLeft: 15,
  },
  headerCenter: { flex: 1, paddingLeft: 4 },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 4,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerText: { flex: 1, fontFamily: "Poppins_500Medium" },
  inputCard: {
    padding: 0,
  },
  input: { backgroundColor: "transparent", fontSize: 16 },
  currency: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#38B2AC",
  },
  hint: {
    marginTop: 8,
    color: "#778DA9",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  actionButton: { marginTop: 20, borderRadius: 12, overflow: "hidden" },
  disabledButton: { opacity: 0.6 },
  actionGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  inputError: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_500Medium",
  },
  lockTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginBottom: 8,
  },
  infoBanner: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  infoBannerIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginBottom: 4,
  },
  infoBannerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
});
