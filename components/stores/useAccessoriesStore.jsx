import { create } from 'zustand'

const useAccessoriesStore = create((set)=>({

   accessoriesParams: { page: 1,limit: 4,},

  setAccessoriesParams: (params) =>
    set((state) => ({
      accessoriesParams: { ...state.accessoriesParams, ...params },
    })),




    //Main Page
    accessoriesPageParams: { page: 1, limit: 8,}, 
    setAccessoriesPageParams: (params) =>
      set((state) => ({
        accessoriesPageParams: { ...state.accessoriesPageParams, ...params },
      })),

    //Main Page Filter
    filters: {},
    setFilters: (filterObj) =>
    set((state) => ({
      filters: { ...state.filters, ...filterObj },
    })),

    //Main Page Sort
    sort: "newest",
    setSort: (sortValue) => set({ sort: sortValue }),


    //Reset
    resetFilters: () => set({ filters: {} }),               // ✅ optional



    //Search
    searchParam: "",
    setSearchParam: (value) => set({ searchParam: value }),

    //Search Filters
    searchFilters: {},
    setSearchFilters: (filterObj) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filterObj },
    })),

    //Search Sorts
    searchSort: "newest",
    setSearchSort: (sortValue) => set({ searchSort: sortValue }),

    //Reset
    resetSearchFilters: () => set({ searchFilters: {} }),   



     //Gaming Accessories
    gamingAccessories: { page: 1, limit: 8,}, 
    setGamingAccessories: (params) =>
      set((state) => ({
        gamingAccessories: { ...state.gamingAccessories, ...params },
      })),
    gamingFilters: {},


    
}))

export default useAccessoriesStore;