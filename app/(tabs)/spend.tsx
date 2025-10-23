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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import spendStyles from "../../styles/spend.styles";

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
  const [allowDirectOutlet, setAllowDirectOutlet] = useState(false);
  const scrollRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { isCategoryLoading, categories } = useCategory();
  const { isCompanyLoading, companies, fetchCompanies } = useCompany();
  const {
    isOutletLoading,
    outlets,
    fetchOutlets,
    fetchAllOutlets,
    clearOutlets,
  } = useOutlet();
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
    if (allowDirectOutlet) {
      setSelectedCompany(null);
      setSelectedOutlet(null);
      fetchAllOutlets(selectedCategory ?? "");
    }
  }, [allowDirectOutlet, fetchAllOutlets, selectedCategory]);

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
    if (!selectedOutlet) {
      setBanner({ message: "Select an outlet", type: "error" });
      return;
    }
    spendLockedFunds({
      amount: String(data.amount),
      outletId: selectedOutlet,
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
    <LinearGradient
      colors={["#F8F9FA", "#E9ECEF"]}
      style={spendStyles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[spendStyles.content, { paddingBottom: 160 }]}
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

          <View style={spendStyles.header}>
            <View>
              <Text style={spendStyles.title}>Spend Locked Funds</Text>
              <Text style={spendStyles.subtitle}>
                Pay vendors using locked category funds
              </Text>
            </View>
            <View style={spendStyles.iconBox}>
              <Ionicons name="card" size={26} color="#38B2AC" />
            </View>
          </View>

          {/* Categories: show spinner while loading */}
          {isCategoryLoading ? (
            <View style={spendStyles.loadingRow}>
              <ActivityIndicator size="small" color="#38B2AC" />
              <Text style={spendStyles.loadingText}>Loading categories...</Text>
            </View>
          ) : (
            <CategoryPicker
              categories={categories ?? []}
              selected={selectedCategory}
              onSelect={(id) => {
                setSelectedCategory(id);
                setSelectedCompany(null);
              }}
              styles={spendStyles}
            />
          )}

          {/* Mode selector: segmented pill */}
          {selectedCategory && (
            <View style={spendStyles.modeSwitch} accessibilityRole="tablist">
              <Pressable
                onPress={() => setAllowDirectOutlet(false)}
                accessibilityRole="button"
                accessibilityState={{ selected: !allowDirectOutlet }}
                style={({ pressed }) => [
                  spendStyles.modeOption,
                  !allowDirectOutlet && spendStyles.modeOptionActive,
                  pressed && spendStyles.modeOptionPressed,
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="business"
                    size={14}
                    color={!allowDirectOutlet ? "#fff" : "#256A5A"}
                  />
                  <Text
                    style={[
                      spendStyles.modeOptionText,
                      !allowDirectOutlet && spendStyles.modeOptionTextActive,
                    ]}
                  >
                    By company
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setAllowDirectOutlet(true)}
                accessibilityRole="button"
                accessibilityState={{ selected: allowDirectOutlet }}
                style={({ pressed }) => [
                  spendStyles.modeOption,
                  allowDirectOutlet && spendStyles.modeOptionActive,
                  pressed && spendStyles.modeOptionPressed,
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="storefront"
                    size={14}
                    color={allowDirectOutlet ? "#fff" : "#256A5A"}
                  />
                  <Text
                    style={[
                      spendStyles.modeOptionText,
                      allowDirectOutlet && spendStyles.modeOptionTextActive,
                    ]}
                  >
                    Select outlet directly
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          {/* contextual helper text */}
          {selectedCategory && (
            <Text style={spendStyles.helperText}>
              {allowDirectOutlet
                ? "Showing all outlets."
                : selectedCompany
                ? "Showing outlets for the selected company."
                : "Pick a company to see its outlets."}
            </Text>
          )}

          {/* CompanyPicker: hide in direct mode; show spinner while loading */}
          {selectedCategory && !allowDirectOutlet && (
            <>
              {isCompanyLoading ? (
                <View style={spendStyles.loadingRow}>
                  <ActivityIndicator size="small" color="#38B2AC" />
                  <Text style={spendStyles.loadingText}>
                    Loading companies...
                  </Text>
                </View>
              ) : (
                <CompanyPicker
                  companies={companies}
                  selected={selectedCompany}
                  onSelect={(id) => {
                    setSelectedCompany(id);
                    setSelectedOutlet(null);
                  }}
                  styles={spendStyles}
                />
              )}
            </>
          )}

          {/* OutletPicker: show spinner while outlets load */}
          {(selectedCompany || allowDirectOutlet) && (
            <>
              {isOutletLoading ? (
                <View style={spendStyles.loadingRow}>
                  <ActivityIndicator size="small" color="#38B2AC" />
                  <Text style={spendStyles.loadingText}>
                    Loading outlets...
                  </Text>
                </View>
              ) : (
                <OutletPicker
                  outlets={outlets}
                  selected={selectedOutlet}
                  onSelect={(id) => {
                    setSelectedOutlet(id);
                  }}
                  styles={spendStyles}
                />
              )}
            </>
          )}

          {/* show outlet + company preview when an outlet is selected */}
          {selectedOutlet && (
            <View style={{ marginTop: 8, marginBottom: 6 }}>
              {(() => {
                const picked = outlets?.find(
                  (o: any) =>
                    String(o.id) === String(selectedOutlet) ||
                    o.id === selectedOutlet
                );
                return (
                  <Text style={spendStyles.helperText}>
                    Selected outlet:{" "}
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        color: "#1B263B",
                      }}
                    >
                      {picked?.name ?? selectedOutlet}
                    </Text>
                    {picked?.name ? (
                      <Text style={{ color: "#718096" }}> — {picked.name}</Text>
                    ) : null}
                  </Text>
                );
              })()}
            </View>
          )}

          {selectedOutlet && (
            <>
              <AmountSection
                control={control}
                availableLocked={availableLocked}
                styles={spendStyles}
              />
              <PinSection control={control} styles={spendStyles} />
            </>
          )}

          <TouchableOpacity
            style={[
              spendStyles.actionButton,
              (isSpending || !formState.isValid) && spendStyles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSpending || !formState.isValid}
          >
            <LinearGradient
              colors={["#38B2AC", "#2C9A92"]}
              style={spendStyles.actionGradient}
            >
              {isSpending ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[spendStyles.actionText, { marginLeft: 8 }]}>
                    Processing...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={spendStyles.actionText}>Complete Payment</Text>
                  <Ionicons name="card" size={18} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
