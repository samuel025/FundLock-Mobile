import { PinGuard } from "@/components/PinGuard";
import AmountSection from "@/components/spendComponents/AmountSection";
import CategoryPicker from "@/components/spendComponents/CategoryPicker";
import CompanyPicker from "@/components/spendComponents/CompanyPicker";
import LoadingRow from "@/components/spendComponents/LoadingRow";
import ModeSwitch from "@/components/spendComponents/ModeSwitch";
import OutletPicker from "@/components/spendComponents/OutletPicker";
import PinSection from "@/components/spendComponents/PinSection";
import SpendHeader from "@/components/spendComponents/SpendHeader";
import VendorIdShortcut from "@/components/spendComponents/VendorIdShortcut";
import { useToastConfig } from "@/config/toastConfig";
import { useCategory } from "@/hooks/useCategory";
import { useCompany } from "@/hooks/useCompany";
import { useGetLocks } from "@/hooks/useGetLocks";
import { useOutlet } from "@/hooks/useOutlet";
import { useSpend } from "@/hooks/useSpend";
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
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import spendStyles from "../../styles/spend.styles";

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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [allowDirectOutlet, setAllowDirectOutlet] = useState(false);
  const scrollRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const toastConfig = useToastConfig();

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
  const { locksList, fetchLocks } = useGetLocks();

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

  useFocusEffect(
    useCallback(() => {
      fetchLocks();
    }, [fetchLocks])
  );

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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: spendError,
        position: "top",
        topOffset: 60,
      });
    }
    if (spendMessage) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: spendMessage,
        position: "top",
        topOffset: 60,
      });
      reset();
      fetchLocks();
    }
  }, [spendError, spendMessage]);

  const selectedCategoryName = selectedCategory
    ? categories?.find((c) => String(c.id) === String(selectedCategory))
        ?.name ?? null
    : null;

  const availableLocked = selectedCategoryName
    ? Number(
        locksList.find(
          (l: any) =>
            String(l.categoryName).toLowerCase() ===
            String(selectedCategoryName).toLowerCase()
        )?.amount ?? 0
      )
    : 0;

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
    if (!selectedOutlet) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select an Outlet",
        position: "top",
        topOffset: 60,
      });
      return;
    }
    spendLockedFunds({
      amount: String(data.amount),
      outletId: selectedOutlet,
      pin: data.pin,
    });
  };

  if (!fontsLoaded) return null;

  return (
    <PinGuard>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={spendStyles.container}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? 0 : StatusBar.currentHeight ?? 0
          }
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              spendStyles.content,
              { paddingBottom: 160 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <SpendHeader theme={theme} isDark={isDark} styles={spendStyles} />
            <VendorIdShortcut theme={theme} styles={spendStyles} />

            {/* Category Picker */}
            {isCategoryLoading ? (
              <LoadingRow
                theme={theme}
                isDark={isDark}
                styles={spendStyles}
                message="Loading categories..."
              />
            ) : (
              <CategoryPicker
                categories={categories ?? []}
                selected={selectedCategory}
                onSelect={(id) => {
                  setSelectedCategory(id);
                  setSelectedCompany(null);
                }}
                styles={{
                  ...spendStyles,
                  pickerButton: [
                    spendStyles.pickerButton,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : theme.colors.card,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : theme.colors.border,
                    },
                  ],
                  pickerText: [
                    spendStyles.pickerText,
                    { color: theme.colors.text },
                  ],
                  catIcon: [
                    spendStyles.catIcon,
                    { backgroundColor: theme.colors.actionIconLockBg },
                  ],
                }}
              />
            )}

            {/* Mode Switch */}
            {selectedCategory && (
              <ModeSwitch
                theme={theme}
                isDark={isDark}
                styles={spendStyles}
                allowDirectOutlet={allowDirectOutlet}
                onModeChange={setAllowDirectOutlet}
              />
            )}

            {selectedCategory && (
              <Text
                style={[spendStyles.helperText, { color: theme.colors.muted }]}
              >
                {allowDirectOutlet
                  ? "Showing all outlets."
                  : selectedCompany
                  ? "Showing outlets for the selected company."
                  : "Pick a company to see its outlets."}
              </Text>
            )}

            {/* Company Picker */}
            {selectedCategory && !allowDirectOutlet && (
              <>
                {isCompanyLoading ? (
                  <LoadingRow
                    theme={theme}
                    isDark={isDark}
                    styles={spendStyles}
                    message="Loading companies..."
                  />
                ) : (
                  <CompanyPicker
                    companies={companies}
                    selected={selectedCompany}
                    onSelect={(id) => {
                      setSelectedCompany(id);
                      setSelectedOutlet(null);
                    }}
                    styles={{
                      ...spendStyles,
                      pickerButton: [
                        spendStyles.pickerButton,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : theme.colors.card,
                          borderColor: isDark
                            ? "rgba(255,255,255,0.15)"
                            : theme.colors.border,
                        },
                      ],
                      pickerText: [
                        spendStyles.pickerText,
                        { color: theme.colors.text },
                      ],
                      catIcon: [
                        spendStyles.catIcon,
                        { backgroundColor: theme.colors.actionIconLockBg },
                      ],
                    }}
                  />
                )}
              </>
            )}

            {/* Outlet Picker */}
            {(selectedCompany || allowDirectOutlet) && (
              <>
                {isOutletLoading ? (
                  <LoadingRow
                    theme={theme}
                    isDark={isDark}
                    styles={spendStyles}
                    message="Loading outlets..."
                  />
                ) : (
                  <OutletPicker
                    outlets={outlets}
                    selected={selectedOutlet}
                    onSelect={(id) => setSelectedOutlet(id)}
                    styles={{
                      ...spendStyles,
                      pickerButton: [
                        spendStyles.pickerButton,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : theme.colors.card,
                          borderColor: isDark
                            ? "rgba(255,255,255,0.15)"
                            : theme.colors.border,
                        },
                      ],
                      pickerText: [
                        spendStyles.pickerText,
                        { color: theme.colors.text },
                      ],
                      catIcon: [
                        spendStyles.catIcon,
                        { backgroundColor: theme.colors.actionIconLockBg },
                      ],
                    }}
                  />
                )}
              </>
            )}

            {/* Selected outlet summary */}
            {selectedOutlet && (
              <View style={{ marginTop: 8, marginBottom: 6 }}>
                {(() => {
                  const picked = outlets?.find(
                    (o: any) =>
                      String(o.id) === String(selectedOutlet) ||
                      o.id === selectedOutlet
                  );
                  return (
                    <Text
                      style={[
                        spendStyles.helperText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Selected outlet:{" "}
                      <Text
                        style={{
                          fontFamily: "Poppins_600SemiBold",
                          color: theme.colors.text,
                        }}
                      >
                        {picked?.name ?? selectedOutlet}
                      </Text>
                      {picked?.name ? (
                        <Text style={{ color: theme.colors.muted }}>
                          {" "}
                          — {picked.name}
                        </Text>
                      ) : null}
                    </Text>
                  );
                })()}
              </View>
            )}

            {/* Amount & PIN sections */}
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

            {/* Action button */}
            <TouchableOpacity
              style={[
                spendStyles.actionButton,
                (isSpending || !formState.isValid) &&
                  spendStyles.disabledButton,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSpending || !formState.isValid}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary]}
                style={spendStyles.actionGradient}
              >
                {isSpending ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.balanceText}
                    />
                    <Text
                      style={[
                        spendStyles.actionText,
                        { marginLeft: 8, color: theme.colors.balanceText },
                      ]}
                    >
                      Processing...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        spendStyles.actionText,
                        { color: theme.colors.balanceText },
                      ]}
                    >
                      Complete Payment
                    </Text>
                    <Ionicons
                      name="card"
                      size={18}
                      color={theme.colors.balanceText}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <Toast config={toastConfig} />
      </LinearGradient>
    </PinGuard>
  );
}

const glassBase = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
});
