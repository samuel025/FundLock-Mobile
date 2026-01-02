import { PinGuard } from "@/components/PinGuard";
import BillPaymentSection from "@/components/spendComponents/BillPaymentSection";
import CategoryPicker from "@/components/spendComponents/CategoryPicker";
import LoadingRow from "@/components/spendComponents/LoadingRow";
import SpendHeader from "@/components/spendComponents/SpendHeader";
import SpendOutletFlow from "@/components/spendComponents/SpendOutletFlow";
import VendorIdShortcut from "@/components/spendComponents/VendorIdShortcut";
import { useSpendTabController } from "@/hooks/useSpendTabController";
import { useTheme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import spendStyles from "../../styles/spend.styles";

export default function Spend() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const {
    isCategoryLoading,
    categories,
    isCompanyLoading,
    companies,
    isOutletLoading,
    outlets,
    isSpending,

    allowDirectOutlet,
    setAllowDirectOutlet,
    selectedCategoryId,
    selectedCompany,
    selectedOutlet,
    selectCategory,
    selectCompany,
    setSelectedOutlet,

    selectedCategory,
    isBillPaymentCategory,
    availableLocked,

    control,
    formState,

    submit,
    handleBillPaymentComplete,
  } = useSpendTabController();

  const pickerStyles = useMemo(
    () => ({
      ...spendStyles,
      pickerButton: [
        spendStyles.pickerButton,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : theme.colors.card,
          borderColor: isDark ? "rgba(255,255,255,0.15)" : theme.colors.border,
        },
      ],
      pickerText: [spendStyles.pickerText, { color: theme.colors.text }],
      catIcon: [
        spendStyles.catIcon,
        { backgroundColor: theme.colors.actionIconLockBg },
      ],
    }),
    [
      isDark,
      theme.colors.actionIconLockBg,
      theme.colors.border,
      theme.colors.card,
      theme.colors.text,
    ]
  );

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
                selected={selectedCategoryId}
                onSelect={selectCategory}
                styles={pickerStyles}
              />
            )}

            {selectedCategory &&
              (isBillPaymentCategory ? (
                <BillPaymentSection
                  control={control}
                  categoryId={selectedCategory.id}
                  availableLocked={availableLocked}
                  onPurchaseComplete={handleBillPaymentComplete}
                  styles={spendStyles}
                />
              ) : (
                <SpendOutletFlow
                  theme={theme}
                  isDark={isDark}
                  styles={spendStyles}
                  pickerStyles={pickerStyles}
                  allowDirectOutlet={allowDirectOutlet}
                  onModeChange={setAllowDirectOutlet}
                  isCompanyLoading={isCompanyLoading}
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onSelectCompany={selectCompany}
                  isOutletLoading={isOutletLoading}
                  outlets={outlets}
                  selectedOutlet={selectedOutlet}
                  onSelectOutlet={setSelectedOutlet}
                  control={control}
                  availableLocked={availableLocked}
                  isSpending={isSpending}
                  isFormValid={formState.isValid}
                  onSubmit={submit}
                />
              ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </PinGuard>
  );
}
