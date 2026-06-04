import { categoryStore, UnifiedCategory } from "@/lib/categoryStore";
import { getCategories } from "@/services/category";
import { getMyCustomCategories } from "@/services/customCategory";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

export function useCategory() {
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const categoryState = categoryStore();
  const { categories } = categoryState;

  const categoryMutation = useMutation({
    mutationFn: async () => {
      const [systemCats, customCats] = await Promise.all([
        getCategories(),
        getMyCustomCategories().catch(() => []),
      ]);
      return { systemCats, customCats };
    },
    onMutate: () => setIsCategoryLoading(true),
    onSuccess: async ({ systemCats, customCats }) => {
      const { setCategories } = categoryStore.getState();
      const systemList: UnifiedCategory[] = (
        Array.isArray(systemCats) ? systemCats : []
      ).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        type: "SYSTEM" as const,
      }));
      const customList: UnifiedCategory[] = (
        Array.isArray(customCats) ? customCats : []
      ).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        type: "CUSTOM" as const,
      }));
      setCategories([...systemList, ...customList]);
    },
    onError: (error: any) => {
      // Show toast on failure if user has no cached categories
      if ((categories ?? []).length === 0) {
        const isNetwork =
          error?.status === 0 || error?.message?.includes("network") || error?.message?.includes("timeout");
        Toast.show({
          type: "error",
          text1: isNetwork ? "Connection Issue" : "Error",
          text2: isNetwork
            ? "Couldn't load categories. Check your connection."
            : "Failed to load categories. Try again.",
          position: "top",
          topOffset: 60,
        });
      }
    },
    onSettled: () => {
      setIsCategoryLoading(false);
    },
  });

  const fetchCategories = useCallback(() => {
    categoryMutation.mutate();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if ((categoryStore.getState().categories ?? []).length === 0) {
        fetchCategories();
      }
    }, []),
  );

  return {
    isCategoryLoading,
    categories,
    fetchCategories,
  };
}
