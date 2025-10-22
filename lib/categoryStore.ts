import { Categories } from "@/services/category";
import { create } from "zustand";

export interface CategoryState {
  categories: Categories[] | null;
  isLoadingCategory: boolean;
  setCategories: (categories: Categories[] | null) => void;
  setIsLoadingCategory: (loading: boolean) => void;
}

export const categoryStore = create<CategoryState>((set) => ({
  categories: null,
  setCategories: (categories) => set({ categories: categories }),
  isLoadingCategory: false,
  setIsLoadingCategory: (loading) => set({ isLoadingCategory: loading }),
}));
