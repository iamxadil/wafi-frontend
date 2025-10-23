import { create } from 'zustand'

const useAllProductsStore = create((set)=>({
    
  searchParam: "",
  setSearchParam: (value) => set({ searchParam: value }),
  clearSearchParam: () => set({ searchParam: "" }),
}))

export default useAllProductsStore;