// ✅ src/components/stores/useComponentsStore.jsx
import { create } from "zustand";

const useComponentsStore = create((set) => ({

  /* ================================================================
     🧱 MAIN PAGE (full components listing)
  ================================================================ */
componentsPageParams: { page: 1, limit: 10 },
  setComponentsPageParams: (params) =>
    set((state) => ({
      componentsPageParams: { ...state.componentsPageParams, ...params },
    })),

  /* ================================================================
     🧱 Hard SSD SECTION
  ================================================================ */
  hardSsdParams: { page: 1, limit: 10 },
    setHardSsdParams: (params) =>
      set((state) => ({
        hardSsdParams: { ...state.hardSsdParams, ...params },
      })),
        
}));

export default useComponentsStore;
