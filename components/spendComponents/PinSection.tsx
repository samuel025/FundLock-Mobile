import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function PinSection({
  control,
  styles,
}: {
  control: any;
  styles: any;
}) {
  const [showPin, setShowPin] = useState(false);

  return (
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
                  fonts: { regular: { fontFamily: "Poppins_500Medium" } },
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
  );
}
