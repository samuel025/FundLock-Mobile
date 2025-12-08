import { Platform, StatusBar, StyleSheet } from "react-native";

export const budgetStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 20,
    }),
    paddingBottom: 40,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  pickerText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
  },
  currency: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#38B2AC",
  },
});
