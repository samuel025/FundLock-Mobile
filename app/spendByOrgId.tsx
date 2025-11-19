import { MessageBanner } from "@/components/MessageBanner";
import { useSpendByOrgId } from "@/hooks/useSpendByOrgId";
import { getOutletByOrgId, OutletByOrgId } from "@/services/outlet";
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
  const [outlet, setOutlet] = useState<OutletByOrgId | null>(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
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
      setBanner({ message: spendError, type: "error" });
    }
    if (spendMessage) {
      setBanner({ message: spendMessage, type: "success" });
      reset();
    }
  }, [spendError, spendMessage]);

  useEffect(() => {
    if (banner) {
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
      const timer = setTimeout(() => setBanner(null), 5000);
      setOutlet(null);
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
      setBanner({ message: "Failed to fetch outlet", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    spendLockedFundsByOrgID(data);
    reset();
  };

  return (
    <LinearGradient colors={["#F8F9FA", "#FFFFFF"]} style={styles.container}>
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
              <Ionicons name="chevron-back" size={20} color="#1B263B" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.title}>Spend by Org ID</Text>
              <Text style={styles.subtitle}>
                Quickly pay vendors using their Org ID
              </Text>
            </View>

            <View style={styles.iconBox}>
              <Ionicons name="storefront" size={20} color="#38B2AC" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Org ID</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="orgId"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <TextInput
                      mode="outlined"
                      label="Enter Org ID"
                      value={value}
                      onChangeText={(text) => onChange(text.toUpperCase())}
                      outlineColor="#E6EEF0"
                      activeOutlineColor="#38B2AC"
                      style={styles.input}
                      theme={{
                        fonts: {
                          regular: { fontFamily: "Poppins_500Medium" },
                        },
                      }}
                      editable={!loading}
                    />
                    {fieldState.error && (
                      <Text style={styles.inputError}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <TouchableOpacity
                style={[
                  styles.fetchButton,
                  (loading || !orgId) && styles.disabledButton,
                ]}
                onPress={handleFetchOutlet}
                disabled={loading || !orgId}
              >
                <LinearGradient
                  colors={["#38B2AC", "#2C9A92"]}
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
            <View style={styles.outletCard}>
              <View style={styles.outletInfoRow}>
                <View style={styles.outletIconContainer}>
                  <Ionicons name="storefront" size={20} color="#2C9A92" />
                </View>
                <View style={styles.outletMeta}>
                  <Text style={styles.outletName}>
                    {(outlet as any).name ?? (outlet as any).outlet?.name}
                  </Text>
                  <Text style={styles.outletDetail}>
                    {(outlet as any).address ?? (outlet as any).outlet?.address}
                    {", "}
                    {(outlet as any).state ?? (outlet as any).outlet?.state}
                  </Text>
                </View>
              </View>

              {/* Stack fields vertically */}
              <View style={styles.verticalForm}>
                <View style={styles.fullWidthFormItem}>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          label="Amount"
                          value={value !== undefined ? String(value) : ""}
                          onChangeText={(t) =>
                            onChange(t.replace(/[^0-9.]/g, ""))
                          }
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
                          outlineColor="#E6EEF0"
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

                <View style={styles.fullWidthFormItem}>
                  <Controller
                    control={control}
                    name="pin"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <>
                        <TextInput
                          mode="outlined"
                          label="PIN"
                          value={value}
                          onChangeText={(t) =>
                            onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                          }
                          keyboardType="number-pad"
                          secureTextEntry
                          outlineColor="#E6EEF0"
                          activeOutlineColor="#38B2AC"
                          style={styles.input}
                          theme={{
                            fonts: {
                              regular: { fontFamily: "Poppins_500Medium" },
                            },
                          }}
                          maxLength={4}
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
                    {isSpending ? "Processing..." : "Pay vendor"}
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
      android: 20,
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
    backgroundColor: "#FFFFFF",
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
    color: "#1B263B",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
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
    color: "#415A77",
    marginBottom: 8,
  },

  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  input: {
    backgroundColor: "transparent",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  inputError: {
    color: "#DC2626",
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
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  outletInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  outletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E6F7F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  outletMeta: { flex: 1 },
  outletName: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    marginBottom: 4,
  },
  outletDetail: {
    color: "#64748B",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    lineHeight: 18,
  },

  verticalForm: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 20,
  },
  fullWidthFormItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
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
    color: "#2C9A92",
  },
});
