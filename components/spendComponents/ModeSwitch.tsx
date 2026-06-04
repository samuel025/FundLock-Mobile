import { SpendMode } from "@/hooks/useSpendTabController";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MODES: {
  key: SpendMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "direct", label: "Direct", icon: "storefront" },
  { key: "company", label: "By Company", icon: "business" },
  { key: "recipient", label: "Recipient", icon: "person" },
];

interface ModeSwitchProps {
  theme: any;
  isDark: boolean;
  styles: any;
  spendMode: SpendMode;
  onModeChange: (mode: SpendMode) => void;
}

export default function ModeSwitch({
  theme,
  isDark,
  styles,
  spendMode,
  onModeChange,
}: ModeSwitchProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
        How do you want to pay?
      </Text>
      <View
        style={[
          localStyles.container,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "#F0F4F8",
            borderColor: isDark
              ? "rgba(255,255,255,0.10)"
              : "#E2E8F0",
          },
        ]}
      >
        {MODES.map((mode) => {
          const active = spendMode === mode.key;
          return (
            <Pressable
              key={mode.key}
              onPress={() => onModeChange(mode.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                localStyles.option,
                active && [
                  localStyles.optionActive,
                  { backgroundColor: theme.colors.primary },
                ],
                pressed && !active && localStyles.optionPressed,
              ]}
            >
              <Ionicons
                name={mode.icon}
                size={14}
                color={
                  active
                    ? "#fff"
                    : isDark
                      ? "rgba(255,255,255,0.6)"
                      : theme.colors.primary
                }
              />
              <Text
                style={[
                  localStyles.optionText,
                  active
                    ? localStyles.optionTextActive
                    : {
                        color: isDark
                          ? "rgba(255,255,255,0.7)"
                          : "#475569",
                      },
                ]}
                numberOfLines={1}
              >
                {mode.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 11,
  },
  optionActive: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  optionTextActive: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
});
