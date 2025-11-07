// ✅ src/components/stores/useLaptopsStore.jsx
import { create } from "zustand";

const useLaptopsStore = create((set) => ({
  /* ================================================================
     🧱 MAIN PAGE (for full laptop listing)
  ================================================================ */
  laptopPageParams: { page: 1, limit: 6 },

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

  sort: "newest",
  setSort: (sortValue) => set({ sort: sortValue }),

  resetFilters: () => set({ filters: {}, sort: "newest" }),

  /* ================================================================
     🔍 LIVE SEARCH (for top search dropdown)
  ================================================================ */
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
  clearSearchParam: () => set({ searchParam: "" }),

  searchFilters: {},
  setSearchFilters: (filterObj) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filterObj },
    })),

  searchSort: "newest",
  setSearchSort: (sortValue) => set({ searchSort: sortValue }),

  resetSearchFilters: () => set({ searchFilters: {}, searchSort: "newest" }),

  /* ================================================================
     🧩 TOP PRODUCTS SECTION (optional — e.g. featured laptops)
  ================================================================ */
  topPageParams: { page: 1, limit: 3 },
  setTopPageParams: (params) =>
    set((state) => ({
      topPageParams: { ...state.topPageParams, ...params },
    })),

  /* ================================================================
     🧮 EXTRA: MAIN PAGE (e.g. homepage laptop previews)
  ================================================================ */
  mainPageParams: { page: 1, limit: 6 },
  setMainPageParams: (params) =>
    set((state) => ({
      mainPageParams: { ...state.mainPageParams, ...params },
    })),
}));

export default useLaptopsStore;
