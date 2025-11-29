import { MessageBanner } from "@/components/MessageBanner";
import { PinGuard } from "@/components/PinGuard";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  Bank,
  getKoraBankList,
  saveBankDetails,
  verifyKoraBankAccount,
} from "@/services/bank";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

export default function AddBankDetails() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setBanksLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [accountName, setAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const scrollRef = React.useRef<ScrollView | null>(null);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (banner) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [banner]);

  const fetchBanks = async () => {
    setBanksLoading(true);
    try {
      const bankList = await getKoraBankList();
      setBanks(bankList);
    } catch (err: any) {
      setBanner({
        message: err?.message || "Failed to fetch banks",
        type: "error",
      });
    } finally {
      setBanksLoading(false);
    }
  };

  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks;
    const query = searchQuery.toLowerCase();
    return banks.filter((bank) => bank.name.toLowerCase().includes(query));
  }, [banks, searchQuery]);

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    // reset related verification state
    setAccountName("");
    setVerifyError("");
    if (accountNumber.length === 10) {
      // will retrigger effect
    }
    setShowBankModal(false);
    setSearchQuery("");
  };

  const handleSubmit = async () => {
    if (!selectedBank) {
      setBanner({ message: "Please select a bank", type: "error" });
      return;
    }
    if (!accountNumber || accountNumber.length !== 10) {
      setBanner({
        message: "Please enter a valid 10-digit account number",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(selectedBank.code + " " + accountNumber);
      const response = await saveBankDetails({
        bankCode: selectedBank.code,
        bankAccountNumber: accountNumber,
      });
      await authActions.getUser();
      setBanner({
        message: response.message || "Bank details saved successfully",
        type: "success",
      });

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      setBanner({
        message: err?.message || "Failed to save bank details",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Trigger verification when we have both bank and 10-digit account
    if (selectedBank && accountNumber.length === 10) {
      setIsVerifying(true);
      setAccountName("");
      setVerifyError("");
      verifyKoraBankAccount({
        bank: selectedBank.code,
        account: accountNumber,
      })
        .then((name) => {
          setAccountName(name);
        })
        .catch((err: any) => {
          setVerifyError(err?.message || "Failed to verify account");
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      // Clear when incomplete
      setAccountName("");
      setVerifyError("");
      setIsVerifying(false);
    }
  }, [selectedBank, accountNumber]);

  if (!fontsLoaded) return null;

  const isFormValid =
    !!selectedBank &&
    accountNumber.length === 10 &&
    !!accountName &&
    !isVerifying;

  return (
    <PinGuard>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {banner && (
              <MessageBanner
                message={banner.message}
                type={banner.type}
                onClose={() => setBanner(null)}
              />
            )}

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  styles.backButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : theme.colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  Add Bank Details
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
                  Provide your bank information for withdrawals
                </Text>
              </View>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : theme.colors.card,
                    borderWidth: isDark ? 1 : 0,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                  },
                ]}
              >
                <Ionicons
                  name="card-outline"
                  size={26}
                  color={theme.colors.primary}
                />
              </View>
            </View>

            {/* Info Card */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: isDark ? "rgba(56,178,172,0.1)" : "#E7F6F2",
                  borderColor: isDark ? "rgba(56,178,172,0.2)" : "transparent",
                },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.infoText, { color: theme.colors.muted }]}>
                  Your bank details are secure and will only be used for
                  processing withdrawals.
                </Text>
              </View>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : theme.colors.card,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : theme.colors.border,
                },
              ]}
            >
              {/* Bank Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Select Bank
                </Text>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.loadingText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Loading banks...
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.bankSelector,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "#F9FAFB",
                        borderColor: isDark
                          ? "rgba(255,255,255,0.15)"
                          : theme.colors.border,
                      },
                    ]}
                    onPress={() => setShowBankModal(true)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.bankSelectorText,
                          {
                            color: selectedBank
                              ? theme.colors.text
                              : theme.colors.muted,
                          },
                        ]}
                      >
                        {selectedBank?.name || "-- Select a bank --"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.muted}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Account Number */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Account Number
                </Text>
                <TextInput
                  mode="outlined"
                  dense
                  contentStyle={{
                    height: 32,
                    fontFamily: "Poppins_500Medium",
                    fontSize: 13,
                  }}
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChangeText={(text) =>
                    setAccountNumber(text.replace(/[^0-9]/g, "").slice(0, 10))
                  }
                  keyboardType="number-pad"
                  maxLength={10}
                  style={styles.input}
                  textColor={theme.colors.text}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      outline: isDark
                        ? "rgba(255,255,255,0.2)"
                        : theme.colors.border,
                      placeholder: isDark
                        ? "rgba(255,255,255,0.5)"
                        : theme.colors.muted,
                      onSurfaceVariant: isDark
                        ? "rgba(255,255,255,0.6)"
                        : theme.colors.muted,
                      background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB",
                      onSurface: theme.colors.text,
                    },
                    roundness: 10,
                    fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                  }}
                />
                <Text
                  style={[styles.helperText, { color: theme.colors.muted }]}
                >
                  {accountNumber.length}/10 digits
                </Text>
                {isVerifying && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 6,
                      gap: 8,
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.verifyingText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Verifying account...
                    </Text>
                  </View>
                )}
                {!isVerifying && accountName ? (
                  <Text
                    style={[
                      styles.accountNameText,
                      { color: theme.colors.primary, marginTop: 6 },
                    ]}
                  >
                    Account Name: {accountName}
                  </Text>
                ) : null}
                {!isVerifying && verifyError ? (
                  <Text
                    style={[
                      styles.helperText,
                      {
                        color: theme.colors.danger || "#FF4D4F",
                        marginTop: 4,
                      },
                    ]}
                  >
                    {verifyError}
                  </Text>
                ) : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.balanceText}
                    />
                    <Text
                      style={[
                        styles.submitButtonText,
                        {
                          color: theme.colors.balanceText,
                          marginLeft: 8,
                        },
                      ]}
                    >
                      Saving...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.submitButtonText,
                        { color: theme.colors.balanceText },
                      ]}
                    >
                      Save Bank Details
                    </Text>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.balanceText}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bank Selection Modal */}
        <Modal
          visible={showBankModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBankModal(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowBankModal(false)}
            >
              <Pressable
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: isDark
                      ? theme.colors.background
                      : theme.colors.card,
                  },
                ]}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text
                    style={[styles.modalTitle, { color: theme.colors.text }]}
                  >
                    Select Bank
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowBankModal(false);
                      setSearchQuery("");
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View
                  style={[
                    styles.searchContainer,
                    {
                      backgroundColor: "transparent",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="search"
                    size={18}
                    color={theme.colors.muted}
                  />
                  <TextInput
                    placeholder="Search banks..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    dense
                    contentStyle={{ height: 34, fontSize: 13 }}
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholderTextColor={theme.colors.muted}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{
                      colors: {
                        background: "transparent",
                      },
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={theme.colors.muted}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Bank List */}
                <FlatList
                  data={filteredBanks}
                  keyExtractor={(item) => item.code}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.bankItem,
                        {
                          backgroundColor:
                            selectedBank?.code === item.code
                              ? isDark
                                ? "rgba(56,178,172,0.15)"
                                : "#E7F6F2"
                              : "transparent",
                        },
                      ]}
                      onPress={() => handleBankSelect(item)}
                    >
                      <View
                        style={[
                          styles.bankIconContainer,
                          {
                            backgroundColor: isDark
                              ? "rgba(56,178,172,0.15)"
                              : "#E7F6F2",
                          },
                        ]}
                      >
                        <Ionicons
                          name="business"
                          size={18}
                          color={theme.colors.primary}
                        />
                      </View>
                      <Text
                        style={[styles.bankName, { color: theme.colors.text }]}
                      >
                        {item.name}
                      </Text>
                      {selectedBank?.code === item.code && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Ionicons
                        name="search-outline"
                        size={48}
                        color={theme.colors.muted}
                      />
                      <Text
                        style={[
                          styles.emptyText,
                          { color: theme.colors.muted },
                        ]}
                      >
                        No banks found
                      </Text>
                    </View>
                  }
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
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
      android: (StatusBar.currentHeight || 0) + 20,
    }),
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
  },
  formCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },
  bankSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
  },
  bankSelectorText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    height: 42,
  },
  helperText: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
  },
  verifyingText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  accountNameText: {
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    padding: 0,
    height: 30,
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  bankIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bankName: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    marginTop: 12,
  },
});
