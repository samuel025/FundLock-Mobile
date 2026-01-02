import { useCategory } from "@/hooks/useCategory";
import { useCompany } from "@/hooks/useCompany";
import { useGetLocks } from "@/hooks/useGetLocks";
import { useOutlet } from "@/hooks/useOutlet";
import { useSpend } from "@/hooks/useSpend";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";

const schema = yup.object({
  amount: yup
    .number()
    .transform((value, original) =>
      original === "" ? undefined : Number(original)
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

export function useSpendTabController() {
  const [allowDirectOutlet, setAllowDirectOutlet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  const { isCategoryLoading, categories } = useCategory();
  const { isCompanyLoading, companies, fetchCompanies } = useCompany();
  const {
    isOutletLoading,
    outlets,
    fetchOutlets,
    fetchAllOutlets,
    clearOutlets,
  } = useOutlet();
  const { spendLockedFunds, spendError, spendMessage, isSpending } = useSpend();
  const { locksList, fetchLocks } = useGetLocks();

  const { control, handleSubmit, formState, reset } = useForm<SpendTabFormData>(
    {
      resolver: yupResolver(schema),
      defaultValues: { amount: undefined as any, pin: "" },
      mode: "onChange",
    }
  );

  // Fetch companies when category changes
  useEffect(() => {
    if (!selectedCategoryId) return;
    setSelectedCompany(null);
    setSelectedOutlet(null);
    fetchCompanies(selectedCategoryId);
    clearOutlets();
  }, [selectedCategoryId, fetchCompanies, clearOutlets]);

  // Fetch outlets directly (all outlets) when mode enabled
  useEffect(() => {
    if (!allowDirectOutlet) return;
    setSelectedCompany(null);
    setSelectedOutlet(null);
    fetchAllOutlets(selectedCategoryId ?? "");
  }, [allowDirectOutlet, fetchAllOutlets, selectedCategoryId]);

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
    }, [fetchLocks])
  );

  // Toasts + reset on success
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
        reset();
        setSelectedCategoryId(null);
        setSelectedCompany(null);
        setSelectedOutlet(null);
        fetchLocks();
      }, 100);
    }
  }, [spendError, spendMessage, reset, fetchLocks]);

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId, categories]
  );

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
          String(selectedCategory.name).toLowerCase()
      )?.amount ?? 0
    );
  }, [locksList, selectedCategory]);

  const submit = handleSubmit((data) => {
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

    spendLockedFunds({
      amount: String(data.amount),
      outletId: selectedOutlet,
      pin: data.pin,
    });
  });

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

  return {
    isCategoryLoading,
    categories,
    isCompanyLoading,
    companies,
    isOutletLoading,
    outlets,
    isSpending,

    // selections + setters
    allowDirectOutlet,
    setAllowDirectOutlet,
    selectedCategoryId,
    selectedCompany,
    selectedOutlet,
    selectCategory,
    selectCompany,
    setSelectedOutlet,

    // derived
    selectedCategory,
    isBillPaymentCategory,
    availableLocked,

    // form
    control,
    formState,

    // actions
    submit,
    handleBillPaymentComplete,
  };
}
