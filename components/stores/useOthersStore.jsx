// src/components/stores/useOthersStore.jsx
import { create } from "zustand";

const useOthersStore = create((set) => ({
  /* =============================================================
     🧩 1️⃣ General "Others" Query Params (for homepage / small sections)
  ============================================================= */
  othersParams: { page: 1, limit: 4 },
  setOthersParams: (params) =>
    set((state) => ({
      othersParams: { ...state.othersParams, ...params },
    })),

  /* =============================================================
     🧩 2️⃣ Main Category Page Params (like CatOthers.jsx)
  ============================================================= */
  othersPageParams: { page: 1, limit: 8 },
  setOthersPageParams: (params) =>
    set((state) => ({
      othersPageParams: { ...state.othersPageParams, ...params },
    })),

  /* =============================================================
     🧩 3️⃣ Filters (for category grid)
  ============================================================= */
  filters: {},
  setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),
  resetFilters: () => set({ filters: {} }),

  /* =============================================================
     🧩 4️⃣ Sorting
  ============================================================= */
  sort: "date-desc", // same default as backend
  setSort: (sortValue) => set({ sort: sortValue }),

  /* =============================================================
     🧩 5️⃣ Search Section
  ============================================================= */
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),

  /* === Filters specific to search dropdown === */
  searchFilters: {},
  setSearchFilters: (filterObj) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filterObj },
    })),
  resetSearchFilters: () => set({ searchFilters: {} }),

  /* === Sorting for search results === */
  searchSort: "date-desc",
  setSearchSort: (sortValue) => set({ searchSort: sortValue }),
}));

export default useOthersStore;
