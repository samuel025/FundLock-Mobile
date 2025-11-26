import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";

interface SpendHeaderProps {
  theme: any;
  isDark: boolean;
  styles: any;
}

export default function SpendHeader({
  theme,
  isDark,
  styles,
}: SpendHeaderProps) {
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
    <View style={styles.header}>
      <View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Spend Budgeted Funds
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Pay vendors using budgeted category funds
        </Text>
      </View>
      <Glass
        style={[
          styles.iconBox,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : theme.colors.card,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "transparent",
          },
        ]}
      >
        <Ionicons name="card" size={26} color={theme.colors.primary} />
      </Glass>
    </View>
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
