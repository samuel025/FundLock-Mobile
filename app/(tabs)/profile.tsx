import { AccountActions } from "@/components/profileComponents/AccountActions";
import { DepositModal } from "@/components/profileComponents/DepositModal";
import { ProfileHeader } from "@/components/profileComponents/ProfileHeader";
import { VirtualAccountModal } from "@/components/profileComponents/VirtualAccountModal";
import { WithdrawModal } from "@/components/profileComponents/WithdrawModal";
import { authActions } from "@/lib/authContext"; // <-- added import
import { useAuthStore } from "@/lib/useAuthStore";
import { postDeposit } from "@/services/deposit";
import {
  createRemitaVirtualAccount,
  getVirtualAccountDetails,
} from "@/services/remita";
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
import { Alert, ScrollView, StyleSheet, Text, Platform } from "react-native";
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

  const user = useAuthStore((state) => state.user);

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
    [],
  );

  const {
    control: depositControl,
    handleSubmit: handleDepositSubmit,
    formState: depositState,
  } = useForm<DepositForm>({
    resolver: yupResolver(depositSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });
  const {
    control: withdrawControl,
    handleSubmit: handleWithdrawSubmit,
    formState: withdrawState,
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
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to generate deposit link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWithdraw = (data: DepositForm) => {
    setWithdrawModal(false);
    Alert.alert(
      "Withdrawal requested",
      `₦${data.amount?.toLocaleString()} withdrawal initiated`,
    );
  };

  // fetch existing virtual account on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setVirtualLoading(true);
      try {
        const details = await getVirtualAccountDetails();
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
      const res = await createRemitaVirtualAccount();
      setVirtualAccount({
        accountNumber: res.account_number,
        bank: res.bank_name,
      });
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to create virtual account");
    } finally {
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

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
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
        />

        <WithdrawModal
          visible={withdrawModal}
          onClose={() => setWithdrawModal(false)}
          control={withdrawControl}
          handleSubmit={handleWithdrawSubmit}
          onWithdraw={handleWithdraw}
        />

        <VirtualAccountModal
          visible={virtualModal}
          onClose={() => setVirtualModal(false)}
          virtualAccount={virtualAccount}
          onCreate={createVirtual}
          isLoading={virtualLoading}
          isCreating={creatingVirtual}
        />

        <Text style={styles.version}>FundLock v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: 16,
    }),
    paddingBottom: 40,
  },
  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
    marginTop: 28,
  },
});
