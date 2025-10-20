import { create } from "zustand";

const useCategoryStore = create((set) => ({
  // 1️⃣ Regular products
  productsParams: { page: 1, limit: 6, category: "", brand: "", search: "" },
  setProductsParams: (params) => set(state => ({
    productsParams: { ...state.productsParams, ...params }
  })),

  // 2️⃣ Offers
  offersParams: { page: 1, limit: 3, category: "", brand: "", search: "" },
  setOffersParams: (params) => set(state => ({
    offersParams: { ...state.offersParams, ...params }
  })),

  // 3️⃣ UI-only search
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  clearSearchTerm: () => set({ searchTerm: "" }),
}));

export default useCategoryStore;