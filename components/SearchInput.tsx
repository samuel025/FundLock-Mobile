import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  isLoading = false,
}: SearchInputProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.08)"
            : theme.colors.surface,
          borderColor: isDark ? "rgba(255,255,255,0.15)" : theme.colors.border,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={isDark ? "rgba(255,255,255,0.5)" : theme.colors.muted}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "#94A3B8"}
        style={[
          styles.input,
          {
            color: theme.colors.text,
          },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.loader}
        />
      )}
      {!isLoading && value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clear}>
          <Ionicons
            name="close-circle"
            size={18}
            color={isDark ? "rgba(255,255,255,0.5)" : theme.colors.muted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    paddingVertical: 8,
  },
  loader: {
    marginLeft: 8,
  },
  clear: {
    marginLeft: 8,
    padding: 2,
  },
});
