import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
        PIN
      </Text>
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
              left={
                <TextInput.Icon
                  icon={() => (
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={
                        isDark ? "rgba(255,255,255,0.6)" : theme.colors.muted
                      }
                    />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  icon={showPin ? "eye-off" : "eye"}
                  onPress={() => setShowPin((s) => !s)}
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
                  text: theme.colors.text,
                  placeholder: isDark
                    ? "rgba(255,255,255,0.5)"
                    : theme.colors.muted,
                  primary: theme.colors.primary,
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
          </>
        )}
      />
    </View>
  );
}
