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
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as yup from "yup";

const mockUser = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
};

function makeId(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < length; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const depositSchema = yup.object({
  amount: yup
    .number()
    .transform((v, o) => (o === "" ? undefined : Number(o)))
    .typeError("Enter a valid amount")
    .positive()
    .required(),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required(),
});

const withdrawSchema = depositSchema;

type DepositForm = yup.InferType<typeof depositSchema>;

export default function Profile() {
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [virtualModal, setVirtualModal] = useState(false);
  const [depositLink, setDepositLink] = useState<string | null>(null);
  const [virtualAccount, setVirtualAccount] = useState<{
    accountNumber: string;
    bank: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const userInitials = useMemo(
    () =>
      `${mockUser.firstName?.charAt(0) ?? "U"}${
        mockUser.lastName?.charAt(0) ?? ""
      }`.toUpperCase(),
    []
  );

  const {
    control: depositControl,
    handleSubmit: handleDepositSubmit,
    formState: depositState,
  } = useForm<DepositForm>({
    resolver: yupResolver(depositSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });
  const {
    control: withdrawControl,
    handleSubmit: handleWithdrawSubmit,
    formState: withdrawState,
  } = useForm<DepositForm>({
    resolver: yupResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });

  const generateDepositLink = (data: DepositForm) => {
    setIsGenerating(true);
    setTimeout(() => {
      const id = makeId(10);
      const url = `https://paystack.com/pay/${id}`;
      setDepositLink(url);
      setIsGenerating(false);
      setDepositModal(false);
      setTimeout(() => {
        Alert.alert("Deposit link generated", "Open link to complete payment", [
          { text: "Open", onPress: () => Linking.openURL(url) },
          { text: "Close", style: "cancel" },
        ]);
      }, 200);
    }, 900);
  };

  const handleWithdraw = (data: DepositForm) => {
    setWithdrawModal(false);
    Alert.alert(
      "Withdrawal requested",
      `₦${data.amount?.toLocaleString()} withdrawal initiated`
    );
  };

  const handleCreateVirtual = () => {
    if (virtualAccount) {
      setVirtualModal(true);
      return;
    }
    const acct = {
      accountNumber: String(1000000000 + Math.floor(Math.random() * 900000000)),
      bank: "Sample Bank",
    };
    setVirtualAccount(acct);
    setVirtualModal(true);
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>
                {mockUser.firstName} {mockUser.lastName}
              </Text>
              <Text style={styles.email}>{mockUser.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="settings-outline" size={20} color="#1B263B" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setDepositModal(true)}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E7F6F2" }]}>
                <Ionicons name="add" size={20} color="#38B2AC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Deposit</Text>
                <Text style={styles.rowSubtitle}>
                  Generate payment link (Paystack)
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#778DA9" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => setWithdrawModal(true)}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="cash-outline" size={20} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Withdraw</Text>
                <Text style={styles.rowSubtitle}>
                  Request money back to your bank
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#778DA9" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleCreateVirtual}>
              <View style={[styles.actionIcon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#4F46E5"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Virtual Account</Text>
                <Text style={styles.rowSubtitle}>
                  {virtualAccount
                    ? "View virtual account"
                    : "Create a virtual account"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#778DA9" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.version}>FundLock v1.0.0</Text>

        {/* Deposit Modal */}
        <Modal visible={depositModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
            >
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Generate Deposit Link</Text>
                <Controller
                  control={depositControl}
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
                        keyboardType="numeric"
                        style={{ marginBottom: 8 }}
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
                <Controller
                  control={depositControl}
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
                        style={{ marginBottom: 12 }}
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
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setDepositModal(false)}
                  >
                    <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonPrimary}
                    onPress={handleDepositSubmit(generateDepositLink)}
                    disabled={isGenerating}
                  >
                    <Text style={styles.modalButtonTextPrimary}>
                      {isGenerating ? "Generating..." : "Generate link"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Withdraw Modal */}
        <Modal visible={withdrawModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
            >
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Withdraw</Text>
                <Controller
                  control={withdrawControl}
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
                        keyboardType="numeric"
                        style={{ marginBottom: 8 }}
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
                <Controller
                  control={withdrawControl}
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
                        style={{ marginBottom: 12 }}
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
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setWithdrawModal(false)}
                  >
                    <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonPrimary}
                    onPress={handleWithdrawSubmit(handleWithdraw)}
                  >
                    <Text style={styles.modalButtonTextPrimary}>
                      Request Withdraw
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Virtual Account Modal */}
        <Modal visible={virtualModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
            >
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Virtual Account</Text>
                {virtualAccount ? (
                  <>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        color: "#1B263B",
                        marginBottom: 8,
                      }}
                    >
                      {virtualAccount.bank}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_400Regular",
                        color: "#415A77",
                        marginBottom: 12,
                      }}
                    >
                      Account number: {virtualAccount.accountNumber}
                    </Text>
                    <TouchableOpacity
                      style={styles.modalButtonPrimary}
                      onPress={() => {
                        setVirtualModal(false);
                        Alert.alert("Copied", "Account details copied");
                      }}
                    >
                      <Text style={styles.modalButtonTextPrimary}>
                        Copy / Use
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: "Poppins_400Regular",
                        color: "#415A77",
                        marginBottom: 12,
                      }}
                    >
                      No virtual account yet. Create one to receive deposits.
                    </Text>
                    <TouchableOpacity
                      style={styles.modalButtonPrimary}
                      onPress={() => {
                        handleCreateVirtual();
                      }}
                    >
                      <Text style={styles.modalButtonTextPrimary}>
                        Create Virtual Account
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => setVirtualModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
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
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
  },
  avatarText: { fontFamily: "Poppins_700Bold", color: "#1B263B", fontSize: 26 },
  name: { fontFamily: "Poppins_600SemiBold", color: "#1B263B", fontSize: 16 },
  email: {
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    fontSize: 13,
    marginTop: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  section: { marginTop: 8, marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 8,
    overflow: "hidden",
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1B263B",
    fontSize: 15,
  },
  rowSubtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 72 },
  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
    marginTop: 28,
  },
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
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextSecondary: {
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#38B2AC",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextPrimary: { fontFamily: "Poppins_600SemiBold", color: "#fff" },
  modalCloseText: {
    color: "#38B2AC",
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginTop: 8,
  },
  inputError: {
    fontFamily: "Poppins_400Regular",
    color: "#D9534F",
    marginTop: 4,
    fontSize: 12,
  },
});
