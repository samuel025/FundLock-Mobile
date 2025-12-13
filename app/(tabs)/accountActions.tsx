import { PinGuard } from "@/components/PinGuard";
import { AccountActions } from "@/components/profileComponents/AccountActions";
import { ProfileHeader } from "@/components/profileComponents/ProfileHeader";
import { VirtualAccountModal } from "@/components/profileComponents/VirtualAccountModal";
import { WithdrawModal } from "@/components/profileComponents/WithdrawModal";
import { useToastConfig } from "@/config/toastConfig";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  createKoraVirtualAccount,
  getKoraVirtualAccountDetails,
} from "@/services/kora";
import { postWithdraw } from "@/services/withdraw";
import { useTheme } from "@/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

const amountPinSchema = yup.object({
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

type AmountPinForm = yup.InferType<typeof amountPinSchema>;

export default function Profile() {
  const router = useRouter();
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [virtualModal, setVirtualModal] = useState(false);

  const [virtualAccount, setVirtualAccount] = useState<{
    accountNumber: string;
    bank: string;
  } | null>(null);

  const [virtualLoading, setVirtualLoading] = useState(false);
  const [creatingVirtual, setCreatingVirtual] = useState(false);
  const toastConfig = useToastConfig();
  const [refreshKey, setRefreshKey] = useState(0);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const user = useAuthStore((state) => state.user);
  const { balance } = useWallet();

  const userInitials = useMemo(
    () =>
      `${user?.firstName?.charAt(0) ?? "U"}${
        user?.lastName?.charAt(0) ?? ""
      }`.toUpperCase(),
    []
  );

  const scrollRef = React.useRef<ScrollView | null>(null);

  const {
    control: withdrawControl,
    handleSubmit: handleWithdrawSubmit,
    formState: withdrawState,
    reset: resetWithdraw,
  } = useForm<AmountPinForm>({
    resolver: yupResolver(amountPinSchema),
    mode: "onChange",
    defaultValues: { amount: undefined as any, pin: "" },
  });

  const handleWithdraw = async (data: AmountPinForm) => {
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

  const handleOpenFundingDetails = () => {
    if (!user?.bvn) {
      Alert.alert(
        "BVN required",
        "To deposit via bank transfer, please add your BVN first.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add BVN", onPress: () => router.push("/addBvn") },
        ]
      );
      return;
    }
    setVirtualModal(true);
  };

  const createVirtual = async () => {
    if (!user?.bvn) {
      Alert.alert(
        "BVN required",
        "Please add your BVN before creating bank transfer details."
      );
      router.push("/addBvn");
      return;
    }

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
        Alert.alert("Success", "Bank transfer details created successfully!");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message ?? "Failed to create bank transfer details"
      );
    } finally {
      setCreatingVirtual(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authActions.signOut();
      router.replace("/signIn");
    } catch (err) {
      console.error("Sign out failed:", err);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

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
            { backgroundColor: "transparent" },
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
            onViewProfileDetails={() => router.push("/profileDetails")}
            onWithdraw={() => setWithdrawModal(true)}
            onFundingDetails={handleOpenFundingDetails}
            onSignOut={handleSignOut}
            fundingDetailsExist={!!virtualAccount}
            hasBvn={user?.bvn}
            hasBankDetails={user?.bankDetails}
            disabledStyle={disabledStyle as any}
          />

          <WithdrawModal
            visible={withdrawModal}
            onClose={() => setWithdrawModal(false)}
            control={withdrawControl}
            handleSubmit={handleWithdrawSubmit}
            onWithdraw={handleWithdraw}
            isWithdrawing={isWithdrawing}
            availableBalance={Number(balance || "0")}
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
            BlockIT v1.0.0
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
