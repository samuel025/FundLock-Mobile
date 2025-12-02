import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";

export const useToastConfig = () => {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  return {
    success: (props: BaseToastProps) => (
      <View
        style={[
          styles.toastContainer,
          {
            backgroundColor: isDark ? "#14B8A6" : "#E7F6F2",
            borderLeftColor: theme.colors.success,
          },
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={isDark ? "#FFFFFF" : theme.colors.success}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text1,
              { color: isDark ? "#FFFFFF" : theme.colors.text },
            ]}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={[
                styles.text2,
                { color: isDark ? "#F0FDFA" : theme.colors.muted },
              ]}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => Toast.hide()}>
          <Ionicons
            name="close"
            size={20}
            color={isDark ? "#FFFFFF" : theme.colors.muted}
          />
        </TouchableOpacity>
      </View>
    ),
    error: (props: BaseToastProps) => (
      <View
        style={[
          styles.toastContainer,
          {
            backgroundColor: isDark ? "#DC2626" : "#FEE2E2",
            borderLeftColor: theme.colors.danger,
          },
        ]}
      >
        <Ionicons
          name="alert-circle"
          size={24}
          color={isDark ? "#FFFFFF" : theme.colors.danger}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text1,
              { color: isDark ? "#FFFFFF" : theme.colors.text },
            ]}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={[
                styles.text2,
                { color: isDark ? "#FECACA" : theme.colors.muted },
              ]}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => Toast.hide()}>
          <Ionicons
            name="close"
            size={20}
            color={isDark ? "#FFFFFF" : theme.colors.muted}
          />
        </TouchableOpacity>
      </View>
    ),
    info: (props: BaseToastProps) => (
      <View
        style={[
          styles.toastContainer,
          {
            backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
            borderLeftColor: theme.colors.primary,
          },
        ]}
      >
        <Ionicons
          name="information-circle"
          size={24}
          color={isDark ? "#FFFFFF" : theme.colors.primary}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text1,
              { color: isDark ? "#FFFFFF" : theme.colors.text },
            ]}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={[
                styles.text2,
                { color: isDark ? "#BFDBFE" : theme.colors.muted },
              ]}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => Toast.hide()}>
          <Ionicons
            name="close"
            size={20}
            color={isDark ? "#FFFFFF" : theme.colors.muted}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  text2: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },
});
