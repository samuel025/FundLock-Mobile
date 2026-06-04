import AmountSection from "@/components/spendComponents/AmountSection";
import LoadingRow from "@/components/spendComponents/LoadingRow";
import PinSection from "@/components/spendComponents/PinSection";
import RecipientPicker from "@/components/spendComponents/RecipientPicker";
import { Recipient } from "@/services/recipient";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type SpendRecipientFlowProps = {
  theme: any;
  isDark: boolean;
  styles: any;
  pickerStyles: any;

  isRecipientsLoading: boolean;
  recipients: Recipient[];
  selectedRecipientId: number | null;
  onSelectRecipient: (id: number) => void;

  control: any;
  availableLocked: number;

  isRedeeming: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
};

export default function SpendRecipientFlow({
  theme,
  isDark,
  styles,
  pickerStyles,

  isRecipientsLoading,
  recipients,
  selectedRecipientId,
  onSelectRecipient,

  control,
  availableLocked,

  isRedeeming,
  isFormValid,
  onSubmit,
}: SpendRecipientFlowProps) {
  const disableAction = isRedeeming || !isFormValid;

  const selectedRecipient = selectedRecipientId
    ? recipients.find((r) => r.id === selectedRecipientId) ?? null
    : null;

  return (
    <>
      <Text style={[styles.helperText, { color: theme.colors.muted }]}>
        Select a recipient to send funds to their bank account.
      </Text>

      {/* Recipient Picker */}
      {isRecipientsLoading ? (
        <LoadingRow
          theme={theme}
          isDark={isDark}
          styles={styles}
          message="Loading recipients..."
        />
      ) : (
        <RecipientPicker
          recipients={recipients}
          selected={selectedRecipientId}
          onSelect={onSelectRecipient}
          styles={pickerStyles}
        />
      )}

      {/* Selected recipient summary */}
      {selectedRecipient && (
        <View style={{ marginTop: 8, marginBottom: 6 }}>
          <Text style={[styles.helperText, { color: theme.colors.muted }]}>
            Sending to:{" "}
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
              }}
            >
              {selectedRecipient.vendorName || selectedRecipient.accountName}
            </Text>
            {" • "}
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                color: theme.colors.muted,
              }}
            >
              {selectedRecipient.bankName}
            </Text>
          </Text>
        </View>
      )}

      {/* Amount & PIN - only after recipient selected */}
      {selectedRecipientId && (
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
          {isRedeeming ? (
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
                Send to Recipient
              </Text>
              <Ionicons
                name="send"
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
