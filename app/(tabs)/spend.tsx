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
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as yup from "yup";

const categories = [
  { id: "food", label: "Food & Dining", icon: "restaurant", color: "#F59E0B" },
  { id: "fuel", label: "Fuel", icon: "car", color: "#3B82F6" },
  { id: "shopping", label: "Shopping", icon: "cart", color: "#EC4899" },
];

const vendorsByCategory: Record<string, { id: string; label: string }[]> = {
  food: [
    { id: "kfc", label: "KFC" },
    { id: "dominos", label: "Dominos" },
    { id: "localb", label: "Local Eatery" },
  ],
  fuel: [
    { id: "mtn", label: "Total" },
    { id: "oando", label: "Oando" },
    { id: "np", label: "NP Station" },
  ],
  shopping: [
    { id: "shoprite", label: "Shoprite" },
    { id: "jumia", label: "Jumia" },
  ],
};

const lockedAmounts: Record<string, number> = {
  food: 5000,
  fuel: 8000,
  shopping: 2000,
};

const schema = yup.object({
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

export default function Spend() {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { control, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { amount: undefined as any, pin: "" },
    mode: "onChange",
  });

  const categoryData = useMemo(
    () => categories.find((c) => c.id === selectedCategory) || null,
    [selectedCategory]
  );
  const vendors = useMemo(
    () => (selectedCategory ? vendorsByCategory[selectedCategory] || [] : []),
    [selectedCategory]
  );
  const availableLocked = selectedCategory
    ? lockedAmounts[selectedCategory] || 0
    : 0;

  const onSubmit = (data: FormData) => {
    if (!selectedCategory) return Alert.alert("Select category");
    if (!selectedVendor) return Alert.alert("Select vendor");
    if (data.amount > availableLocked)
      return Alert.alert("Amount exceeds locked funds");

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Success",
        `₦${data.amount.toLocaleString()} spent at ${
          vendors.find((v) => v.id === selectedVendor)?.label
        }`
      );
      setSelectedCategory(null);
      setSelectedVendor(null);
    }, 900);
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Spend Locked Funds</Text>
              <Text style={styles.subtitle}>
                Pay vendors using locked category funds
              </Text>
            </View>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={26} color="#38B2AC" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={styles.pickerText}>
                {categoryData ? categoryData.label : "Select category"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#778DA9" />
            </TouchableOpacity>

            <Modal
              visible={categoryModalVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  keyboardVerticalOffset={100}
                >
                  <View style={styles.modalLarge}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Select Category</Text>
                    <FlatList
                      data={categories}
                      keyExtractor={(i) => i.id}
                      ItemSeparatorComponent={() => (
                        <View style={styles.itemSeparator} />
                      )}
                      contentContainerStyle={{ paddingBottom: 24 }}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => {
                            setSelectedCategory(item.id);
                            setCategoryModalVisible(false);
                            setSelectedVendor(null);
                          }}
                          style={({ pressed }) => [
                            styles.modalItem,
                            pressed && { backgroundColor: "rgba(0,0,0,0.03)" },
                          ]}
                        >
                          <View
                            style={[
                              styles.catIcon,
                              { backgroundColor: item.color + "20" },
                            ]}
                          >
                            <Ionicons
                              name={item.icon as any}
                              size={18}
                              color={item.color}
                            />
                          </View>
                          <Text style={styles.modalItemText}>{item.label}</Text>
                        </Pressable>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => setCategoryModalVisible(false)}
                      style={styles.modalClose}
                    >
                      <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </Modal>
          </View>

          {selectedCategory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vendor</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setVendorModalVisible(true)}
              >
                <Text style={styles.pickerText}>
                  {selectedVendor
                    ? vendors.find((v) => v.id === selectedVendor)?.label
                    : "Select vendor"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#778DA9" />
              </TouchableOpacity>

              <Modal
                visible={vendorModalVisible}
                transparent
                animationType="slide"
              >
                <View style={styles.modalOverlay}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={100}
                  >
                    <View style={styles.modalLarge}>
                      <Text style={styles.modalTitle}>Select Vendor</Text>
                      <FlatList
                        data={vendors}
                        keyExtractor={(i) => i.id}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        renderItem={({ item }) => (
                          <Pressable
                            onPress={() => {
                              setSelectedVendor(item.id);
                              setVendorModalVisible(false);
                            }}
                            style={({ pressed }) => [
                              styles.modalItem,
                              pressed && { opacity: 0.6 },
                            ]}
                          >
                            <Text style={styles.modalItemText}>
                              {item.label}
                            </Text>
                          </Pressable>
                        )}
                      />
                      <TouchableOpacity
                        onPress={() => setVendorModalVisible(false)}
                        style={styles.modalClose}
                      >
                        <Text style={styles.modalCloseText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                </View>
              </Modal>
            </View>
          )}

          {selectedVendor && (
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
                            icon={() => <Text style={styles.currency}>₦</Text>}
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
                        Available locked: ₦{availableLocked.toLocaleString()}
                      </Text>
                    </>
                  )}
                />
              </View>
            </View>
          )}

          {selectedVendor && (
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
                        secureTextEntry={!showPin}
                        right={
                          <TextInput.Icon
                            icon={showPin ? "eye-off" : "eye"}
                            onPress={() => setShowPin((s) => !s)}
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
                    </>
                  )}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton,
              (isProcessing || !formState.isValid) && styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isProcessing || !formState.isValid}
          >
            <LinearGradient
              colors={["#38B2AC", "#2C9A92"]}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Text>
              <Ionicons name="card" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  pickerText: { fontFamily: "Poppins_500Medium", color: "#1B263B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  modalLarge: {
    backgroundColor: "#fff",
    maxHeight: "85%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
    marginVertical: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    textAlign: "left",
    paddingLeft: 4,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
    marginLeft: 12,
  },
  itemSeparator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 56 },
  modalClose: { marginTop: 12, alignItems: "center" },
  modalCloseText: { color: "#38B2AC", fontFamily: "Poppins_600SemiBold" },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    color: "#E53E3E",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
});
