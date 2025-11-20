import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
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

// Validation schema
const { width, height } = Dimensions.get("window");
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .test("is-valid-email", "Please enter a valid email address", (value) =>
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value || ""),
    )
    .required("Email is required"),
  firstName: yup
    .string()
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(3, "Last name must be at least 3 characters")
    .required("Last name is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter and one number",
    )
    .min(8, "Password must be at least 8 characters long"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required")
    .min(11, "Phone number must contain 11 digits"),
});

export type signUpFormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Floating animations for decorative elements
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

    // Rotation animation for dark mode
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
  }, [fadeAnim, floatAnim1, floatAnim2, floatAnim3, rotateAnim]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<signUpFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: signUpFormData) => {
    try {
      await authActions.signUp(data);
      router.replace("/signIn?registered=true");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again.",
      );
    }
  };

  const gradientColors = useMemo(
    () =>
      isDark
        ? ["#050B1A", "#0B1020", "#0D1428", "#1A0B2E", "#0F1724", "#0B1020"]
        : [
            "#FAFBFC",
            "#F0F9FF",
            "#EFF6FF",
            "#F5F3FF",
            "#FAF5FF",
            "#FEFCE8",
            "#FEF3F2",
            "#FAFBFC",
          ],
    [isDark, theme.colors],
  );

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const inputTheme = (error: boolean) => ({
    roundness: 12,
    colors: {
      primary: theme.colors.primary,
      outline: error ? theme.colors.danger : theme.colors.border,
      placeholder: isDark ? theme.colors.muted : theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: isDark ? theme.colors.text : theme.colors.muted,
      background: "transparent",
      onSurface: theme.colors.text,
    },
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
              <Animated.View
                style={[
                  styles.content,
                  { opacity: Platform.OS === "android" ? 1 : fadeAnim },
                ]}
              >
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
                      size={32}
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
                    Join FundLock
                  </Text>
                  <Text
                    style={[
                      styles.tagline,
                      {
                        color: isDark
                          ? theme.colors.balanceLabel
                          : "rgba(27,38,59,0.72)",
                      },
                    ]}
                  >
                    Start your journey to financial discipline
                  </Text>
                </View>

                {/* Form Card */}
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
                    Create Account
                  </Text>
                  <Text
                    style={[styles.formSubtitle, { color: theme.colors.muted }]}
                  >
                    Fill in your details to get started
                  </Text>

                  <View style={styles.formRow}>
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                          <TextInput
                            label="First Name"
                            autoCapitalize="words"
                            placeholder="John"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.firstName}
                            selectionColor={theme.colors.primary}
                            theme={inputTheme(!!errors.firstName)}
                            style={[
                              styles.input,
                              {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.07)"
                                  : theme.colors.background,
                                color: theme.colors.text,
                              },
                            ]}
                            outlineStyle={[
                              styles.inputOutline,
                              {
                                borderColor: errors.firstName
                                  ? theme.colors.danger
                                  : theme.colors.border,
                              },
                            ]}
                          />
                          {errors.firstName && (
                            <Text
                              style={[
                                styles.inputError,
                                { color: theme.colors.danger },
                              ]}
                            >
                              {errors.firstName.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                          <TextInput
                            label="Last Name"
                            autoCapitalize="words"
                            placeholder="Doe"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.lastName}
                            selectionColor={theme.colors.primary}
                            theme={inputTheme(!!errors.lastName)}
                            style={[
                              styles.input,
                              {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.07)"
                                  : theme.colors.background,
                                color: theme.colors.text,
                              },
                            ]}
                            outlineStyle={[
                              styles.inputOutline,
                              {
                                borderColor: errors.lastName
                                  ? theme.colors.danger
                                  : theme.colors.border,
                              },
                            ]}
                          />
                          {errors.lastName && (
                            <Text
                              style={[
                                styles.inputError,
                                { color: theme.colors.danger },
                              ]}
                            >
                              {errors.lastName.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                  </View>

                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          label="Email"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          placeholder="[email protected]"
                          mode="outlined"
                          value={value}
                          onChangeText={onChange}
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
                                ? "rgba(255,255,255,0.07)"
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
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          label="Phone Number"
                          keyboardType="phone-pad"
                          placeholder="08012345678"
                          mode="outlined"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={!!errors.phoneNumber}
                          left={
                            <TextInput.Icon
                              icon={() => (
                                <Ionicons
                                  name="call-outline"
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
                          theme={inputTheme(!!errors.phoneNumber)}
                          style={[
                            styles.input,
                            {
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.07)"
                                : theme.colors.background,
                              color: theme.colors.text,
                            },
                          ]}
                          outlineStyle={[
                            styles.inputOutline,
                            {
                              borderColor: errors.phoneNumber
                                ? theme.colors.danger
                                : theme.colors.border,
                            },
                          ]}
                        />
                        {errors.phoneNumber && (
                          <Text
                            style={[
                              styles.inputError,
                              { color: theme.colors.danger },
                            ]}
                          >
                            {errors.phoneNumber.message}
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
                          placeholder="Enter password"
                          secureTextEntry={!showPassword}
                          mode="outlined"
                          value={value}
                          onChangeText={onChange}
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
                                ? "rgba(255,255,255,0.07)"
                                : theme.colors.background,
                              color: theme.colors.text,
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

                  <TouchableOpacity
                    style={[
                      styles.signUpButton,
                      (!isValid || isSubmitting) && styles.signUpButtonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting || !isValid}
                  >
                    <LinearGradient
                      colors={
                        isValid && !isSubmitting
                          ? [theme.colors.primary, theme.colors.primary]
                          : [theme.colors.muted, theme.colors.muted]
                      }
                      style={styles.signUpButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isSubmitting ? (
                        <Text
                          style={[
                            styles.signUpButtonText,
                            { color: theme.colors.balanceText },
                          ]}
                        >
                          Creating Account...
                        </Text>
                      ) : (
                        <>
                          <Text
                            style={[
                              styles.signUpButtonText,
                              { color: theme.colors.balanceText },
                            ]}
                          >
                            Create Account
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

                  <TouchableOpacity
                    style={styles.signInLink}
                    onPress={() => router.replace("/signIn")}
                  >
                    <Text
                      style={[
                        styles.signInLinkText,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Already have an account?{" "}
                      <Text
                        style={[
                          styles.signInLinkBold,
                          { color: theme.colors.primary },
                        ]}
                      >
                        Sign In
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
    paddingVertical: 30,
  },
  content: { flex: 1 },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    marginTop: 12,
    lineHeight: 40,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    lineHeight: 18,
    includeFontPadding: false,
  },
  formCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginBottom: 6,
    lineHeight: 32,
    includeFontPadding: false,
  },
  formSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginBottom: 20,
    lineHeight: 20,
    includeFontPadding: false,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: { marginBottom: 16 },
  halfWidth: { flex: 1 },
  input: { fontSize: 14 },
  inputOutline: { borderWidth: 1.5 },
  inputError: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginLeft: 4,
    lineHeight: 16,
    includeFontPadding: false,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonDisabled: { opacity: 0.6 },
  signUpButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signUpButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 24,
    includeFontPadding: false,
  },
  signInLink: { alignItems: "center" },
  signInLinkText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
    includeFontPadding: false,
  },
  signInLinkBold: {
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 20,
    includeFontPadding: false,
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
