import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface VendorIdShortcutProps {
  theme: any;
  styles: any;
}

export default function VendorIdShortcut({
  theme,
  styles,
}: VendorIdShortcutProps) {
  return (
    <View style={styles.lockActionWrap}>
      <TouchableOpacity
        style={[styles.lockCard, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/spendByOrgId")}
        accessibilityRole="button"
      >
        <View style={styles.lockCardLeft}>
          <View
            style={[
              styles.lockIcon,
              { backgroundColor: theme.colors.balanceCardStart },
            ]}
          >
            <Ionicons
              name="storefront"
              size={18}
              color={theme.colors.balanceText}
            />
          </View>
          <View style={styles.lockText}>
            <Text
              style={[styles.lockTitle, { color: theme.colors.balanceText }]}
            >
              Spend By Vendor&apos;s ID
            </Text>
            <Text
              style={[
                styles.lockSubtitle,
                { color: theme.colors.balanceLabel },
              ]}
            >
              You can just search by the vendor&apos;s ID and spend
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
}
