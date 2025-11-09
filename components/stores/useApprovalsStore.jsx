// src/stores/useApprovalsStore.jsx
import { create } from "zustand";

const useApprovalsStore = create((set) => ({
  // 🔹 pagination and basic params
  params: { page: 1, limit: 8 },

  setParams: (updates) =>
    set((state) => ({
      params: { ...state.params, ...updates },
    })),

  // 🔹 selection handling
  selected: [],
  setSelected: (selected) => set({ selected }),
  clearSelected: () => set({ selected: [] }),

  // 🔹 optional refresh trigger
  refreshKey: 0,
  triggerRefresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
}));

export default useApprovalsStore;
