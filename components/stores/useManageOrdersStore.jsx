import { create } from "zustand";

export const useManageOrdersStore = create((set) => ({
  // ===============================
  // 📦 Selected Orders (for bulk actions)
  // ===============================
  selectedOrders: [],

  // ✅ Toggle single order selection
  selectOrder: (id) =>
    set((state) => ({
      selectedOrders: state.selectedOrders.includes(id)
        ? state.selectedOrders.filter((oid) => oid !== id)
        : [...state.selectedOrders, id],
    })),

  // ✅ Select all visible orders
  selectAllOrders: (ids) => set(() => ({ selectedOrders: ids })),

  // ✅ Deselect all orders
  deselectAllOrders: () => set(() => ({ selectedOrders: [] })),

  // ===============================
  // ⚙️ Table / Query Parameters
  // ===============================
  params: {
    page: 1,
    limit: 20,
    search: "",
    status: "",
    sort: "default",
  },

  // ✅ Update query params safely
  setParams: (updates) =>
    set((state) => ({
      params: {
        ...state.params,
        ...updates,
      },
    })),

  // ===============================
  // 🧾 Active Order (for modal/details)
  // ===============================
  activeOrder: null,

  setActiveOrder: (order) => set({ activeOrder: order }),
  clearActiveOrder: () => set({ activeOrder: null }),
}));
