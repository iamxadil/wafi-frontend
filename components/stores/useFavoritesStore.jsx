import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GUEST_FAV_KEY = 'guest_favorites';

const useFavoritesStore = create((set, get) => ({
  favorites: [], // array of full product objects

  // -----------------------
  // Load favorites (guest or logged-in)
  // -----------------------
  loadFavorites: async () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      // Guest → localStorage
      const stored = localStorage.getItem(GUEST_FAV_KEY);
      const guestFavs = stored ? JSON.parse(stored) : [];
      set({ favorites: guestFavs });
      return;
    }

    // Logged-in → API
    try {
      const res = await axios.get(`${API_URL}/api/favorites`, { withCredentials: true });
      set({ favorites: res.data.favorites });
    } catch (err) {
      console.error("[FavoritesStore] Failed to load favorites:", err.response?.data?.message || err.message);
    }
  },
  
  initGuestFavorites: () => {
    const stored = localStorage.getItem(GUEST_FAV_KEY);
    if (stored) {
      try {
        const guestFavs = JSON.parse(stored);
        set({ favorites: guestFavs });
      } catch (err) {
        set({ favorites: [] });
      }
    } else {
      set({ favorites: [] });
    }
  },

  // -----------------------
  // Toggle a favorite
  // -----------------------
 toggleFavorite: async (product) => {
  const user = useAuthStore.getState().user;
  const { _id } = product;

  // Guest → localStorage (stays the same)
  if (!user) {
    let stored = localStorage.getItem(GUEST_FAV_KEY);
    let guestFavs = stored ? JSON.parse(stored) : [];

    const exists = guestFavs.some(f => f._id === _id);
    guestFavs = exists
      ? guestFavs.filter(f => f._id !== _id)
      : [...guestFavs, product];

    localStorage.setItem(GUEST_FAV_KEY, JSON.stringify(guestFavs));
    set({ favorites: guestFavs });
    return;
  }

  // Logged-in → API (with optimistic update)
  const currentFavorites = get().favorites;
  const exists = currentFavorites.some(f => f._id === _id);

  // 1️⃣ Optimistic UI update (instant feedback)
  const newFavorites = exists
    ? currentFavorites.filter(f => f._id !== _id)
    : [...currentFavorites, product];
  set({ favorites: newFavorites });

  // 2️⃣ Try syncing with server
  try {
    await axios.patch(
      `${API_URL}/api/favorites/${_id}/toggle`,
      {},
      { withCredentials: true }
    );
    // Optional: re-fetch for accuracy if backend logic differs
    // const res = await axios.get(`${API_URL}/api/favorites`, { withCredentials: true });
    // set({ favorites: res.data.favorites });
  } catch (err) {
    console.error("[FavoritesStore] Toggle failed:", err.response?.data?.message || err.message);
    // 3️⃣ Revert if request fails
    set({ favorites: currentFavorites });
  }
},


mergeOnLogin: async () => {
  const { favorites } = get();
  const guestIds = favorites.map(f => f._id);
  if (!guestIds.length) return []; // nothing to merge

  try {
    const res = await axios.post(
      `${API_URL}/api/favorites/merge`,
      { guestFavorites: guestIds },
      { withCredentials: true }
    );

    set({ favorites: res.data.favorites });       // update store
    localStorage.removeItem(GUEST_FAV_KEY);       // clear guest favorites

    return res.data.favorites;                     // ✅ return the result
  } catch (err) {
    set({ error: err.response?.data?.message || err.message });
    console.error("[FavoritesStore] Merge failed:", err.response?.data?.message || err.message);
    throw err;
  }
},
  // -----------------------
  // Check if product is favorite
  // -----------------------
  isFavorite: (productId) => get().favorites.some(fav => fav._id === productId),
}));

export default useFavoritesStore;
