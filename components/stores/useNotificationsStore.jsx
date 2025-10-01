// src/stores/useNotificationsStore.jsx
import { create } from "zustand";
import axios from "axios";

const API_URL = "https://wafi-backend-nlp6.onrender.com";

const useNotificationsStore = create((set, get) => ({
  notifications: [],   // all notifications (fetched + live)
  loading: false,
  error: null,

  // Fetch notifications from backend
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/api/notifications`);
   
      const withShown = res.data.map((n) => ({ ...n, shown: false }));
      set({ notifications: withShown, loading: false });
    } catch (err) {
      set({ error: err.message, losading: false });
    }
  },

  // Add live notification (from socket)
  addNotification: (notification) => {
    const current = get().notifications;
    // Ensure "shown" is false for new live notifications
    set({ notifications: [{ ...notification, shown: false }, ...current] });
  },

  // Mark notification as read (UI-level)
  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    );
    set({ notifications: updated });
  },

  // Mark notification as shown for toast (prevents duplicate toasts)
  markAsShown: (id) => {
    const updated = get().notifications.map((n) =>
      n._id === id ? { ...n, shown: true } : n
    );
    set({ notifications: updated });
  },

  // Clear all notifications
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationsStore;
