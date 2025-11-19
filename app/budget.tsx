import { CategoryPicker } from "@/components/CategoryPicker";
import { ExpireDatePicker } from "@/components/ExpireDatePicker";
import { MessageBanner } from "@/components/MessageBanner";
import { PinGuard } from "@/components/PinGuard";
import { useCategory } from "@/hooks/useCategory";
import { useLock } from "@/hooks/useLock";
import { useWallet } from "@/hooks/useWallet";
import { walletStore } from "@/lib/walletStore";
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
import { useRouter } from "expo-router";
import { ScrollView } from "moti";
import { useEffect, useMemo, useState } from "react";
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
    .min(new Date(), "Expiration must be in the future")
    .required("Expiration date is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function Budget() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { categories } = useCategory();
  const { isLocking, lockError, lockMessage, lockFunds } = useLock();
  const { fetchWalletData } = useWallet();

  const balance = walletStore((state) => state.balance);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { control, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { amount: undefined as any, pin: "", expireAt: null as any },
    mode: "onChange",
  });

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId],
  );

  const onSubmit = (data: FormData) => {
    if (!selectedCategory) {
      setBanner({ message: "Select a category", type: "error" });
      return;
    }
    const numericBalance = Number(balance) || 0;
    if (data.amount > numericBalance) {
      setBanner({ message: "Insufficient balance", type: "error" });
      return;
    }
    lockFunds({
      amountLocked: String(data.amount),
      category_id: selectedCategory.id,
      expiresAt: data.expireAt.toISOString().split("T")[0],
      pin: data.pin,
    });
  };

  useEffect(() => {
    if (lockError) {
      setBanner({ message: lockError, type: "error" });
    }
    if (lockMessage) {
      setBanner({ message: lockMessage, type: "success" });
      reset();
      setSelectedCategoryId(null);
      fetchWalletData();
    }
  }, [lockError, lockMessage]);

  if (!fontsLoaded) return null;

  return (
    <PinGuard>
      <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
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
                style={styles.backButton}
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={22} color="#1B263B" />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.title}>Budget Funds</Text>
                <Text style={styles.subtitle}>
                  Set aside money for a category
                </Text>
              </View>
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed" size={26} color="#38B2AC" />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose category</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text style={styles.pickerText}>
                  {selectedCategory
                    ? selectedCategory.name
                    : "Select a category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#778DA9" />
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
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Amount</Text>
                  <View style={styles.inputCard}>
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field: { onChange, value }, fieldState }) => (
                        <>
                          <TextInput
                            mode="outlined"
                            label="Amount to budget"
                            value={value !== undefined ? String(value) : ""}
                            onChangeText={(t) => {
                              // allow only digits and decimal point, limit extra dots
                              let cleaned = t.replace(/[^0-9.]/g, "");
                              cleaned = cleaned.replace(/\.(?=.*\.)/g, ""); // remove extra dots

                              const numericBalance = Number(balance) || 0;
                              const parsed = Number(cleaned);

                              if (!cleaned) {
                                onChange(undefined as any);
                                return;
                              }
                              if (!isNaN(parsed) && parsed > numericBalance) {
                                const capped =
                                  Number.isInteger(numericBalance) ||
                                  cleaned.indexOf(".") === -1
                                    ? String(numericBalance)
                                    : String(Math.min(parsed, numericBalance));
                                onChange(capped);
                                return;
                              }

                              onChange(cleaned);
                            }}
                            keyboardType={
                              Platform.OS === "ios" ? "decimal-pad" : "numeric"
                            }
                            left={
                              <TextInput.Icon
                                icon={() => (
                                  <Text style={styles.currency}>₦</Text>
                                )}
                              />
                            }
                            outlineColor="#E2E8F0"
                            activeOutlineColor="#38B2AC"
                            style={styles.input}
                            theme={{
                              fonts: {
                                regular: { fontFamily: "Poppins_500Medium" },
                              },
                            }}
                          />
                          {fieldState.error && (
                            <Text style={styles.inputError}>
                              {fieldState.error.message}
                            </Text>
                          )}
                          <Text style={styles.hint}>
                            Available: ₦{Number(balance || 0).toLocaleString()}
                          </Text>
                        </>
                      )}
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Controller
                    control={control}
                    name="expireAt"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <ExpireDatePicker
                        value={value}
                        onChange={onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>PIN</Text>
                  <View style={styles.inputCard}>
                    <Controller
                      control={control}
                      name="pin"
                      render={({ field: { onChange, value }, fieldState }) => (
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
                            outlineColor="#E2E8F0"
                            activeOutlineColor="#38B2AC"
                            style={styles.input}
                            theme={{
                              fonts: {
                                regular: { fontFamily: "Poppins_500Medium" },
                              },
                            }}
                          />
                          {fieldState.error && (
                            <Text style={styles.inputError}>
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
                    (isLocking || !formState.isValid) && styles.disabledButton,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLocking || !formState.isValid}
                >
                  <LinearGradient
                    colors={["#38B2AC", "#2C9A92"]}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionText}>
                      {isLocking ? "Locking..." : "Budget Funds"}
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
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    marginRight: 8,
  },
  headerCenter: { flex: 1, paddingLeft: 4 },
  title: { fontSize: 26, fontFamily: "Poppins_700Bold", color: "#1B263B" },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 4,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  pickerLeft: { marginRight: 12 },
  pickerText: { flex: 1, fontFamily: "Poppins_500Medium", color: "#1B263B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  modalItemText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
  },
  modalClose: { marginTop: 12, alignItems: "center" },
  modalCloseText: { color: "#38B2AC", fontFamily: "Poppins_600SemiBold" },
  categoryIcon: {
    width: 35,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
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
  itemSeparator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 56 },
});
