import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  password: yup
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

export type signUpFormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);

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
      pin: "",
    },
  });

  const onSubmit = async (data: signUpFormData) => {
    try {
      const response = await authActions.signUp(data);
      if (response) {
        router.replace("/signIn?registered=true");
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  };

  return (
    <AuthPageGuard>
      <LinearGradient
        colors={["#35ae84ff", "#09A674"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.body}>
              <View style={styles.box}>
                <FontAwesome name="lock" size={35} color="#09A674" />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>FundLock</Text>
                <Text style={styles.subTitleText}>
                  Financial Discipline Made Simple
                </Text>
              </View>

              <View style={styles.formBox}>
                <Text style={styles.signUpText}>Register</Text>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Email Address"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.email}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        style={styles.textInput}
                      />
                      {errors.email && (
                        <Text style={styles.errorText}>
                          {errors.email.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="First Name"
                        autoCapitalize="words"
                        keyboardType="default"
                        placeholder="First Name"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.firstName}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        style={styles.textInput}
                      />
                      {errors.firstName && (
                        <Text style={styles.errorText}>
                          {errors.firstName.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Last Name"
                        autoCapitalize="words"
                        keyboardType="default"
                        placeholder="Last Name"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.lastName}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        style={styles.textInput}
                      />
                      {errors.lastName && (
                        <Text style={styles.errorText}>
                          {errors.lastName.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Password"
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.password}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        right={
                          <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            size={20}
                            onPress={() => setShowPassword(!showPassword)}
                          />
                        }
                        style={styles.textInput}
                      />
                      {errors.password && (
                        <Text style={styles.errorText}>
                          {errors.password.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="pin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="PIN"
                        autoCapitalize="none"
                        keyboardType="numeric"
                        placeholder="4-digit PIN"
                        secureTextEntry={!showPin}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.pin}
                        maxLength={4}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        right={
                          <TextInput.Icon
                            icon={showPin ? "eye-off" : "eye"}
                            size={20}
                            onPress={() => setShowPin(!showPin)}
                          />
                        }
                        style={styles.textInput}
                      />
                      {errors.pin && (
                        <Text style={styles.errorText}>
                          {errors.pin.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Phone Number"
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                        placeholder="Phone Number"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.phoneNumber}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        style={styles.textInput}
                      />
                      {errors.phoneNumber && (
                        <Text style={styles.errorText}>
                          {errors.phoneNumber.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  style={[
                    styles.submitButton,
                    (!isValid || isSubmitting) && styles.disabledButton,
                  ]}
                  buttonColor={isValid && !isSubmitting ? "#09A674" : "#A0A0A0"}
                >
                  Create Account
                </Button>
                <TouchableOpacity onPress={() => router.replace("/signIn")}>
                  <Text
                    style={{
                      margin: 10,
                      textAlign: "center",
                      fontSize: 14,
                      color: "#09A674",
                      fontWeight: "bold",
                    }}
                  >
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </AuthPageGuard>
  );
}

const styles = StyleSheet.create({
  body: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    minHeight: "100%",
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 40,
    padding: 30,
    marginTop: 20,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  formBox: {
    backgroundColor: "white",
    borderRadius: 40,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    margin: 30,
  },
  titleText: {
    fontWeight: "700",
    fontSize: 40,
    color: "white",
  },
  titleTextContainer: {
    alignItems: "center",
  },
  subTitleText: {
    fontSize: 17,
    color: "#e7e5e5ff",
  },
  signUpText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
