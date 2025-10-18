import { Categories, getCategories } from "@/services/category";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

export function useCategory() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  const hasFetchedRef = useRef(false);

  const categoryMutation = useMutation({
    mutationFn: getCategories,
    onMutate: () => {
      setIsCategoryLoading(true);
    },
    onSuccess: async (data) => {
      //explain
      const list = Array.isArray(data) ? data : [];
      setCategories(list.map((c: any) => ({ id: String(c.id), name: c.name })));
      setIsCategoryLoading(false);
    },
    onError: (error) => {
      console.error("failed to fetch categories", error);
      setIsCategoryLoading(false);
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
      fetchCategories();
    }, [])
  );

  return {
    isCategoryLoading,
    categories,
    fetchCategories,
  };
}
