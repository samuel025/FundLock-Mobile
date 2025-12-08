import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  content: { flex: 1 },

  // Logo section
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    marginTop: 16,
    lineHeight: 48,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
    lineHeight: 20,
  },

  // Banners
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
  },

  // Form card
  formCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 8,
    lineHeight: 36,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 24,
    lineHeight: 20,
  },

  // Inputs
  inputContainer: { marginBottom: 20 },
  input: { fontSize: 14 },
  inputOutline: { borderWidth: 1.5 },
  inputError: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginLeft: 4,
    lineHeight: 18,
  },

  // Buttons
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 24,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    lineHeight: 18,
  },

  // Links
  linkContainer: { alignItems: "center" },
  linkText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
  },
  linkBold: { fontFamily: "Poppins_600SemiBold" },
});
