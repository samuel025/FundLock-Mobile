import { useTheme } from "@/theme";
import React from "react";
import { Controller } from "react-hook-form";
import { Platform, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function AmountSection({
  control,
  availableLocked,
  styles,
}: {
  control: any;
  availableLocked: number;
  styles: any;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const formatWithCommas = (val: string) => {
    if (!val || val === "" || val === ".") return val;
    const parts = val.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
        Amount
      </Text>
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <TextInput
              mode="outlined"
              label="Amount to spend"
              value={formatWithCommas(value !== undefined ? String(value) : "")}
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
                } else {
                  onChange(cleaned);
                }
              }}
              keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
              left={
                <TextInput.Icon
                  icon={() => (
                    <Text
                      style={[styles.currency, { color: theme.colors.primary }]}
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
                  primary: theme.colors.primary,
                  placeholder: isDark
                    ? "rgba(255,255,255,0.5)"
                    : theme.colors.muted,
                  text: theme.colors.text,
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
              <Text style={[styles.inputError, { color: theme.colors.danger }]}>
                {fieldState.error.message}
              </Text>
            )}
            <Text style={[styles.hint, { color: theme.colors.muted }]}>
              Available locked: ₦{availableLocked.toLocaleString()}
            </Text>
          </>
        )}
      />
    </View>
  );
}
