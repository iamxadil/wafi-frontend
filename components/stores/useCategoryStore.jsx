// src/components/stores/useCategoryStore.jsx
import { create } from "zustand";

const useCategoryStore = create((set) => ({
  /* ================================================================
     🧱 REGULAR CATEGORY PRODUCTS
  ================================================================ */
  productsParams: { page: 1, limit: 10, category: "", brand: "", search: "" },
  setProductsParams: (params) =>
    set((state) => ({
      productsParams: { ...state.productsParams, ...params },
    })),

  // 🧩 Filters + Sort
  filters: {},
  setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),

  sort: "date-desc",
  setSort: (sortValue) => set({ sort: sortValue }),
  resetFilters: () =>
    set({
      filters: {},
      sort: "date-desc",
    }),

  /* ================================================================
     🔍 UI-ONLY SEARCH
  ================================================================ */
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  clearSearchTerm: () => set({ searchTerm: "" }),

  searchFilters: {},
  setSearchFilters: (filterObj) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filterObj },
    })),

  searchSort: "date-desc",
  setSearchSort: (sortValue) => set({ searchSort: sortValue }),
  resetSearchFilters: () =>
    set({
      searchFilters: {},
      searchSort: "date-desc",
    }),


}));

export default useCategoryStore;
