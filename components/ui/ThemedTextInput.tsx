import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";

interface ThemedTextInputProps extends Omit<TextInputProps, "theme" | "error"> {
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftComponent?: React.ReactNode;
}

export function ThemedTextInput({
  error,
  hint,
  leftIcon,
  leftComponent,
  style,
  ...props
}: ThemedTextInputProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const iconColor = isDark ? "rgba(255,255,255,0.6)" : theme.colors.muted;

  const inputTheme = {
    fonts: {
      regular: { fontFamily: "Poppins_500Medium" },
    },
    colors: {
      primary: theme.colors.primary,
      placeholder: isDark ? "rgba(255,255,255,0.5)" : theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: isDark ? "rgba(255,255,255,0.6)" : theme.colors.muted,
      background: isDark ? theme.colors.background : theme.colors.surface,
      onSurface: theme.colors.text,
      outline: isDark ? "rgba(255,255,255,0.2)" : theme.colors.border,
      surfaceVariant: isDark ? theme.colors.background : theme.colors.surface,
    },
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        outlineColor={isDark ? "rgba(255,255,255,0.2)" : theme.colors.border}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.text}
        style={[
          styles.input,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : theme.colors.surface,
          },
          style,
        ]}
        outlineStyle={styles.outline}
        theme={inputTheme}
        left={
          leftComponent ? (
            <TextInput.Icon icon={() => leftComponent} />
          ) : leftIcon ? (
            <TextInput.Icon
              icon={() => (
                <Ionicons name={leftIcon} size={20} color={iconColor} />
              )}
            />
          ) : undefined
        }
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.danger }]}>
          {error}
        </Text>
      )}
      {hint && (
        <Text style={[styles.hint, { color: theme.colors.muted }]}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    fontSize: 16,
  },
  outline: {
    borderRadius: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_500Medium",
  },
  hint: {
    marginTop: 8,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
});
