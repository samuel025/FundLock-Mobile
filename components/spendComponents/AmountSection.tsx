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
  return (
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
                onChangeText={(t) => {
                  // sanitize: keep digits and at most one decimal point
                  const cleaned = t
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");

                  // try to parse numeric value
                  const numeric = parseFloat(cleaned);

                  // if numeric and greater than availableLocked, clamp to availableLocked
                  if (!isNaN(numeric)) {
                    if (numeric > availableLocked) {
                      onChange(String(availableLocked));
                    } else {
                      onChange(cleaned);
                    }
                  } else {
                    // allow empty string or a single dot while typing (e.g. ".5")
                    onChange(cleaned);
                  }
                }}
                keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
                left={
                  <TextInput.Icon
                    icon={() => <Text style={styles.currency}>₦</Text>}
                  />
                }
                outlineColor="#E2E8F0"
                activeOutlineColor="#38B2AC"
                style={styles.input}
                theme={{
                  fonts: { regular: { fontFamily: "Poppins_500Medium" } },
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
  );
}
