import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { authStyles } from "@/styles/auth.styles";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .test("is-valid-email", "Please enter a valid email address", (value) =>
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value || "")
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
      "Password must contain at least one uppercase letter and one number"
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

  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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
        error.message || "Failed to create account. Please try again."
      );
    }
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

  const inputStyle = {
    backgroundColor: isDark
      ? "rgba(255,255,255,0.07)"
      : theme.colors.background,
    color: theme.colors.text,
  };

  const getOutlineStyle = (hasError: boolean) => [
    authStyles.inputOutline,
    { borderColor: hasError ? theme.colors.danger : theme.colors.border },
  ];

  const iconColor = isDark ? theme.colors.balanceLabel : theme.colors.muted;

  const canSubmit = isValid && !isSubmitting;

  return (
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
              <Ionicons
                name="lock-closed"
                size={32}
                color={theme.colors.balanceText}
              />
            </LinearGradient>
            <Text
              style={[
                authStyles.brandName,
                {
                  color: isDark ? theme.colors.balanceText : theme.colors.text,
                },
              ]}
            >
              Join BlockIT
            </Text>
            <Text
              style={[
                authStyles.tagline,
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

            <Text style={[authStyles.formTitle, { color: theme.colors.text }]}>
              Create Account
            </Text>
            <Text
              style={[authStyles.formSubtitle, { color: theme.colors.muted }]}
            >
              Fill in your details to get started
            </Text>

            {/* Name Row */}
            <View style={styles.formRow}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[authStyles.inputContainer, styles.halfWidth]}>
                    <TextInput
                      label="First Name"
                      autoCapitalize="words"
                      placeholder="John"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.firstName}
                      theme={inputTheme(!!errors.firstName)}
                      style={[authStyles.input, inputStyle]}
                      outlineStyle={getOutlineStyle(!!errors.firstName)}
                    />
                    {errors.firstName && (
                      <Text
                        style={[
                          authStyles.inputError,
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
                  <View style={[authStyles.inputContainer, styles.halfWidth]}>
                    <TextInput
                      label="Last Name"
                      autoCapitalize="words"
                      placeholder="Doe"
                      mode="outlined"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.lastName}
                      theme={inputTheme(!!errors.lastName)}
                      style={[authStyles.input, inputStyle]}
                      outlineStyle={getOutlineStyle(!!errors.lastName)}
                    />
                    {errors.lastName && (
                      <Text
                        style={[
                          authStyles.inputError,
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

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={authStyles.inputContainer}>
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
                            color={iconColor}
                          />
                        )}
                      />
                    }
                    theme={inputTheme(!!errors.email)}
                    style={[authStyles.input, inputStyle]}
                    outlineStyle={getOutlineStyle(!!errors.email)}
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

            {/* Phone */}
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={authStyles.inputContainer}>
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
                            color={iconColor}
                          />
                        )}
                      />
                    }
                    theme={inputTheme(!!errors.phoneNumber)}
                    style={[authStyles.input, inputStyle]}
                    outlineStyle={getOutlineStyle(!!errors.phoneNumber)}
                  />
                  {errors.phoneNumber && (
                    <Text
                      style={[
                        authStyles.inputError,
                        { color: theme.colors.danger },
                      ]}
                    >
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={authStyles.inputContainer}>
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
                            color={iconColor}
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
                    style={[authStyles.input, inputStyle]}
                    outlineStyle={getOutlineStyle(!!errors.password)}
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

            {/* Submit Button */}
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
                  style={[
                    authStyles.primaryButtonText,
                    { color: theme.colors.balanceText },
                  ]}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Text>
                {!isSubmitting && (
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={theme.colors.balanceText}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.replace("/signIn")}
            >
              <Text
                style={[authStyles.linkText, { color: theme.colors.muted }]}
              >
                Already have an account?{" "}
                <Text
                  style={[authStyles.linkBold, { color: theme.colors.primary }]}
                >
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </AuthLayout>
    </AuthPageGuard>
  );
}

const styles = StyleSheet.create({
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});
