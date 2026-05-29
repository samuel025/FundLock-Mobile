import { BankPicker } from "@/components/BankPicker";
import { Glass } from "@/components/Glass";
import { Bank, getKoraBankList, verifyKoraBankAccount } from "@/services/bank";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

export interface VendorAccountRef {
  getVendors: () => {
    vendorName: string;
    bankCode: string;
    accountNumber: string;
    bankName: string;
    accountName: string;
  }[];
  isVendorActiveAndIncomplete: () => boolean;
  reset: () => void;
}

export const VendorAccountSection = forwardRef<VendorAccountRef, {}>(
  (props, ref) => {
    const { theme, scheme } = useTheme();
    const isDark = scheme === "dark";

    const [showVendorAccount, setShowVendorAccount] = useState(false);
    const [vendorName, setVendorName] = useState("");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [banksLoading, setBanksLoading] = useState(false);
    const [showBankPicker, setShowBankPicker] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [vendorsList, setVendorsList] = useState<any[]>([]);

    useEffect(() => {
      if (showVendorAccount && banks.length === 0) {
        setBanksLoading(true);
        getKoraBankList()
          .then((b) => setBanks(b))
          .catch(() => {})
          .finally(() => setBanksLoading(false));
      }
    }, [showVendorAccount, banks.length]);

    useEffect(() => {
      if (selectedBank && accountNumber.length === 10) {
        setIsVerifying(true);
        setAccountName("");
        setVerifyError("");
        verifyKoraBankAccount({
          bank: selectedBank.code,
          account: accountNumber,
        })
          .then((name) => setAccountName(name))
          .catch((err: any) =>
            setVerifyError(err?.message || "Verification failed"),
          )
          .finally(() => setIsVerifying(false));
      } else {
        setAccountName("");
        setVerifyError("");
        setIsVerifying(false);
      }
    }, [selectedBank, accountNumber]);

    useImperativeHandle(ref, () => ({
      getVendors: () => {
        if (!showVendorAccount) return [];
        const allVendors = [...vendorsList];
        const activeVendorOk =
          vendorName.trim() &&
          selectedBank &&
          accountNumber.length === 10 &&
          accountName;

        if (activeVendorOk && selectedBank) {
          allVendors.push({
            vendorName,
            bankCode: selectedBank.code,
            accountNumber,
            accountName,
            bankName: selectedBank.name,
          });
        }
        return allVendors;
      },
      isVendorActiveAndIncomplete: () => {
        if (!showVendorAccount) return false;
        const activeVendorOk =
          vendorName.trim() &&
          selectedBank &&
          accountNumber.length === 10 &&
          accountName;
        if (!activeVendorOk && vendorsList.length === 0) {
          return true;
        }
        return false;
      },
      reset: () => {
        setShowVendorAccount(false);
        setVendorName("");
        setSelectedBank(null);
        setAccountNumber("");
        setAccountName("");
        setVendorsList([]);
      },
    }));

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setShowVendorAccount(!showVendorAccount)}
        >
          <View style={styles.toggleRowLeft}>
            <Ionicons
              name={showVendorAccount ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={
                showVendorAccount ? theme.colors.primary : theme.colors.muted
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                { marginBottom: 0, marginLeft: 8, color: theme.colors.text },
              ]}
            >
              Add Vendor Account (Optional)
            </Text>
          </View>
          <Ionicons
            name={showVendorAccount ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.colors.muted}
          />
        </TouchableOpacity>

        {showVendorAccount && (
          <View style={styles.vendorContainer}>
            <View style={styles.inputCard}>
              <TextInput
                mode="outlined"
                label="Vendor Name (e.g., Mama Nkechi)"
                value={vendorName}
                onChangeText={setVendorName}
                textColor={theme.colors.text}
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : theme.colors.surface,
                  },
                ]}
                outlineColor={
                  isDark ? "rgba(255,255,255,0.2)" : theme.colors.border
                }
                activeOutlineColor={theme.colors.primary}
                outlineStyle={{ borderRadius: 12 }}
                theme={{
                  fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                  colors: {
                    background: isDark
                      ? theme.colors.background
                      : theme.colors.surface,
                    onSurface: theme.colors.text,
                  },
                }}
              />
            </View>

            <View style={styles.inputCard}>
              <TouchableOpacity
                style={[styles.pickerButton, { marginTop: 12 }]}
                onPress={() => setShowBankPicker(true)}
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
                    style={[
                      styles.pickerText,
                      {
                        color: selectedBank
                          ? theme.colors.text
                          : theme.colors.muted,
                      },
                    ]}
                  >
                    {selectedBank ? selectedBank.name : "Select Bank"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#778DA9" />
                </Glass>
              </TouchableOpacity>
            </View>

            <View style={styles.inputCard}>
              <TextInput
                mode="outlined"
                label="10-digit Account Number"
                value={accountNumber}
                onChangeText={(val) =>
                  setAccountNumber(val.replace(/[^0-9]/g, "").slice(0, 10))
                }
                keyboardType="number-pad"
                textColor={theme.colors.text}
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : theme.colors.surface,
                  },
                ]}
                outlineColor={
                  isDark ? "rgba(255,255,255,0.2)" : theme.colors.border
                }
                activeOutlineColor={theme.colors.primary}
                outlineStyle={{ borderRadius: 12 }}
                theme={{
                  fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                  colors: {
                    background: isDark
                      ? theme.colors.background
                      : theme.colors.surface,
                    onSurface: theme.colors.text,
                  },
                }}
              />
              {isVerifying && (
                <Text style={[styles.hint, { color: theme.colors.primary }]}>
                  Verifying account...
                </Text>
              )}
              {verifyError ? (
                <Text
                  style={[styles.inputError, { color: theme.colors.danger }]}
                >
                  {verifyError}
                </Text>
              ) : null}
              {accountName ? (
                <Text style={[styles.hint, { color: theme.colors.success }]}>
                  {accountName}
                </Text>
              ) : null}
            </View>

            {/* Add to List Button */}
            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: theme.colors.primary,
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
                opacity:
                  vendorName.trim() &&
                  selectedBank &&
                  accountNumber.length === 10 &&
                  accountName &&
                  !isVerifying
                    ? 1
                    : 0.5,
              }}
              disabled={
                !(
                  vendorName.trim() &&
                  selectedBank &&
                  accountNumber.length === 10 &&
                  accountName &&
                  !isVerifying
                )
              }
              onPress={() => {
                if (!selectedBank) return;
                setVendorsList([
                  ...vendorsList,
                  {
                    vendorName,
                    bankCode: selectedBank.code,
                    bankName: selectedBank.name,
                    accountNumber,
                    accountName,
                  },
                ]);
                setVendorName("");
                setSelectedBank(null);
                setAccountNumber("");
                setAccountName("");
              }}
            >
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                Add Vendor to List
              </Text>
            </TouchableOpacity>

            {vendorsList.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: 13, marginBottom: 8, color: theme.colors.text },
                  ]}
                >
                  Added Vendors ({vendorsList.length})
                </Text>
                {vendorsList.map((vendor, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "#F8FAFC",
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_600SemiBold",
                          fontSize: 13,
                          color: theme.colors.text,
                        }}
                      >
                        {vendor.vendorName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 11,
                          color: theme.colors.muted,
                        }}
                      >
                        {vendor.bankName} - {vendor.accountNumber}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: 11,
                          color: theme.colors.success,
                        }}
                      >
                        {vendor.accountName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const newList = [...vendorsList];
                        newList.splice(index, 1);
                        setVendorsList(newList);
                      }}
                      style={{ padding: 4 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <BankPicker
              visible={showBankPicker}
              banks={banks}
              isLoading={banksLoading}
              onSelect={(b) => {
                setSelectedBank(b);
                setShowBankPicker(false);
              }}
              onClose={() => setShowBankPicker(false)}
            />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  toggleRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  vendorContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(56, 178, 172, 0.3)",
    marginBottom: 16,
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
  hint: {
    marginTop: 8,
    color: "#778DA9",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  inputError: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_500Medium",
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
});
