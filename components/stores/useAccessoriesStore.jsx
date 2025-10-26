import { create } from 'zustand'

const useAccessoriesStore = create((set)=>({

   accessoriesParams: {
    page: 1,
    limit: 4,
  },

  setAccessoriesParams: (params) =>
    set((state) => ({
      accessoriesParams: { ...state.accessoriesParams, ...params },
    })),

   accessoriesPageParams: {
    page: 1,
    limit: 6,
  },

  setAccessoriesPageParams: (params) =>
    set((state) => ({
      accessoriesPageParams: { ...state.accessoriesPageParams, ...params },
    })),

    searchParam: "",
    setSearchParam: (value) => set({ searchParam: value }),
}))

export default useAccessoriesStore;