import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ModeSwitchProps {
  theme: any;
  isDark: boolean;
  styles: any;
  allowDirectOutlet: boolean;
  onModeChange: (direct: boolean) => void;
}

export default function ModeSwitch({
  theme,
  isDark,
  styles,
  allowDirectOutlet,
  onModeChange,
}: ModeSwitchProps) {
  const Glass = ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: any;
  }) => {
    if (!isDark) {
      return <View style={style}>{children}</View>;
    }
    return (
      <View style={[style, glassBase.container]}>
        <BlurView intensity={30} tint="dark" style={glassBase.blur} />
        {children}
      </View>
    );
  };

  return (
    <Glass
      style={[
        styles.modeSwitch,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : theme.colors.actionIconDepositBg,
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : theme.colors.actionIconDepositBg,
        },
      ]}
    >
      {/* Select outlet directly - NOW FIRST */}
      <Pressable
        onPress={() => onModeChange(true)}
        accessibilityRole="button"
        accessibilityState={{ selected: allowDirectOutlet }}
        style={({ pressed }) => [
          styles.modeOption,
          allowDirectOutlet && { backgroundColor: theme.colors.primary },
          pressed && styles.modeOptionPressed,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            name="storefront"
            size={14}
            color={
              allowDirectOutlet
                ? theme.colors.balanceText
                : theme.colors.primary
            }
          />
          <Text
            style={[
              styles.modeOptionText,
              allowDirectOutlet
                ? { color: theme.colors.balanceText }
                : { color: theme.colors.primary },
            ]}
          >
            Select outlet directly
          </Text>
        </View>
      </Pressable>

      {/* By company - NOW SECOND */}
      <Pressable
        onPress={() => onModeChange(false)}
        accessibilityRole="button"
        accessibilityState={{ selected: !allowDirectOutlet }}
        style={({ pressed }) => [
          styles.modeOption,
          !allowDirectOutlet && { backgroundColor: theme.colors.primary },
          pressed && styles.modeOptionPressed,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            name="business"
            size={14}
            color={
              !allowDirectOutlet
                ? theme.colors.balanceText
                : theme.colors.primary
            }
          />
          <Text
            style={[
              styles.modeOptionText,
              !allowDirectOutlet
                ? { color: theme.colors.balanceText }
                : { color: theme.colors.primary },
            ]}
          >
            By company
          </Text>
        </View>
      </Pressable>
    </Glass>
  );
}

const glassBase = StyleSheet.create({
  container: { overflow: "hidden", position: "relative" },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
});
