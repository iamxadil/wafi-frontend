// ✅ src/components/stores/useComponentsStore.jsx
import { create } from "zustand";

const useComponentsStore = create((set) => ({

  /* ================================================================
     🧱 MAIN PAGE (full components listing)
  ================================================================ */
  componentsPageParams: { page: 1, limit: 8 },
  setComponentsPageParams: (params) =>
    set((state) => ({
      componentsPageParams: { ...state.componentsPageParams, ...params },
    })),

  /* ================================================================
     🔍 FILTERS + SORT (matches backend)
  ================================================================ */
  filters: {
    brand: "",
    tags: "",
    minPrice: "",
    maxPrice: "",
    inStock: undefined,
    isOffer: undefined,
    isTopProduct: undefined,
  },

  setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),

  sort: "date-desc",
  setSort: (sortValue) => set({ sort: sortValue }),

  resetFilters: () =>
    set({
      filters: {
        brand: "",
        tags: "",
        minPrice: "",
        maxPrice: "",
        inStock: undefined,
        isOffer: undefined,
        isTopProduct: undefined,
      },
      sort: "date-desc",
    }),

  /* ================================================================
     🔎 LIVE SEARCH (top search bar)
  ================================================================ */
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
  clearSearchParam: () => set({ searchParam: "" }),

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

  /* ================================================================
     🧮 EXTRA: MAIN PAGE PREVIEW (homepage section)
  ================================================================ */
  mainPageParams: { page: 1, limit: 4 },
  setMainPageParams: (params) =>
    set((state) => ({
      mainPageParams: { ...state.mainPageParams, ...params },
    })),

    hardSsdParams: { page: 1, limit: 8 },
    setHardSsdParams: (params) =>
      set((state) => ({
        hardSsdParams: { ...state.hardSsdParams, ...params },
      })),
        
}));

export default useComponentsStore;
