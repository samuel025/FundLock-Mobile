import { MessageBanner } from "@/components/MessageBanner";
import AmountSection from "@/components/spendComponents/AmountSection";
import CategoryPicker from "@/components/spendComponents/CategoryPicker";
import CompanyPicker from "@/components/spendComponents/CompanyPicker";
import OutletPicker from "@/components/spendComponents/OutletPicker";
import PinSection from "@/components/spendComponents/PinSection";
import { useCategory } from "@/hooks/useCategory";
import { useCompany } from "@/hooks/useCompany";
import { useOutlet } from "@/hooks/useOutlet";
import { useSpend } from "@/hooks/useSpend";
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
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

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
  const scrollRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { isCategoryLoading, categories } = useCategory();
  const { isCompanyLoading, companies, fetchCompanies } = useCompany();
  const { isOutletLoading, outlets, fetchOutlets, clearOutlets } = useOutlet();
  const { spendLockedFunds, spendError, spendMessage, isSpending } = useSpend();

  useEffect(() => {
    if (selectedCategory) {
      setSelectedCompany(null);
      setSelectedOutlet(null);
      fetchCompanies(selectedCategory);
      clearOutlets();
    }
  }, [selectedCategory, fetchCompanies, clearOutlets]);

  useEffect(() => {
    if (selectedCompany) {
      setSelectedOutlet(null);
      fetchOutlets(selectedCompany);
    }
  }, [selectedCompany, fetchOutlets]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { control, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { amount: undefined as any, pin: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (spendError) {
      setBanner({ message: spendError, type: "error" });
    }
    if (spendMessage) {
      setBanner({ message: spendMessage, type: "success" });
      reset();
    }
  }, [spendError, spendMessage]);

  const availableLocked = selectedCategory
    ? lockedAmounts[selectedCategory] || 0
    : 0;

  const onSubmit = (data: FormData) => {
    if (!selectedCategory) {
      setBanner({ message: "Select a category", type: "error" });
      return;
    }
    if (!selectedCompany) {
      setBanner({ message: "Select a company", type: "error" });
      return;
    }
    if (!selectedOutlet) {
      setBanner({ message: "Select an outlet", type: "error" });
      return;
    }
    spendLockedFunds({
      amount: String(data.amount),
      outletId: selectedOutlet, // use outlet selected
      pin: data.pin,
    });
  };

  useEffect(() => {
    if (banner) {
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }
  }, [banner]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
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

          <CategoryPicker
            categories={categories ?? []}
            selected={selectedCategory}
            onSelect={(id) => {
              setSelectedCategory(id);
              setSelectedCompany(null);
            }}
            styles={styles}
          />

          {selectedCategory && (
            <CompanyPicker
              companies={companies}
              selected={selectedCompany}
              onSelect={(id) => {
                setSelectedCompany(id);
                setSelectedOutlet(null);
              }}
              styles={styles}
            />
          )}

          {selectedCompany && (
            <OutletPicker
              outlets={outlets}
              selected={selectedOutlet}
              onSelect={(id) => setSelectedOutlet(id)}
              styles={styles}
            />
          )}

          {selectedOutlet && (
            <>
              <AmountSection
                control={control}
                availableLocked={availableLocked}
                styles={styles}
              />
              <PinSection control={control} styles={styles} />
            </>
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
