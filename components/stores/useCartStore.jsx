import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./useAuthStore.jsx";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


// --- Helpers ---
const getGuestCart = () => {
  const saved = localStorage.getItem("cart");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};



// --- Store ---
const useCartStore = create((set, get) => ({
  cart: getGuestCart(),
  cartLoading: false,
  hydrated: false,

  totalItems: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
  totalPrice: () => get().cart.reduce((sum, i) => sum + i.qty * i.finalPrice, 0),

  // Initialize cart
  initCart: async () => {
    set({ cartLoading: true });
    const { user } = useAuthStore.getState();
    try {
      if (user) {
        await get().syncCartWithServer();
      } else {
        set({ cart: getGuestCart() });
      }
    } catch (err) {
      console.error("Failed to init cart:", err);
    } finally {
        set({ cartLoading: false, hydrated: true }); 
      }

  },

  // Sync logged-in cart with server
  syncCartWithServer: async (mergeOnce = false) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data } = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
      const serverItems = data.items || [];

   const normalizedServer = serverItems.map(i => {
        const discount = i.discountPrice && i.discountPrice > 0 ? i.discountPrice : 0;
        const finalPrice = i.price - discount;

        return {
          _id: i._id,
          name: i.name || "Unknown",
          price: i.price || 0,
          discountPrice: discount,
          finalPrice,
          countInStock: i.countInStock || 0,
          images: i.images || [],
          qty: i.qty,
          brand: i.brand || "Unknown",

          // ⭐ IMPORTANT FIELDS FOR DETECTION
          category: i.category || "",
          type: i.type || "",
          specs: i.specs || {},
          tags: i.tags || [],
        };
      });


      let merged = normalizedServer;

      if (mergeOnce) {
        const guestCart = getGuestCart();
        const mergedMap = new Map();

        normalizedServer.forEach(item => mergedMap.set(item._id, { ...item }));
        guestCart.forEach(item => {
          if (mergedMap.has(item._id)) {
            mergedMap.get(item._id).qty = Math.min(
              mergedMap.get(item._id).qty + item.qty,
              item.countInStock || Infinity
            );
          } else {
            mergedMap.set(item._id, { ...item });
          }
        });

        merged = Array.from(mergedMap.values());

        await axios.put(
          `${API_URL}/api/cart`,
          { items: merged.map(i => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        );
      }

      set({ cart: merged });
      saveCart(merged);
    } catch (err) {
      console.error("Failed to sync server cart:", err);
      toast.error("Cart sync failed");
    }
  },

  
  addToCart: async (product, qty = 1) => {
  if (product.countInStock <= 0) {
    toast.error(`${product.name} is out of stock`);
    return;
  }

  const existing = get().cart.find(i => i._id === product._id);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty + qty > product.countInStock) {
    toast.error(`Cannot add more than ${product.countInStock} of ${product.name}`);
    return;
  }

  // ⭐ Ensure essential fields are ALWAYS saved into cart
  const normalizedProduct = {
    _id: product._id,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    finalPrice: product.finalPrice,
    countInStock: product.countInStock,
    images: product.images,
    brand: product.brand,

    // ⭐ These were missing → suggestions failed after refresh
    category: product.category || "", 
    type: product.type || "",
    specs: product.specs || {},

    qty
  };

  let newCart;

  if (existing) {
    newCart = get().cart.map(i =>
      i._id === product._id
        ? { ...i, qty: i.qty + qty }
        : i
    );
  } else {
    newCart = [...get().cart, normalizedProduct];
  }

  set({ cart: newCart });
  saveCart(newCart);

  toast[existing ? "info" : "success"](
    existing
      ? `Increased quantity of ${product.name}`
      : `${product.name} added to cart`
  );

  const { user } = useAuthStore.getState();

  if (user) {
    try {
      await axios.put(
        `${API_URL}/api/cart`,
        { items: newCart.map(i => ({ productId: i._id, quantity: i.qty })) },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to update server cart:", err);
    }
  }
},


  removeFromCart: async (id) => {
    const item = get().cart.find(i => i._id === id);
    const newCart = get().cart.filter(i => i._id !== id);
    set({ cart: newCart });
    saveCart(newCart);
    toast.warn(`${item?.name || "Item"} removed`);

    const { user } = useAuthStore.getState();
    if (user) {
      try {
        await axios.put(
          `${API_URL}/api/cart`,
          { items: newCart.map(i => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to update server cart:", err);
      }
    }
  },

  updateQty: async (id, qty) => {
    const cart = get().cart;
    const item = cart.find(i => i._id === id);
    if (!item) return;

    if (qty <= 0) return get().removeFromCart(id);
    if (qty > item.countInStock) {
      toast.error(`Cannot set quantity above ${item.countInStock}`);
      return;
    }

    const newCart = cart.map(i => i._id === id ? { ...i, qty } : i);
    set({ cart: newCart });
    saveCart(newCart);

    const { user } = useAuthStore.getState();
    if (user) {
      try {
        await axios.put(
          `${API_URL}/api/cart`,
          { items: newCart.map(i => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to update server cart:", err);
      }
    }

    toast.info(`Updated ${item.name} quantity to ${qty}`);
  },

  clearCart: async (showToast = true) => {
    set({ cart: [] });
    saveCart([]);
    if (showToast) toast.info("Cart cleared");

    const { user } = useAuthStore.getState();
    if (user) {
      try {
        await axios.put(`${API_URL}/api/cart`, { items: [] }, { withCredentials: true });
      } catch (err) {
        console.error("Failed to clear server cart:", err);
      }
    }
  },


    replaceCart: (items) => {
    set({ cart: items, hydrated: true });
    saveCart(items);

    // persist for logged-in users
    const { user } = useAuthStore.getState();
    if (user) {
      axios.put(
        `${API_URL}/api/cart`,
        { items: items.map(i => ({ productId: i._id, quantity: i.qty })) },
        { withCredentials: true }
      ).catch(err => console.error("replaceCart sync fail", err));
    }
  },
  
}));




export default useCartStore;
