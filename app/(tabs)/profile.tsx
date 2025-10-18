import { AccountActions } from "@/components/profileComponents/AccountActions";
import { DepositModal } from "@/components/profileComponents/DepositModal";
import { ProfileHeader } from "@/components/profileComponents/ProfileHeader";
import { VirtualAccountModal } from "@/components/profileComponents/VirtualAccountModal";
import { WithdrawModal } from "@/components/profileComponents/WithdrawModal";
import { useAuthStore } from "@/lib/useAuthStore";
import { postDeposit } from "@/services/deposit";
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
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
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
    []
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
      console.error("generateDepositLink error", err);
      Alert.alert("Error", err?.message ?? "Failed to generate deposit link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWithdraw = (data: DepositForm) => {
    setWithdrawModal(false);
    Alert.alert(
      "Withdrawal requested",
      `₦${data.amount?.toLocaleString()} withdrawal initiated`
    );
  };

  const handleCreateVirtual = () => {
    if (virtualAccount) {
      setVirtualModal(true);
      return;
    }
    const acct = {
      accountNumber: String(1000000000 + Math.floor(Math.random() * 900000000)),
      bank: "Sample Bank",
    };
    setVirtualAccount(acct);
    setVirtualModal(true);
  };

  // if navigated with ?openDeposit=1 open the deposit modal and remove the param
  React.useEffect(() => {
    if (openDeposit === "1") {
      setDepositModal(true);
      // remove query param so refreshing/profile visits won't reopen modal
      // replace keeps us on the same screen but clears the query
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
          virtualExists={!!virtualAccount}
        />

        <DepositModal
          visible={depositModal}
          onClose={() => {
            setDepositModal(false);
            setDepositLink(null); // clear link when modal closed
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
          onCreate={handleCreateVirtual}
        />

        <Text style={styles.version}>FundLock v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
    marginTop: 28,
  },
});
