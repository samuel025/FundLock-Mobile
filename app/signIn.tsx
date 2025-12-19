import { AuthLayout } from "@/components/auth/AuthLayout";
import { OtpVerifyModal } from "@/components/auth/OtpVerifyModal";
import { MessageBanner } from "@/components/MessageBanner";
import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { loginUser } from "@/services/auth";
import { authStyles } from "@/styles/auth.styles";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .test("is-valid-email", "Please enter a valid email address", (value) =>
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value || "")
    )
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type SignInFormData = yup.InferType<typeof schema>;

export default function SignIn() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const { registered, otpVerified, verified } = useLocalSearchParams<{
    registered?: string;
    otpVerified?: string;
    verified?: string; // (backward-compat if you previously used ?verified=true)
  }>();

  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Existing “registered” banner (keep whatever you already do)
    if (registered === "true") {
      setShowSuccess(true);
      setSuccessMessage("Account created successfully. Please sign in.");
      const t = setTimeout(() => setShowSuccess(false), 4500);
      return () => clearTimeout(t);
    }

    // New: OTP verified banner
    if (otpVerified === "true" || verified === "true") {
      setShowSuccess(true);
      setSuccessMessage("OTP verified successfully. You can now log in.");
      const t = setTimeout(() => setShowSuccess(false), 4500);
      return () => clearTimeout(t);
    }
  }, [registered, otpVerified, verified, fadeAnim]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
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
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      await authActions.getUser();
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      // Backend “not verified” response comes as a 4xx but body has status "90"
      if (error?.apiStatus === "90") {
        const email = getValues("email");
        setOtpEmail(email);
        setShowOtpModal(true);
        return;
      }

      setSignInError(error?.message || "Invalid email or password");
    },
  });

  const onSubmit = (data: SignInFormData) => {
    setSignInError(null);
    setShowSuccess(false);
    signInMutation.mutate(data);
  };

  const inputTheme = (hasError: boolean) => ({
    roundness: 12,
    colors: {
      primary: theme.colors.primary,
      outline: hasError ? theme.colors.danger : theme.colors.border,
      placeholder: theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: isDark ? theme.colors.text : theme.colors.muted,
      background: "transparent",
      onSurface: theme.colors.text,
    },
  });

  const isLoading = signInMutation.isPending;
  const canSubmit = isValid && !isLoading;

  return (
    <>
      <AuthPageGuard>
        <AuthLayout>
          <Animated.View style={[authStyles.content, { opacity: fadeAnim }]}>
            {/* Logo */}
            <View style={authStyles.logoContainer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary]}
                style={[
                  authStyles.logoCircle,
                  { shadowColor: theme.colors.primary },
                ]}
              >
                <Ionicons name="lock-closed" size={40} color="#fff" />
              </LinearGradient>
              <Text
                style={[
                  authStyles.brandName,
                  { color: isDark ? "#fff" : theme.colors.text },
                ]}
              >
                Strixt
              </Text>
              <Text
                style={[
                  authStyles.tagline,
                  {
                    color: isDark
                      ? theme.colors.balanceLabel
                      : "rgba(27,38,59,0.75)",
                  },
                ]}
              >
                Financial Discipline Made Simple
              </Text>
            </View>

            {/* Success Banner */}
            {showSuccess && successMessage ? (
              <MessageBanner message={successMessage} type="success" />
            ) : null}

            {/* Error Banner */}
            {signInError && (
              <View
                style={[
                  authStyles.banner,
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
                    authStyles.bannerText,
                    { color: theme.colors.danger },
                  ]}
                >
                  {signInError}
                </Text>
              </View>
            )}

            {/* Form Card */}
            <View
              style={[
                authStyles.formCard,
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
                style={[authStyles.formTitle, { color: theme.colors.text }]}
              >
                Welcome Back
              </Text>
              <Text
                style={[authStyles.formSubtitle, { color: theme.colors.muted }]}
              >
                Sign in to continue managing your finances
              </Text>

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={authStyles.inputContainer}>
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
                              color={theme.colors.muted}
                            />
                          )}
                        />
                      }
                      theme={inputTheme(!!errors.email)}
                      style={[
                        authStyles.input,
                        {
                          backgroundColor: isDark
                            ? "rgba(15, 23, 36, 0.9)"
                            : theme.colors.background,
                        },
                      ]}
                      outlineStyle={[
                        authStyles.inputOutline,
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
                          authStyles.inputError,
                          { color: theme.colors.danger },
                        ]}
                      >
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={authStyles.inputContainer}>
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
                              color={theme.colors.muted}
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
                      theme={inputTheme(!!errors.password)}
                      style={[
                        authStyles.input,
                        {
                          backgroundColor: isDark
                            ? "rgba(15, 23, 36, 0.9)"
                            : theme.colors.background,
                        },
                      ]}
                      outlineStyle={[
                        authStyles.inputOutline,
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
                          authStyles.inputError,
                          { color: theme.colors.danger },
                        ]}
                      >
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Forgot Password */}
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

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  authStyles.primaryButton,
                  !canSubmit && authStyles.primaryButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={!canSubmit}
              >
                <LinearGradient
                  colors={
                    canSubmit
                      ? [theme.colors.primary, theme.colors.primary]
                      : [theme.colors.muted, theme.colors.muted]
                  }
                  style={authStyles.primaryButtonGradient}
                >
                  <Text
                    style={[authStyles.primaryButtonText, { color: "#fff" }]}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Text>
                  {!isLoading && (
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={authStyles.divider}>
                <View
                  style={[
                    authStyles.dividerLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
                <Text
                  style={[
                    authStyles.dividerText,
                    { color: theme.colors.muted },
                  ]}
                >
                  OR
                </Text>
                <View
                  style={[
                    authStyles.dividerLine,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              </View>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.replace("/signUp")}
              >
                <Text
                  style={[authStyles.linkText, { color: theme.colors.muted }]}
                >
                  Don&apos;t have an account?{" "}
                  <Text
                    style={[
                      authStyles.linkBold,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Sign Up
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </AuthLayout>
      </AuthPageGuard>

      <OtpVerifyModal
        visible={showOtpModal}
        email={otpEmail}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => {
          setShowOtpModal(false);
          setSignInError(null);

          const email = getValues("email");
          const password = getValues("password");

          if (email && password) {
            setShowSuccess(true);
            setSuccessMessage("OTP verified successfully. Logging you in...");
            signInMutation.mutate({ email, password });
            return;
          }

          setShowSuccess(true);
          setSuccessMessage("OTP verified successfully. You can now log in.");

          const t = setTimeout(() => setShowSuccess(false), 4500);
          // best-effort cleanup (modal handler scope)
          return () => clearTimeout(t);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
  },
});
