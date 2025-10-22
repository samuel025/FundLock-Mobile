import { categoryStore } from "@/lib/categoryStore";
import { getCategories } from "@/services/category";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useCategory() {
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const categoryState = categoryStore();
  const { categories } = categoryState;

  const categoryMutation = useMutation({
    mutationFn: getCategories,
    onMutate: () => setIsCategoryLoading(true),
    onSuccess: async (data) => {
      const { setCategories } = categoryStore.getState();
      const list = Array.isArray(data) ? data : [];
      setCategories(list.map((c: any) => ({ id: String(c.id), name: c.name })));
    },
    onError: (error) => {
      console.error("Failed to fetch categories", error);
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
    }, [])
  );

  return {
    isCategoryLoading,
    categories,
    fetchCategories,
  };
}
