// ✅ src/components/stores/useLaptopsStore.jsx
import { create } from "zustand";

const useLaptopsStore = create((set) => ({
  /* ================================================================
     🧱 MAIN PAGE (for full laptop listing)
  ================================================================ */
  laptopPageParams: { page: 1, limit: 8 },

  setLaptopPageParams: (params) =>
    set((state) => ({
      laptopPageParams: { ...state.laptopPageParams, ...params },
    })),

  // 🧩 Main Filters + Sort
  filters: {},
  setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),

  // 🔥 MUST MATCH BACKEND
  sort: "date-desc",
  setSort: (sortValue) => set({ sort: sortValue }),

  resetFilters: () =>
    set({
      filters: {},
      sort: "date-desc", // ← FIXED
    }),

  /* ================================================================
     🔍 LIVE SEARCH (top search dropdown)
  ================================================================ */
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
  clearSearchParam: () => set({ searchParam: "" }),

  searchFilters: {},
  setSearchFilters: (filterObj) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filterObj },
    })),

  // 🔥 MUST MATCH BACKEND
  searchSort: "date-desc",
  setSearchSort: (sortValue) => set({ searchSort: sortValue }),

  resetSearchFilters: () =>
    set({
      searchFilters: {},
      searchSort: "date-desc", // ← FIXED
    }),

  /* ================================================================
     🧩 TOP PRODUCTS SECTION
  ================================================================ */
  topPageParams: { page: 1, limit: 3 },
  setTopPageParams: (params) =>
    set((state) => ({
      topPageParams: { ...state.topPageParams, ...params },
    })),

  /* ================================================================
     🧮 EXTRA: MAIN PAGE PREVIEW (homepage)
  ================================================================ */
  mainPageParams: { page: 1, limit: 4 },
  setMainPageParams: (params) =>
    set((state) => ({
      mainPageParams: { ...state.mainPageParams, ...params },
    })),
}));

export default useLaptopsStore;
