import { create } from "zustand";

const useOthersStore = create((set) => ({
  // === Query params for useOthersQuery in general listings ===
  othersParams: {
    page: 1,
    limit: 4,
  },

  setOthersParams: (params) =>
    set((state) => ({
      othersParams: { ...state.othersParams, ...params },
    })),

  // === Params for category page (like CatOthers.jsx) ===
  othersPageParams: {
    page: 1,
    limit: 6,
  },

  setOthersPageParams: (params) =>
    set((state) => ({
      othersPageParams: { ...state.othersPageParams, ...params },
    })),

  // === Search input (used in SearchDropdown) ===
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
}));

export default useOthersStore;
