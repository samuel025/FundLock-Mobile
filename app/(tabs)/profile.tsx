import { PinGuard } from "@/components/PinGuard";
import { AccountActions } from "@/components/profileComponents/AccountActions";
import { DepositModal } from "@/components/profileComponents/DepositModal";
import { ProfileHeader } from "@/components/profileComponents/ProfileHeader";
import { VirtualAccountModal } from "@/components/profileComponents/VirtualAccountModal";
import { WithdrawModal } from "@/components/profileComponents/WithdrawModal";
import { useToastConfig } from "@/config/toastConfig";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { postDeposit } from "@/services/deposit";
import {
  createKoraVirtualAccount,
  getKoraVirtualAccountDetails,
} from "@/services/kora";
import { postWithdraw } from "@/services/withdraw";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const depositSchema = yup.object({
  amount: yup
    .number()
    .transform((v, o) => (o === "" ? undefined : Number(o)))
    .typeError("Enter a valid amount")
    .positive()
    .required(),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required(),
});

const withdrawSchema = depositSchema;

type DepositForm = yup.InferType<typeof depositSchema>;

export default function Profile() {
  const { openDeposit } = useLocalSearchParams();
  const router = useRouter();
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [virtualModal, setVirtualModal] = useState(false);
  const [depositLink, setDepositLink] = useState<string | null>(null);
  const [virtualAccount, setVirtualAccount] = useState<{
    accountNumber: string;
    bank: string;
  } | null>(null);
  const [virtualLoading, setVirtualLoading] = useState(false);
  const [creatingVirtual, setCreatingVirtual] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const toastConfig = useToastConfig();
  const [refreshKey, setRefreshKey] = useState(0);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const user = useAuthStore((state) => state.user);
  const { balance } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const userInitials = useMemo(
    () =>
      `${user?.firstName?.charAt(0) ?? "U"}${
        user?.lastName?.charAt(0) ?? ""
      }`.toUpperCase(),
    []
  );

  const scrollRef = React.useRef<ScrollView | null>(null);

  const {
    control: depositControl,
    handleSubmit: handleDepositSubmit,
    formState: depositState,
    reset: resetDeposit,
  } = useForm<DepositForm>({
    resolver: yupResolver(depositSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });
  const {
    control: withdrawControl,
    handleSubmit: handleWithdrawSubmit,
    formState: withdrawState,
    reset: resetWithdraw,
  } = useForm<DepositForm>({
    resolver: yupResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });

  const generateDepositLink = async (data: DepositForm) => {
    setIsGenerating(true);
    try {
      const res = await postDeposit({
        amount: String(data.amount),
        pin: data.pin,
      });
      setDepositLink(res.authorization_url);
      resetDeposit(); // Reset form after generating link
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to generate deposit link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWithdraw = async (data: DepositForm) => {
    setIsWithdrawing(true);
    try {
      const response = await postWithdraw({
        amount: String(data.amount),
        pin: data.pin,
      });

      setWithdrawModal(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.message,
        position: "top",
        topOffset: 60,
      });
      resetWithdraw();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message ?? "Failed to process withdrawal",
        position: "top",
        topOffset: 60,
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setVirtualLoading(true);
      try {
        const details = await getKoraVirtualAccountDetails();
        if (mounted && details?.account_number) {
          setVirtualAccount({
            accountNumber: details.account_number,
            bank: details.bank_name,
          });
        }
      } catch (err) {
        console.log("getVirtualAccountDetails:", err);
      } finally {
        if (mounted) setVirtualLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateVirtual = () => {
    setVirtualModal(true);
  };

  const createVirtual = async () => {
    setCreatingVirtual(true);
    try {
      await createKoraVirtualAccount();
      const details = await getKoraVirtualAccountDetails();
      if (details?.account_number) {
        setVirtualAccount({
          accountNumber: details.account_number,
          bank: details.bank_name,
        });
        setRefreshKey((prev) => prev + 1);
        Alert.alert("Success", "Virtual account created successfully!");
      }
      setCreatingVirtual(false);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to create virtual account");
      setCreatingVirtual(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await authActions.signOut();
      router.replace("/signIn");
    } catch (err) {
      console.error("Sign out failed:", err);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  React.useEffect(() => {
    if (openDeposit === "1") {
      setDepositModal(true);
      router.replace("/profile");
    }
  }, [openDeposit, router]);

  if (!fontsLoaded) return null;

  const disabledStyle = {
    opacity: 0.45,
    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : theme.colors.border,
    borderColor: isDark ? "rgba(255,255,255,0.15)" : theme.colors.border,
    borderWidth: 1,
  };

  return (
    <PinGuard>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.content,
            {
              backgroundColor: "transparent",
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProfileHeader
            initials={userInitials}
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
          />

          <AccountActions
            onDeposit={() => setDepositModal(true)}
            onWithdraw={() => setWithdrawModal(true)}
            onVirtual={handleCreateVirtual}
            onSignOut={handleSignOut}
            virtualExists={!!virtualAccount}
            hasBvn={user?.bvn}
            hasBankDetails={user?.bankDetails}
            disabledStyle={disabledStyle as any}
          />

          <DepositModal
            visible={depositModal}
            onClose={() => {
              setDepositModal(false);
              setDepositLink(null);
            }}
            control={depositControl}
            handleSubmit={handleDepositSubmit}
            onGenerate={generateDepositLink}
            isGenerating={isGenerating}
            depositLink={depositLink}
            formState={depositState} // Pass formState to modal
          />

          <WithdrawModal
            visible={withdrawModal}
            onClose={() => setWithdrawModal(false)}
            control={withdrawControl}
            handleSubmit={handleWithdrawSubmit}
            onWithdraw={handleWithdraw}
            isWithdrawing={isWithdrawing}
            availableBalance={Number(balance || "0")} // Convert string to number
            formState={withdrawState}
          />

          <VirtualAccountModal
            key={`virtual-modal-${refreshKey}`}
            visible={virtualModal}
            onClose={() => setVirtualModal(false)}
            virtualAccount={virtualAccount}
            onCreate={createVirtual}
            isLoading={virtualLoading}
            isCreating={creatingVirtual}
          />

          <Text style={[styles.version, { color: theme.colors.muted }]}>
            FundLock v1.0.0
          </Text>
        </ScrollView>
        <Toast config={toastConfig} />
      </LinearGradient>
    </PinGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 8,
    }),
    paddingBottom: 40,
  },
  version: {
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    marginTop: 28,
  },
});
