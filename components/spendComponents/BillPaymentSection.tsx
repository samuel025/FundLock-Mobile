import { useDataBundle } from "@/hooks/useDataBundle";
import { useNetworkProvider } from "@/hooks/useNetworkProvider";
import { usePurchaseAirtime } from "@/hooks/usePurchaseAirtime";
import { usePurchaseData } from "@/hooks/usePurchaseData";
import { DataBundle, NetworkProvider } from "@/services/billPayment";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

interface BillPaymentSectionProps {
  control: any;
  categoryId: string;
  availableLocked: number;
  onPurchaseComplete: () => void;
  styles: any;
}

type PurchaseType = "airtime" | "data" | null;

export default function BillPaymentSection({
  control,
  categoryId,
  availableLocked,
  onPurchaseComplete,
  styles,
}: BillPaymentSectionProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [purchaseType, setPurchaseType] = useState<PurchaseType>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<NetworkProvider | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<DataBundle | null>(null);

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

  // Watch form values
  const phoneNumber = useWatch({ control, name: "phoneNumber" });
  const pin = useWatch({ control, name: "pin" });
  const amount = useWatch({ control, name: "amount" });

  const {
    providers,
    isLoading: isLoadingProviders,
    fetchProviders,
  } = useNetworkProvider();
  const {
    bundles,
    isLoading: isLoadingBundles,
    fetchBundles,
  } = useDataBundle();
  const {
    isPurchasing: isPurchasingAirtime,
    error: airtimeError,
    message: airtimeMessage,
    purchaseAirtimeRequest,
  } = usePurchaseAirtime();
  const {
    isPurchasing: isPurchasingData,
    error: dataError,
    message: dataMessage,
    purchaseDataRequest,
  } = usePurchaseData();

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (purchaseType === "data" && selectedProvider) {
      fetchBundles(selectedProvider.code);
      setSelectedBundle(null);
    }
  }, [selectedProvider, purchaseType]);

  useEffect(() => {
    if (airtimeMessage || dataMessage) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: airtimeMessage || dataMessage || "",
        position: "top",
        topOffset: 60,
      });
      onPurchaseComplete();
    }
  }, [airtimeMessage, dataMessage]);

  useEffect(() => {
    if (airtimeError || dataError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: airtimeError || dataError || "",
        position: "top",
        topOffset: 60,
      });
    }
  }, [airtimeError, dataError]);

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("234")) {
      return cleaned.slice(0, 13);
    }
    if (cleaned.startsWith("0")) {
      cleaned = "234" + cleaned.slice(1);
    }
    if (!cleaned.startsWith("234")) {
      cleaned = "234" + cleaned;
    }
    return cleaned.slice(0, 13);
  };

  const validateNigerianPhone = (value: string) => {
    if (!value) return false;
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("234")) {
      return cleaned.length === 13;
    }
    if (cleaned.startsWith("0")) {
      return cleaned.length === 11;
    }
    return false;
  };

  const displayPhoneNumber = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/[^0-9]/g, "");

    if (cleaned.startsWith("234")) {
      return `+234 ${cleaned.slice(3)}`;
    }
    if (cleaned.startsWith("0")) {
      return cleaned;
    }
    return `+234 ${cleaned}`;
  };

  const handlePurchase = () => {
    // Validation
    if (!selectedProvider) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a network provider",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    if (!phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter phone number",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    if (!validateNigerianPhone(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid Nigerian phone number",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    if (!pin) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your PIN",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    if (purchaseType === "airtime") {
      if (!amount) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter amount",
          position: "top",
          topOffset: 60,
        });
        return;
      }

      const amountNum = Number(amount);
      if (amountNum > availableLocked) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Amount exceeds available balance",
          position: "top",
          topOffset: 60,
        });
        return;
      }

      purchaseAirtimeRequest({
        amount: String(amountNum),
        phoneNumber: phoneNumber,
        networkCode: selectedProvider.code,
        pin: pin,
        categoryId: categoryId,
      });
    } else if (purchaseType === "data") {
      if (!selectedBundle) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please select a data bundle",
          position: "top",
          topOffset: 60,
        });
        return;
      }

      const bundleAmount = Number(selectedBundle.amount);
      if (bundleAmount > availableLocked) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Insufficient balance for this bundle",
          position: "top",
          topOffset: 60,
        });
        return;
      }

      purchaseDataRequest({
        bundleId: selectedBundle.id,
        phoneNumber: phoneNumber,
        networkCode: selectedProvider.code,
        pin: pin,
        categoryId: categoryId,
      });
    }
  };

  const renderProviderItem = ({ item }: { item: NetworkProvider }) => (
    <TouchableOpacity
      style={[
        localStyles.modalItem,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : theme.colors.card,
          borderColor:
            selectedProvider?.id === item.id
              ? theme.colors.primary
              : theme.colors.border,
          borderWidth: selectedProvider?.id === item.id ? 2 : 1,
        },
      ]}
      onPress={() => {
        setSelectedProvider(item);
        setShowProviderModal(false);
      }}
    >
      <Text style={[localStyles.modalItemText, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      {selectedProvider?.id === item.id && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.colors.primary}
        />
      )}
    </TouchableOpacity>
  );

  const renderBundleItem = ({ item }: { item: DataBundle }) => (
    <TouchableOpacity
      style={[
        localStyles.modalItem,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : theme.colors.card,
          borderColor:
            selectedBundle?.id === item.id
              ? theme.colors.primary
              : theme.colors.border,
          borderWidth: selectedBundle?.id === item.id ? 2 : 1,
        },
      ]}
      onPress={() => {
        setSelectedBundle(item);
        setShowBundleModal(false);
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[localStyles.modalItemText, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[localStyles.bundleDetails, { color: theme.colors.muted }]}
        >
          ₦{Number(item.amount).toLocaleString()} • {item.validity}
        </Text>
      </View>
      {selectedBundle?.id === item.id && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.colors.primary}
        />
      )}
    </TouchableOpacity>
  );

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!selectedProvider || !purchaseType) return false;

    if (!phoneNumber || !validateNigerianPhone(phoneNumber)) return false;
    if (!pin || pin.length !== 4) return false;

    if (purchaseType === "airtime") {
      return amount && Number(amount) > 0 && Number(amount) <= availableLocked;
    }

    if (purchaseType === "data") {
      if (!selectedBundle) return false;
      const bundleAmount = Number(selectedBundle.amount);
      return bundleAmount <= availableLocked;
    }

    return false;
  };

  const isPurchasing = isPurchasingAirtime || isPurchasingData;

  return (
    <>
      {/* Purchase Type Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
          What would you like to purchase?
        </Text>
        <View style={localStyles.typeContainer}>
          <TouchableOpacity
            style={[
              localStyles.typeButton,
              {
                backgroundColor:
                  purchaseType === "airtime"
                    ? theme.colors.primary
                    : isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                borderColor:
                  purchaseType === "airtime"
                    ? theme.colors.primary
                    : theme.colors.border,
              },
            ]}
            onPress={() => {
              setPurchaseType("airtime");
              setSelectedBundle(null);
            }}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color={purchaseType === "airtime" ? "#fff" : theme.colors.primary}
            />
            <Text
              style={[
                localStyles.typeText,
                {
                  color:
                    purchaseType === "airtime" ? "#fff" : theme.colors.text,
                },
              ]}
            >
              Airtime
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              localStyles.typeButton,
              {
                backgroundColor:
                  purchaseType === "data"
                    ? theme.colors.primary
                    : isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                borderColor:
                  purchaseType === "data"
                    ? theme.colors.primary
                    : theme.colors.border,
              },
            ]}
            onPress={() => setPurchaseType("data")}
          >
            <Ionicons
              name="wifi-outline"
              size={24}
              color={purchaseType === "data" ? "#fff" : theme.colors.primary}
            />
            <Text
              style={[
                localStyles.typeText,
                {
                  color: purchaseType === "data" ? "#fff" : theme.colors.text,
                },
              ]}
            >
              Data
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {purchaseType && (
        <>
          {/* Network Provider */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
              Network Provider
            </Text>
            <TouchableOpacity
              style={[
                localStyles.pickerButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setShowProviderModal(true)}
              disabled={isLoadingProviders}
            >
              <Text
                style={[
                  localStyles.pickerText,
                  {
                    color: selectedProvider
                      ? theme.colors.text
                      : theme.colors.muted,
                  },
                ]}
              >
                {isLoadingProviders
                  ? "Loading providers..."
                  : selectedProvider
                  ? selectedProvider.name
                  : "Select network provider"}
              </Text>
              {isLoadingProviders ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.muted}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
              Phone Number
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                validate: (value) =>
                  validateNigerianPhone(value) ||
                  "Enter a valid Nigerian phone number",
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Phone number"
                    placeholder="08012345678"
                    value={displayPhoneNumber(value || "")}
                    onChangeText={(text) => {
                      const formatted = formatPhoneNumber(text);
                      onChange(formatted);
                    }}
                    keyboardType="phone-pad"
                    maxLength={18}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Ionicons
                            name="call-outline"
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
                      fonts: { regular: { fontFamily: "Poppins_500Medium" } },
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

          {/* Data Bundle (only for Data) */}
          {purchaseType === "data" && selectedProvider && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.muted }]}
              >
                Data Bundle
              </Text>
              <TouchableOpacity
                style={[
                  localStyles.pickerButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setShowBundleModal(true)}
                disabled={isLoadingBundles}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      localStyles.pickerText,
                      {
                        color: selectedBundle
                          ? theme.colors.text
                          : theme.colors.muted,
                      },
                    ]}
                  >
                    {isLoadingBundles
                      ? "Loading bundles..."
                      : selectedBundle
                      ? selectedBundle.name
                      : "Select data bundle"}
                  </Text>
                  {selectedBundle && (
                    <Text
                      style={[
                        localStyles.bundleSubtext,
                        { color: theme.colors.muted },
                      ]}
                    >
                      ₦{Number(selectedBundle.amount).toLocaleString()} •{" "}
                      {selectedBundle.validity}
                    </Text>
                  )}
                </View>
                {isLoadingBundles ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.colors.muted}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Amount Display for Data OR Amount Input for Airtime */}
          {purchaseType === "data" && selectedBundle && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.muted }]}
              >
                Amount
              </Text>
              <View
                style={[
                  localStyles.amountDisplay,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    localStyles.amountDisplayText,
                    { color: theme.colors.text },
                  ]}
                >
                  ₦{Number(selectedBundle.amount).toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.hint, { color: theme.colors.muted }]}>
                Available: ₦{availableLocked.toLocaleString()}
              </Text>
            </View>
          )}

          {purchaseType === "airtime" && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.muted }]}
              >
                Amount
              </Text>
              <Controller
                control={control}
                name="amount"
                rules={{
                  required: "Amount is required",
                  validate: (value) => {
                    const num = Number(value);
                    if (num <= 0) return "Amount must be greater than 0";
                    if (num > availableLocked)
                      return "Amount exceeds available balance";
                    return true;
                  },
                }}
                render={({ field: { onChange, value }, fieldState }) => {
                  const formatWithCommas = (val: string) => {
                    if (!val || val === "" || val === ".") return val;
                    const parts = val.split(".");
                    const integerPart = parts[0].replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    );
                    return parts.length > 1
                      ? `${integerPart}.${parts[1]}`
                      : integerPart;
                  };

                  return (
                    <>
                      <TextInput
                        mode="outlined"
                        label="Amount"
                        value={formatWithCommas(
                          value !== undefined ? String(value) : ""
                        )}
                        onChangeText={(t) => {
                          const cleaned = t
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*)\./g, "$1");
                          const numeric = parseFloat(cleaned);

                          if (!isNaN(numeric)) {
                            if (numeric > availableLocked) {
                              onChange(String(availableLocked));
                            } else {
                              onChange(cleaned);
                            }
                          } else if (cleaned === "" || cleaned === ".") {
                            onChange(cleaned);
                          }
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
                      <Text
                        style={[styles.hint, { color: theme.colors.muted }]}
                      >
                        Available: ₦{availableLocked.toLocaleString()}
                      </Text>
                    </>
                  );
                }}
              />
            </View>
          )}

          {/* PIN */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
              PIN
            </Text>
            <Controller
              control={control}
              name="pin"
              rules={{
                required: "PIN is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "PIN must be 4 digits",
                },
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="4-digit PIN"
                    value={value || ""}
                    onChangeText={(t) =>
                      onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                    }
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
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
                      fonts: { regular: { fontFamily: "Poppins_500Medium" } },
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

          {/* Purchase Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              (isPurchasing || !isFormValid()) && styles.disabledButton,
            ]}
            onPress={handlePurchase}
            disabled={isPurchasing || !isFormValid()}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary]}
              style={styles.actionGradient}
            >
              {isPurchasing ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.balanceText}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      {
                        marginLeft: 8,
                        color: theme.colors.balanceText,
                      },
                    ]}
                  >
                    Processing...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.actionText,
                      { color: theme.colors.balanceText },
                    ]}
                  >
                    {purchaseType === "airtime"
                      ? "Buy Airtime"
                      : "Buy Data Bundle"}
                  </Text>
                  <Ionicons
                    name={
                      purchaseType === "airtime" ? "phone-portrait" : "wifi"
                    }
                    size={18}
                    color={theme.colors.balanceText}
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {/* Provider Modal */}
      <Modal
        visible={showProviderModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProviderModal(false)}
      >
        <Pressable
          style={localStyles.modalOverlay}
          onPress={() => setShowProviderModal(false)}
        >
          <View
            style={[
              localStyles.modalContent,
              {
                backgroundColor: isDark
                  ? theme.colors.card
                  : theme.colors.background,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={localStyles.modalHeader}>
              <Text
                style={[localStyles.modalTitle, { color: theme.colors.text }]}
              >
                Select Network Provider
              </Text>
              <TouchableOpacity onPress={() => setShowProviderModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={providers}
              renderItem={renderProviderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={localStyles.modalList}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Bundle Modal */}
      <Modal
        visible={showBundleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBundleModal(false)}
      >
        <Pressable
          style={localStyles.modalOverlay}
          onPress={() => setShowBundleModal(false)}
        >
          <View
            style={[
              localStyles.modalContent,
              {
                backgroundColor: isDark
                  ? theme.colors.card
                  : theme.colors.background,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={localStyles.modalHeader}>
              <Text
                style={[localStyles.modalTitle, { color: theme.colors.text }]}
              >
                Select Data Bundle
              </Text>
              <TouchableOpacity onPress={() => setShowBundleModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bundles}
              renderItem={renderBundleItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={localStyles.modalList}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  bundleSubtext: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
  amountDisplay: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  amountDisplayText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  bundleDetails: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
});
