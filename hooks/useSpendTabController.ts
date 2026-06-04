import { useCategory } from "@/hooks/useCategory";
import { useCompany } from "@/hooks/useCompany";
import { useGetLocks } from "@/hooks/useGetLocks";
import { useOutlet } from "@/hooks/useOutlet";
import { useRecipients } from "@/hooks/useRecipients";
import { useSpend } from "@/hooks/useSpend";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

/** Parse a composite key like "SYSTEM-1" or "CUSTOM-5" */
function parseCompositeKey(key: string | null): {
  rawId: string;
  type: "SYSTEM" | "CUSTOM";
} | null {
  if (!key) return null;
  const idx = key.indexOf("-");
  if (idx === -1) return { rawId: key, type: "SYSTEM" };
  return {
    type: key.substring(0, idx) as "SYSTEM" | "CUSTOM",
    rawId: key.substring(idx + 1),
  };
}

function generateIdempotencyKey(prefix = "spend"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 12);

  return `${prefix}-${timestamp}-${random}`;
}

const schema = yup.object({
  amount: yup
    .number()
    .transform((value, original) =>
      original === "" ? undefined : Number(original),
    )
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be 4 digits")
    .required("PIN is required"),
});

export type SpendTabFormData = yup.InferType<typeof schema>;

export type SpendMode = "direct" | "company" | "recipient";

export function useSpendTabController() {
  const [spendMode, setSpendMode] = useState<SpendMode>("direct");
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
    generateIdempotencyKey(),
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    null,
  );

  const { isCategoryLoading, categories, fetchCategories } = useCategory();
  const { isCompanyLoading, companies, fetchCompanies } = useCompany();
  const {
    isOutletLoading,
    outlets,
    fetchOutlets,
    fetchAllOutlets,
    clearOutlets,
  } = useOutlet();
  const { spendLockedFunds, spendError, spendMessage, isSpending } =
    useSpend();
  const { locksList, fetchLocks } = useGetLocks();
  const {
    recipients,
    isRecipientsLoading,
    fetchRecipients,
    clearRecipients,
    isRedeeming,
    redeemError,
    redeemMessage,
    redeem,
    clearRedeemState,
  } = useRecipients();

  const { control, handleSubmit, formState, reset } = useForm<SpendTabFormData>(
    {
      resolver: yupResolver(schema),
      defaultValues: { amount: undefined as any, pin: "" },
      mode: "onChange",
    },
  );

  // Derive the selected category's type
  const parsed = useMemo(
    () => parseCompositeKey(selectedCategoryId),
    [selectedCategoryId],
  );
  const rawCategoryId = parsed?.rawId ?? null;
  const selectedCategoryType = parsed?.type ?? "SYSTEM";
  const isCustomCategory = selectedCategoryType === "CUSTOM";

  const selectedCategory = useMemo(
    () =>
      categories?.find(
        (c) => `${c.type}-${c.id}` === selectedCategoryId,
      ) || null,
    [selectedCategoryId, categories],
  );

  // When category changes: reset downstream selections and set mode
  useEffect(() => {
    if (!selectedCategoryId || !rawCategoryId) return;
    setSelectedCompany(null);
    setSelectedOutlet(null);
    setSelectedRecipientId(null);
    clearRecipients();
    clearOutlets();

    if (isCustomCategory) {
      // Custom categories only support recipients
      setSpendMode("recipient");
      fetchRecipients(rawCategoryId, "CUSTOM");
    } else {
      // System categories default to direct outlet mode
      setSpendMode("direct");
      fetchAllOutlets(rawCategoryId);
    }
  }, [selectedCategoryId, rawCategoryId, isCustomCategory, clearOutlets, clearRecipients, fetchRecipients, fetchAllOutlets]);

  // When spend mode changes within a system category
  useEffect(() => {
    if (!rawCategoryId || isCustomCategory) return;

    setSelectedOutlet(null);
    setSelectedCompany(null);
    setSelectedRecipientId(null);

    if (spendMode === "direct") {
      clearRecipients();
      fetchAllOutlets(rawCategoryId);
    } else if (spendMode === "company") {
      clearRecipients();
      clearOutlets();
      fetchCompanies(rawCategoryId);
    } else {
      // recipient
      clearOutlets();
      fetchRecipients(rawCategoryId, "SYSTEM");
    }
  }, [spendMode, rawCategoryId, isCustomCategory, fetchAllOutlets, fetchCompanies, clearRecipients, clearOutlets, fetchRecipients]);

  // Fetch outlets by company
  useEffect(() => {
    if (!selectedCompany) return;
    setSelectedOutlet(null);
    fetchOutlets(selectedCompany);
  }, [selectedCompany, fetchOutlets]);

  // Refresh locks on focus
  useFocusEffect(
    useCallback(() => {
      fetchLocks();
    }, [fetchLocks]),
  );

  // Toasts + reset on outlet spend success
  useEffect(() => {
    if (spendError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: spendError,
        position: "top",
        topOffset: 60,
      });
    }

    if (spendMessage) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: spendMessage,
        position: "top",
        topOffset: 60,
      });

      setTimeout(() => {
        setIdempotencyKey(generateIdempotencyKey());
        reset();
        setSelectedCategoryId(null);
        setSelectedCompany(null);
        setSelectedOutlet(null);
        setSelectedRecipientId(null);
        fetchLocks();
      }, 100);
    }
  }, [spendError, spendMessage, reset, fetchLocks]);

  // Toasts + reset on recipient redeem success
  useEffect(() => {
    if (redeemError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: redeemError,
        position: "top",
        topOffset: 60,
      });
      clearRedeemState();
    }

    if (redeemMessage) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: redeemMessage,
        position: "top",
        topOffset: 60,
      });

      setTimeout(() => {
        clearRedeemState();
        reset();
        setSelectedCategoryId(null);
        setSelectedCompany(null);
        setSelectedOutlet(null);
        setSelectedRecipientId(null);
        fetchLocks();
      }, 100);
    }
  }, [redeemError, redeemMessage, reset, fetchLocks, clearRedeemState]);

  const isBillPaymentCategory = useMemo(() => {
    if (!selectedCategory) return false;
    const categoryName = selectedCategory.name.toLowerCase();
    return categoryName.includes("data") || categoryName.includes("airtime");
  }, [selectedCategory]);

  const availableLocked = useMemo(() => {
    if (!selectedCategory) return 0;
    return Number(
      locksList.find(
        (l: any) =>
          String(l.categoryName).toLowerCase() ===
          String(selectedCategory.name).toLowerCase(),
      )?.amount ?? 0,
    );
  }, [locksList, selectedCategory]);

  // Submit for outlet mode (direct or company)
  const submitOutlet = handleSubmit((data) => {
    if (!selectedCategoryId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select a category",
        position: "top",
        topOffset: 60,
      });
      return;
    }
    if (!selectedOutlet) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select an Outlet",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    spendLockedFunds(
      {
        amount: String(data.amount),
        outletId: selectedOutlet,
        pin: data.pin,
      },
      idempotencyKey,
    );
  });

  // Submit for recipient mode
  const submitRecipient = handleSubmit((data) => {
    if (!selectedCategoryId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select a category",
        position: "top",
        topOffset: 60,
      });
      return;
    }
    if (!selectedRecipientId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Select a Recipient",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    redeem({
      recipientId: selectedRecipientId,
      amount: data.amount,
      pin: data.pin,
    });
  });

  const submit = spendMode === "recipient" ? submitRecipient : submitOutlet;

  const handleBillPaymentComplete = () => {
    reset();
    setSelectedCategoryId(null);
    fetchLocks();
  };

  const selectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedCompany(null);
  };

  const selectCompany = (id: string) => {
    setSelectedCompany(id);
    setSelectedOutlet(null);
  };

  const handleModeChange = (mode: SpendMode) => {
    setSpendMode(mode);
    reset();
  };

  return {
    isCategoryLoading,
    categories,
    isCompanyLoading,
    companies,
    isOutletLoading,
    outlets,
    isSpending: isSpending || isRedeeming,

    // selections + setters
    selectedCategoryId,
    selectedCompany,
    selectedOutlet,
    selectCategory,
    selectCompany,
    setSelectedOutlet,

    // spend mode
    spendMode,
    handleModeChange,

    // recipient selections
    selectedRecipientId,
    setSelectedRecipientId,
    recipients,
    isRecipientsLoading,
    isRedeeming,

    // derived
    selectedCategory,
    selectedCategoryType,
    isCustomCategory,
    isBillPaymentCategory,
    availableLocked,
    rawCategoryId,

    // form
    control,
    formState,

    // actions
    submit,
    handleBillPaymentComplete,
  };
}
