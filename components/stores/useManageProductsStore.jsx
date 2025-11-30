import { create } from "zustand";

export const useManageProductsStore = create((set) => ({
  /* =======================================================
     🟦 SELECTED PRODUCTS
  ======================================================= */
  selectedProducts: [],

  selectProduct: (id) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.includes(id)
        ? state.selectedProducts.filter((pid) => pid !== id)
        : [...state.selectedProducts, id],
    })),

  selectAllProducts: (ids) =>
    set(() => ({
      selectedProducts: ids,
    })),

  deselectAllProducts: () =>
    set(() => ({
      selectedProducts: [],
    })),

  deleteProduct: (id) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((pid) => pid !== id),
    })),

  /* =======================================================
     🔧 PARAMS USED IN ADMIN PAGE (backend compatible)
  ======================================================= */
  params: {
    page: 1,
    limit: 20,

    // 🔍 Searching
    search: "",

    // 🔢 Sorting
    sort: "date-desc", // backend default (priority mode)

    // 🏷 Category filter
    category: undefined,

    // 📦 Stock / Status filters
    inStock: undefined,
    lowStock: undefined,

    // 🔥 Special filters
    isOffer: undefined,
    isTopProduct: undefined,
  },

  /* =======================================================
     🔄 UPDATE PARAMS SAFELY
  ======================================================= */
  setParams: (updates) =>
    set((state) => ({
      params: {
        ...state.params,
        ...updates,
      },
    })),

}));
