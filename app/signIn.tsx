import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { loginUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

const { width, height } = Dimensions.get("window");

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .test("is-valid-email", "Please enter a valid email address", (value) =>
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value || ""),
    )
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type SignInFormData = yup.InferType<typeof schema>;

export default function SignIn() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { registered } = useLocalSearchParams();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (registered === "true") {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [registered, fadeAnim]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const signInMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data.loginResponse;
      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("refresh_token", refreshToken);
      const { setTokens } = useAuthStore.getState();
      setTokens(accessToken, refreshToken);
      await authActions.getUser();
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      setSignInError(error.message || "Invalid email or password");
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setSignInError(null);
    setShowSuccessMessage(false);
    signInMutation.mutate(data);
  };

  const gradientColors = useMemo(
    () =>
      isDark
        ? [
            "#050B1A", // Deep navy
            "#0B1020", // Dark blue
            "#0D1428", // Midnight blue
            "#1A0B2E", // Deep purple
            "#0F1724", // Dark slate
            "#0B1020", // Back to dark
          ]
        : [
            "#FAFBFC", // Ultra light gray-blue
            "#F0F9FF", // Sky blue tint
            "#EFF6FF", // Light blue
            "#F5F3FF", // Lavender tint
            "#FAF5FF", // Light purple
            "#FEFCE8", // Light yellow
            "#FEF3F2", // Peachy pink
            "#FAFBFC", // Back to start
          ],
    [isDark, theme.colors],
  );

  // Floating animation setup
  useEffect(() => {
    const createFloatingAnimation = (
      animValue: Animated.Value,
      duration: number,
      delay: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    createFloatingAnimation(floatAnim1, 4000, 0);
    createFloatingAnimation(floatAnim2, 5000, 500);
    createFloatingAnimation(floatAnim3, 4500, 1000);
  }, [floatAnim1, floatAnim2, floatAnim3, rotateAnim]);

  const taglineColor = useMemo(
    () => (isDark ? theme.colors.balanceLabel : "rgba(27,38,59,0.75)"),
    [isDark, theme.colors.balanceLabel],
  );

  const inputTheme = (error: boolean) => ({
    roundness: 12,
    colors: {
      primary: theme.colors.primary,
      outline: error ? theme.colors.danger : theme.colors.border,
      placeholder: isDark ? theme.colors.muted : theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: isDark ? theme.colors.text : theme.colors.muted,
      background: "transparent",
      onSurface: theme.colors.text, // This controls the typed text color!
    },
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!fontsLoaded) return null;

  return (
    <AuthPageGuard>
      <LinearGradient colors={gradientColors} style={styles.container}>
        {/* Decorative Floating Elements - Both Modes */}
        <>
          {/* Large circle - Top Right */}
          <Animated.View
            style={[
              styles.decorativeCircle,
              styles.decorativeCircle1,
              {
                opacity: floatAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: isDark ? [0.3, 0.5] : [0.4, 0.7],
                }),
                transform: [
                  {
                    rotate: isDark ? rotateInterpolate : "0deg",
                  },
                  {
                    translateY: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                  {
                    scale: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(6, 182, 212, 0.15)", "rgba(139, 92, 246, 0.08)"]
                  : ["rgba(56, 178, 172, 0.15)", "rgba(56, 178, 172, 0.05)"]
              }
              style={styles.decorativeCircleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Medium circle - Left Side */}
          <Animated.View
            style={[
              styles.decorativeCircle,
              styles.decorativeCircle2,
              {
                opacity: floatAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: isDark ? [0.25, 0.45] : [0.3, 0.6],
                }),
                transform: [
                  {
                    rotate: isDark ? rotateInterpolate : "0deg",
                  },
                  {
                    translateX: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15],
                    }),
                  },
                  {
                    scale: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(139, 92, 246, 0.12)", "rgba(6, 182, 212, 0.06)"]
                  : ["rgba(79, 70, 229, 0.12)", "rgba(79, 70, 229, 0.04)"]
              }
              style={styles.decorativeCircleGradient}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </Animated.View>

          {/* Small circle - Bottom Right */}
          <Animated.View
            style={[
              styles.decorativeCircle,
              styles.decorativeCircle3,
              {
                opacity: floatAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: isDark ? [0.28, 0.48] : [0.35, 0.65],
                }),
                transform: [
                  {
                    rotate: isDark ? rotateInterpolate : "0deg",
                  },
                  {
                    translateY: floatAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 25],
                    }),
                  },
                  {
                    scale: floatAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(52, 211, 153, 0.11)", "rgba(251, 191, 36, 0.05)"]
                  : ["rgba(245, 158, 11, 0.13)", "rgba(245, 158, 11, 0.03)"]
              }
              style={styles.decorativeCircleGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Additional dark mode accent elements */}
          {isDark && (
            <>
              {/* Glowing orb effect - top left */}
              <Animated.View
                style={[
                  styles.darkModeOrb,
                  styles.darkModeOrb1,
                  {
                    opacity: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.15, 0.3],
                    }),
                    transform: [
                      {
                        scale: floatAnim2.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(6, 182, 212, 0.2)", "transparent"]}
                  style={styles.decorativeCircleGradient}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>

              {/* Glowing orb effect - bottom center */}
              <Animated.View
                style={[
                  styles.darkModeOrb,
                  styles.darkModeOrb2,
                  {
                    opacity: floatAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.12, 0.25],
                    }),
                    transform: [
                      {
                        scale: floatAnim3.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.4],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(139, 92, 246, 0.18)", "transparent"]}
                  style={styles.decorativeCircleGradient}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>
            </>
          )}
        </>

        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {!isDark && <View style={styles.lightVignette} pointerEvents="none" />}

        {!isDark && <View style={styles.lightVignette} pointerEvents="none" />}
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? 0 : (StatusBar.currentHeight ?? 0)
            }
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primary]}
                    style={[
                      styles.logoCircle,
                      { shadowColor: theme.colors.primary },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={40}
                      color={theme.colors.balanceText}
                    />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.brandName,
                      {
                        color: isDark
                          ? theme.colors.balanceText
                          : theme.colors.text,
                      },
                    ]}
                  >
                    FundLock
                  </Text>
                  <Text
                    style={[
                      styles.tagline,
                      {
                        color: taglineColor,
                      },
                    ]}
                  >
                    Financial Discipline Made Simple
                  </Text>
                </View>

                {showSuccessMessage && (
                  <View
                    style={[
                      styles.successBanner,
                      {
                        backgroundColor: theme.colors.successBannerBg,
                        borderLeftColor: theme.colors.successBannerBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.successBannerBorder}
                    />
                    <Text
                      style={[
                        styles.successText,
                        { color: theme.colors.successBannerText },
                      ]}
                    >
                      Account created! Please sign in.
                    </Text>
                  </View>
                )}

                {signInError && (
                  <View
                    style={[
                      styles.errorBanner,
                      {
                        backgroundColor: "rgba(220,38,38,0.15)",
                        borderLeftColor: theme.colors.danger,
                      },
                    ]}
                  >
                    <Ionicons
                      name="alert-circle"
                      size={20}
                      color={theme.colors.danger}
                    />
                    <Text
                      style={[
                        styles.errorText,
                        {
                          color: isDark
                            ? theme.colors.actionIconSpendBg
                            : theme.colors.danger,
                        },
                      ]}
                    >
                      {signInError}
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.formCard,
                    isDark
                      ? {
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.10)",
                          overflow: "hidden",
                        }
                      : { backgroundColor: theme.colors.card },
                  ]}
                >
                  {isDark && (
                    <BlurView
                      intensity={30}
                      tint="dark"
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <Text
                    style={[styles.formTitle, { color: theme.colors.text }]}
                  >
                    Welcome Back
                  </Text>
                  <Text
                    style={[styles.formSubtitle, { color: theme.colors.muted }]}
                  >
                    Sign in to continue managing your finances
                  </Text>

                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          label="Email"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          placeholder="Enter your email"
                          mode="outlined"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text);
                            setSignInError(null);
                          }}
                          onBlur={onBlur}
                          error={!!errors.email}
                          left={
                            <TextInput.Icon
                              icon={() => (
                                <Ionicons
                                  name="mail-outline"
                                  size={20}
                                  color={
                                    isDark
                                      ? theme.colors.balanceLabel
                                      : theme.colors.muted
                                  }
                                />
                              )}
                            />
                          }
                          selectionColor={theme.colors.primary}
                          theme={inputTheme(!!errors.email)}
                          style={[
                            styles.input,
                            {
                              backgroundColor: isDark
                                ? "rgba(15, 23, 36, 0.9)"
                                : theme.colors.background,
                              color: theme.colors.text,
                            },
                          ]}
                          outlineStyle={[
                            styles.inputOutline,
                            {
                              borderColor: errors.email
                                ? theme.colors.danger
                                : theme.colors.border,
                            },
                          ]}
                        />

                        {errors.email && (
                          <Text
                            style={[
                              styles.inputError,
                              { color: theme.colors.danger },
                            ]}
                          >
                            {errors.email.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          label="Password"
                          autoCapitalize="none"
                          placeholder="Enter your password"
                          secureTextEntry={!showPassword}
                          mode="outlined"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text);
                            setSignInError(null);
                          }}
                          onBlur={onBlur}
                          error={!!errors.password}
                          left={
                            <TextInput.Icon
                              icon={() => (
                                <Ionicons
                                  name="lock-closed-outline"
                                  size={20}
                                  color={
                                    isDark
                                      ? theme.colors.balanceLabel
                                      : theme.colors.muted
                                  }
                                />
                              )}
                            />
                          }
                          right={
                            <TextInput.Icon
                              icon={showPassword ? "eye-off" : "eye"}
                              onPress={() => setShowPassword(!showPassword)}
                            />
                          }
                          selectionColor={theme.colors.primary}
                          theme={inputTheme(!!errors.password)}
                          style={[
                            styles.input,
                            {
                              backgroundColor: isDark
                                ? "rgba(15, 23, 36, 0.9)"
                                : theme.colors.background,
                              color: theme.colors.balanceText,
                            },
                          ]}
                          outlineStyle={[
                            styles.inputOutline,
                            {
                              borderColor: errors.password
                                ? theme.colors.danger
                                : theme.colors.border,
                            },
                          ]}
                        />

                        {errors.password && (
                          <Text
                            style={[
                              styles.inputError,
                              { color: theme.colors.danger },
                            ]}
                          >
                            {errors.password.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text
                      style={[
                        styles.forgotPasswordText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Forgot password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.signInButton,
                      (!isValid || signInMutation.isPending) &&
                        styles.signInButtonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={signInMutation.isPending || !isValid}
                  >
                    <LinearGradient
                      colors={
                        isValid && !signInMutation.isPending
                          ? [theme.colors.primary, theme.colors.primary]
                          : [theme.colors.muted, theme.colors.muted]
                      }
                      style={styles.signInButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {signInMutation.isPending ? (
                        <Text
                          style={[
                            styles.signInButtonText,
                            { color: theme.colors.balanceText },
                          ]}
                        >
                          Signing in...
                        </Text>
                      ) : (
                        <>
                          <Text
                            style={[
                              styles.signInButtonText,
                              { color: theme.colors.balanceText },
                            ]}
                          >
                            Sign In
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={theme.colors.balanceText}
                          />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.divider}>
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: theme.colors.border },
                      ]}
                    />
                    <Text
                      style={[
                        styles.dividerText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      OR
                    </Text>
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: theme.colors.border },
                      ]}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.signUpLink}
                    onPress={() => router.replace("/signUp")}
                  >
                    <Text
                      style={[
                        styles.signUpLinkText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Don&apos;t have an account?{" "}
                      <Text
                        style={[
                          styles.signUpLinkBold,
                          { color: theme.colors.primary },
                        ]}
                      >
                        Sign Up
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </AuthPageGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: { flex: 1 },
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
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
    lineHeight: 20,
    includeFontPadding: false,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
    includeFontPadding: false,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
    includeFontPadding: false,
  },
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
    includeFontPadding: false,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 24,
    lineHeight: 20,
    includeFontPadding: false,
  },
  inputContainer: { marginBottom: 20 },
  input: { fontSize: 14 },
  inputOutline: { borderWidth: 1.5 },
  inputError: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginLeft: 4,
    lineHeight: 18,
    includeFontPadding: false,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
    includeFontPadding: false,
  },
  signInButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  signInButtonDisabled: { opacity: 0.6 },
  signInButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 24,
    includeFontPadding: false,
  },
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
    includeFontPadding: false,
  },
  signUpLink: { alignItems: "center" },
  signUpLinkText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
    includeFontPadding: false,
  },
  signUpLinkBold: { fontFamily: "Poppins_600SemiBold" },
  lightVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  // Decorative elements for both modes
  decorativeCircle: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
  decorativeCircleGradient: {
    width: "100%",
    height: "100%",
  },
  decorativeCircle1: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.35,
    right: -width * 0.25,
  },
  decorativeCircle2: {
    width: width * 0.5,
    height: width * 0.5,
    top: height * 0.25,
    left: -width * 0.2,
  },
  decorativeCircle3: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: height * 0.1,
    right: -width * 0.1,
  },
  // Dark mode specific glowing orbs
  darkModeOrb: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
  darkModeOrb1: {
    width: width * 0.9,
    height: width * 0.9,
    top: -width * 0.5,
    left: -width * 0.4,
  },
  darkModeOrb2: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.4,
    left: width * 0.1,
  },
});
