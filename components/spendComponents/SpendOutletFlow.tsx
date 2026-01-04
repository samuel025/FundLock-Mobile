import AmountSection from "@/components/spendComponents/AmountSection";
import CompanyPicker from "@/components/spendComponents/CompanyPicker";
import LoadingRow from "@/components/spendComponents/LoadingRow";
import ModeSwitch from "@/components/spendComponents/ModeSwitch";
import OutletPicker from "@/components/spendComponents/OutletPicker";
import PinSection from "@/components/spendComponents/PinSection";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type SpendOutletFlowProps = {
  theme: any;
  isDark: boolean;
  styles: any;

  allowDirectOutlet: boolean;
  onModeChange: (next: boolean) => void;

  isCompanyLoading: boolean;
  companies: any;
  selectedCompany: string | null;
  onSelectCompany: (id: string) => void;

  isOutletLoading: boolean;
  outlets: any;
  selectedOutlet: string | null;
  onSelectOutlet: (id: string) => void;

  control: any;
  availableLocked: number;

  isSpending: boolean;
  isFormValid: boolean;
  onSubmit: () => void;

  pickerStyles: any;
};

export default function SpendOutletFlow({
  theme,
  isDark,
  styles,

  allowDirectOutlet,
  onModeChange,

  isCompanyLoading,
  companies,
  selectedCompany,
  onSelectCompany,

  isOutletLoading,
  outlets,
  selectedOutlet,
  onSelectOutlet,

  control,
  availableLocked,

  isSpending,
  isFormValid,
  onSubmit,

  pickerStyles,
  categoryId,
}: SpendOutletFlowProps & { categoryId?: string }) {
  const disableAction = isSpending || !isFormValid;

  const pickedOutlet = selectedOutlet
    ? outlets?.find(
        (o: any) =>
          String(o.id) === String(selectedOutlet) || o.id === selectedOutlet
      )
    : null;

  return (
    <>
      {/* Mode Switch */}
      <ModeSwitch
        theme={theme}
        isDark={isDark}
        styles={styles}
        allowDirectOutlet={allowDirectOutlet}
        onModeChange={onModeChange}
      />

      <Text style={[styles.helperText, { color: theme.colors.muted }]}>
        {allowDirectOutlet
          ? "Select an outlet directly to make payment."
          : selectedCompany
          ? "Showing outlets for the selected company."
          : "Pick a company first to see its outlets."}
      </Text>

      {/* Direct Outlet Mode - Show outlets directly (NOW FIRST/DEFAULT) */}
      {allowDirectOutlet && (
        <>
          {isOutletLoading ? (
            <LoadingRow
              theme={theme}
              isDark={isDark}
              styles={styles}
              message="Loading outlets..."
            />
          ) : (
            <OutletPicker
              outlets={outlets}
              selected={selectedOutlet}
              onSelect={onSelectOutlet}
              styles={pickerStyles}
              categoryId={categoryId}
            />
          )}
        </>
      )}

      {/* Company Mode - Show company picker first, then outlets */}
      {!allowDirectOutlet && (
        <>
          {isCompanyLoading ? (
            <LoadingRow
              theme={theme}
              isDark={isDark}
              styles={styles}
              message="Loading companies..."
            />
          ) : (
            <CompanyPicker
              companies={companies}
              selected={selectedCompany}
              onSelect={onSelectCompany}
              styles={pickerStyles}
              categoryId={categoryId}
            />
          )}

          {/* Add spacing between company and outlet pickers */}
          {selectedCompany && (
            <View style={{ marginTop: 25 }}>
              {isOutletLoading ? (
                <LoadingRow
                  theme={theme}
                  isDark={isDark}
                  styles={styles}
                  message="Loading outlets..."
                />
              ) : (
                <OutletPicker
                  outlets={outlets}
                  selected={selectedOutlet}
                  onSelect={onSelectOutlet}
                  styles={pickerStyles}
                  categoryId={categoryId}
                  companyId={selectedCompany}
                />
              )}
            </View>
          )}
        </>
      )}

      {/* Selected outlet summary */}
      {selectedOutlet && pickedOutlet && (
        <View style={{ marginTop: 8, marginBottom: 6 }}>
          <Text style={[styles.helperText, { color: theme.colors.muted }]}>
            Selected outlet:{" "}
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
              }}
            >
              {pickedOutlet.name}
            </Text>
          </Text>
        </View>
      )}

      {/* Amount & PIN sections - only show after outlet selected */}
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

      {/* Action button */}
      <TouchableOpacity
        style={[styles.actionButton, disableAction && styles.disabledButton]}
        onPress={onSubmit}
        disabled={disableAction}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary]}
          style={styles.actionGradient}
        >
          {isSpending ? (
            <>
              <ActivityIndicator
                size="small"
                color={theme.colors.balanceText}
              />
              <Text
                style={[
                  styles.actionText,
                  { marginLeft: 8, color: theme.colors.balanceText },
                ]}
              >
                Processing...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={[styles.actionText, { color: theme.colors.balanceText }]}
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
    </>
  );
}
