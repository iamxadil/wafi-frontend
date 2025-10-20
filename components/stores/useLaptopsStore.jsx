// src/components/stores/useLaptopsStore.jsx
import { create } from "zustand";

const useLaptopsStore = create((set) => ({
  // 1. Laptop Page Parameters
  laptopPageParams: {
    page: 1,
    limit: 6,
    brands: [],
    minPrice: null,
    maxPrice: null,
    sort: null,
    search: "",
  },

  // 2. Main Page Parameters
  mainPageParams: {
    page: 1,
    limit: 4,
    brands: [],
    minPrice: null,
    maxPrice: null,
    sort: null,
    search: "",
  },

  // 3. Top Laptops Parameters (new)
  topPageParams: {
    page: 1,
    limit: 3,
    brands: [],
    minPrice: null,
    maxPrice: null,
    sort: null,
    search: "",
  },

  // 4. Functions to update parameters
  setLaptopPageParams: (params) =>
    set((state) => ({
      laptopPageParams: { ...state.laptopPageParams, ...params },
    })),

  setMainPageParams: (params) =>
    set((state) => ({
      mainPageParams: { ...state.mainPageParams, ...params },
    })),

  setTopPageParams: (params) =>
    set((state) => ({
      topPageParams: { ...state.topPageParams, ...params },
    })),

  // 5. UI-only Search State (for dropdown)
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
  clearSearchParam: () => set({ searchParam: "" }),
}));

export default useLaptopsStore;
