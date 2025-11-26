import { BlurView } from "expo-blur";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingRowProps {
  theme: any;
  isDark: boolean;
  styles: any;
  message: string;
}

export default function LoadingRow({
  theme,
  isDark,
  styles,
  message,
}: LoadingRowProps) {
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
        styles.loadingRow,
        {
          borderColor: theme.colors.border,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : theme.colors.card,
        },
      ]}
    >
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
        {message}
      </Text>
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
