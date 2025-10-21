import { create } from "zustand";
import axios from "axios";

const useArchiveStore = create((set) => ({
  // Pagination & filters
  archiveParams: {
    page: 1,
    limit: 4,
    sort: "",
    search: "",
  },

  // Currently selected order for actions (restore / details)
  selectedOrder: null,

  // ✅ Setters
  setArchiveParams: (params) =>
    set((state) => ({
      archiveParams: { ...state.archiveParams, ...params },
    })),

  setSelectedOrder: (order) =>
    set(() => ({
      selectedOrder: order,
    })),

  clearSelectedOrder: () =>
    set(() => ({
      selectedOrder: null,
    })),

 
}));

export default useArchiveStore;
