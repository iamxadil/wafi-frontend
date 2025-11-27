import { create } from "zustand";

export const useManageProductsStore = create((set) => ({
  // Store
  selectedProducts: [],

  // ✅ Toggle single product
  selectProduct: (id) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.includes(id)
        ? state.selectedProducts.filter((pid) => pid !== id)
        : [...state.selectedProducts, id],
    })),

  // ✅ Select all
  selectAllProducts: (ids) => set(() => ({ selectedProducts: ids })),

  // ✅ Deselect all
  deselectAllProducts: () => set(() => ({ selectedProducts: [] })),

  // ✅ Delete single product
  deleteProduct: (id) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((pid) => pid !== id),
    })),

  // ✅ Params (pagination, filters, etc.)
  params: {
    page: 1,
    limit: 20,
  },

  // ✅ Update params safely
  setParams: (updates) =>
    set((state) => ({
      params: {
        ...state.params,
        ...updates,
      },
    })),

}));