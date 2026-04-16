import { create } from "zustand";

const useAccessoriesStore = create((set) => ({
  /* ================================================================
      🧱 MAIN PAGE (Accessories Listing)
  ================================================================ */
  accessoriesPageParams: { page: 1, limit: 10 },
  setAccessoriesPageParams: (params) =>
    set((state) => ({
      accessoriesPageParams: {
        ...state.accessoriesPageParams,
        ...params,
      },
    })),

  // Filters (brand, tags, priceRange...)
  filters: {},
  setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),

  // Sorting — backend-compatible
  sort: "date-desc", // ⭐ backend default → enables priority
  setSort: (sortValue) => set({ sort: sortValue }),

  resetFilters: () =>
    set({
      filters: {},
      sort: "date-desc", // reset to backend default
    }),

  /* ================================================================
      🔍 LIVE SEARCH (Instant Dropdown)
  ================================================================ */
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),

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
      🎮 GAMING ACCESSORIES SECTION
  ================================================================ */
  gamingAccessories: { page: 1, limit: 10 },
  setGamingAccessories: (params) =>
    set((state) => ({
      gamingAccessories: {
        ...state.gamingAccessories,
        ...params,
      },
    })),

  gamingFilters: {}, // dynamic filters for gaming category
}));

export default useAccessoriesStore;
