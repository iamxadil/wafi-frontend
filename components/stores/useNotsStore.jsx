import { create } from "zustand";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const useNotsStore = create ((set, get) => ({
notifications: [],
loading: false,

fetchNotifications: async () => {
  
  set({loading: true});

  try {
  const res = await axios.get(`${API_URL}/api/notifications`, {withCredentials: true})  
  const notifications = res.data;
  const normalized = notifications.map(not => ({...not, id: not._id, date: not.createdAt}));
  set({notifications: normalized, loading: false});
  
  }

  catch(error) {
    console.log(error);
    set({loading: false});
  }
},

deleteNotificationById: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  },

    deleteNotifications: async () => {
    try {
      await axios.delete(`${API_URL}/api/notifications/`, { withCredentials: true });
      set({ notifications: [] }); 
    } catch (error) {
      console.error(error);
    }
  },

}))

export default useNotsStore;