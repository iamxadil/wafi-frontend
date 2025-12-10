import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./useAuthStore.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------- HELPERS -------------------- */

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

/* -------------------- VALIDATE CART ITEMS (STOCK CHECKER) -------------------- */

const validateCartStock = async (cart) => {
  const validated = [];
  let changed = false;

  for (const item of cart) {
    try {
      const resp = await axios.get(`${API_URL}/api/products/${item._id}`);
      const product = resp.data;

      if (!product || product.countInStock <= 0) {
        changed = true;
        toast.warn(`${item.name} removed — out of stock`);
        continue;
      }

      if (item.qty > product.countInStock) {
        changed = true;
        toast.warn(
          `${item.name} qty reduced to ${product.countInStock} (limited stock)`
        );

        validated.push({
          ...item,
          qty: product.countInStock,
          countInStock: product.countInStock,
        });
      } else {
        validated.push({
          ...item,
          countInStock: product.countInStock,
        });
      }
    } catch {
      validated.push(item); // fallback
    }
  }

  return { validated, changed };
};

/* -------------------- STORE -------------------- */

const useCartStore = create((set, get) => ({
  cart: getGuestCart(),
  cartLoading: false,
  hydrated: false,

  totalItems: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
  totalPrice: () =>
    get().cart.reduce((sum, i) => sum + i.qty * i.finalPrice, 0),

  /* -------------------- INIT CART -------------------- */
  initCart: async () => {
    set({ cartLoading: true });

    const { user } = useAuthStore.getState();

    try {
      if (user) {
        await get().syncCartWithServer();
      } else {
        // Validate stock for guest cart
        const cart = getGuestCart();
        const { validated, changed } = await validateCartStock(cart);

        if (changed) {
          set({ cart: validated });
          saveCart(validated);
        } else {
          set({ cart });
        }
      }
    } catch (err) {
      console.error("Init cart failed:", err);
    } finally {
      set({ cartLoading: false, hydrated: true });
    }
  },

  /* -------------------- SYNC CART WITH SERVER -------------------- */
  syncCartWithServer: async (mergeOnce = false) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const { data } = await axios.get(`${API_URL}/api/cart`, {
        withCredentials: true,
      });

      let serverItems = data.items || [];

      // Normalize server items
      let normalized = serverItems.map((i) => {
        const discount = i.discountPrice > 0 ? i.discountPrice : 0;
        return {
          _id: i._id,
          name: i.name,
          price: i.price,
          discountPrice: discount,
          finalPrice: i.price - discount,
          countInStock: i.countInStock,
          images: i.images || [],
          qty: i.qty,
          brand: i.brand,
          category: i.category || "",
          type: i.type || "",
          specs: i.specs || {},
          tags: i.tags || [],
        };
      });

      /* -------- MERGE GUEST CART ONE TIME AFTER LOGIN -------- */
      if (mergeOnce) {
        const guestCart = getGuestCart();
        const map = new Map();

        normalized.forEach((i) => map.set(i._id, { ...i }));

        guestCart.forEach((g) => {
          if (map.has(g._id)) {
            const mergedQty = Math.min(
              map.get(g._id).qty + g.qty,
              g.countInStock
            );
            map.get(g._id).qty = mergedQty;
          } else {
            map.set(g._id, { ...g });
          }
        });

        normalized = Array.from(map.values());
      }

      /* -------- VALIDATE STOCK -------- */
      const { validated, changed } = await validateCartStock(normalized);

      /* -------- SAVE & SYNC IF NEEDED -------- */
      set({ cart: validated });
      saveCart(validated);

      if (changed && user) {
        await axios.put(
          `${API_URL}/api/cart`,
          { items: validated.map((i) => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("Sync cart failed:", err);
      toast.error("Cart sync failed");
    }
  },

  /* -------------------- ADD TO CART -------------------- */
  addToCart: async (product, qty = 1) => {
    if (product.countInStock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    const existing = get().cart.find((i) => i._id === product._id);
    const currentQty = existing?.qty || 0;

    if (currentQty + qty > product.countInStock) {
      toast.error(
        `Only ${product.countInStock} left in stock for ${product.name}`
      );
      return;
    }

    const normalized = {
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      finalPrice: product.finalPrice,
      countInStock: product.countInStock,
      images: product.images,
      brand: product.brand,
      category: product.category || "",
      type: product.type || "",
      specs: product.specs || {},
      qty,
    };

    let newCart;

    if (existing) {
      newCart = get().cart.map((i) =>
        i._id === product._id ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      newCart = [...get().cart, normalized];
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
          { items: newCart.map((i) => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    }
  },

  /* -------------------- REMOVE ITEM -------------------- */
  removeFromCart: async (id) => {
    const removed = get().cart.find((i) => i._id === id);
    const newCart = get().cart.filter((i) => i._id !== id);

    set({ cart: newCart });
    saveCart(newCart);

    toast.warn(`${removed?.name || "Item"} removed`);

    const { user } = useAuthStore.getState();
    if (user) {
      await axios.put(
        `${API_URL}/api/cart`,
        { items: newCart.map((i) => ({ productId: i._id, quantity: i.qty })) },
        { withCredentials: true }
      ).catch(console.error);
    }
  },

  /* -------------------- UPDATE QUANTITY -------------------- */
  updateQty: async (id, qty) => {
    const cart = get().cart;
    const item = cart.find((i) => i._id === id);
    if (!item) return;

    if (qty <= 0) return get().removeFromCart(id);

    if (qty > item.countInStock) {
      toast.error(`Only ${item.countInStock} left in stock`);
      return;
    }

    const updated = cart.map((i) => (i._id === id ? { ...i, qty } : i));
    set({ cart: updated });
    saveCart(updated);

    const { user } = useAuthStore.getState();
    if (user) {
      await axios.put(
        `${API_URL}/api/cart`,
        { items: updated.map((i) => ({ productId: i._id, quantity: i.qty })) },
        { withCredentials: true }
      ).catch(console.error);
    }

    toast.info(`Updated ${item.name} quantity to ${qty}`);
  },

  /* -------------------- CLEAR CART -------------------- */
  clearCart: async (showToast = true) => {
    set({ cart: [] });
    saveCart([]);

    if (showToast) toast.info("Cart cleared");

    const { user } = useAuthStore.getState();
    if (user) {
      await axios
        .put(
          `${API_URL}/api/cart`,
          { items: [] },
          { withCredentials: true }
        )
        .catch(console.error);
    }
  },

  /* -------------------- REPLACE CART -------------------- */
  replaceCart: (items) => {
    set({ cart: items, hydrated: true });
    saveCart(items);

    const { user } = useAuthStore.getState();
    if (user) {
      axios
        .put(
          `${API_URL}/api/cart`,
          { items: items.map((i) => ({ productId: i._id, quantity: i.qty })) },
          { withCredentials: true }
        )
        .catch(console.error);
    }
  },
}));

export default useCartStore;
