import { create } from "zustand";

export const useManageUsersStore = create((set) => ({
  /* ============================================================
     📦 Selected Users (for bulk actions)
  ============================================================ */
  selectedUsers: [],

  // ✅ Toggle single user selection
  selectUser: (id) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.includes(id)
        ? state.selectedUsers.filter((uid) => uid !== id)
        : [...state.selectedUsers, id],
    })),

  // ✅ Select all visible users
  selectAllUsers: (ids) => set(() => ({ selectedUsers: ids })),

  // ✅ Deselect all users
  deselectAllUsers: () => set(() => ({ selectedUsers: [] })),

  /* ============================================================
     ⚙️ Table / Query Parameters
  ============================================================ */
  params: {
    page: 1,
    limit: 20,
    search: "",
    active: "", // can be true/false/"" (for All)
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

  /* ============================================================
     👤 Active User (for details modal)
  ============================================================ */
  activeUser: null,

  setActiveUser: (user) => set({ activeUser: user }),
  clearActiveUser: () => set({ activeUser: null }),
}));
