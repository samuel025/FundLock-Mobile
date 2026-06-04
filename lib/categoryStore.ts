import { create } from "zustand";

export interface UnifiedCategory {
  id: string;
  name: string;
  type: "SYSTEM" | "CUSTOM";
}

export interface CategoryState {
  categories: UnifiedCategory[] | null;
  isLoadingCategory: boolean;
  setCategories: (categories: UnifiedCategory[] | null) => void;
  setIsLoadingCategory: (loading: boolean) => void;
}

export const categoryStore = create<CategoryState>((set) => ({
  categories: null,
  setCategories: (categories) => set({ categories: categories }),
  isLoadingCategory: false,
  setIsLoadingCategory: (loading) => set({ isLoadingCategory: loading }),
}));
