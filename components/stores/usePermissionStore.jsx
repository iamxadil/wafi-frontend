import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";  // import your auth store


const API_BASE = "https://wafi-backend-nlp6.onrender.com/api/permissions";

export const usePermissionStore = create((set, get) => ({
  mods: [],

  // Fetch all moderators
  fetchMods: async () => {
    try {
      const { data } = await axios.get(API_BASE, { withCredentials: true });
      set({ mods: data });
    } catch (error) {
      console.error("Failed to fetch moderators:", error.response?.data || error.message);
    }
  },

  // Update permissions
  updateMods: async (id, permissions) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/${id}`,
        { permissions },
        { withCredentials: true }
      );

      // update local mods array
      set((state) => ({
        mods: state.mods.map((mod) =>
          mod._id === id ? { ...mod, permissions: data.permissions } : mod
        ),
      }));

      // 🔥 always refresh profile if current user is updated
      const { user, profile, setUser } = useAuthStore.getState();
      if (user?._id === id) {
        const freshUser = await profile();
        if (freshUser) {
          setUser(freshUser);
        }
      }

    } catch (error) {
      console.error("Failed to update moderator permissions:", error.response?.data || error.message);
    }
  },
}));

export default usePermissionStore;
