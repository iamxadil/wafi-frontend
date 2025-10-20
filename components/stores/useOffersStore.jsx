// stores/useOffersStore.js
import { create } from "zustand";

const useOffersStore = create((set) => ({
  currentPage: 1,
  offersLimit: 4, // default items per page

  setCurrentPage: (page) => set({ currentPage: page }),
  setOffersLimit: (limit) => set({ offersLimit: limit }),
}));

export default useOffersStore;
