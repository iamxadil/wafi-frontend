import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useOrderStore = create((set, get) => ({
  /* =========================================================
     State
  ========================================================= */
  loading: false,
  allOrders: [],
  archivedOrders: [],
  selectedOrder: null,
  trackModal: false,
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  sort: "newest",
  orderTerm: "",
  status: "",

  /* =========================================================
     Modals & Selection
  ========================================================= */
  setTrackModal: () => set({ trackModal: true }),
  closeTrackModal: () => set({ trackModal: false }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  /* =========================================================
     Filters, Sorting, Pagination
  ========================================================= */
  setSort: (value) => {
    set({ sort: value, currentPage: 1 });
    get().fetchAllOrders(1);
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchAllOrders(page);
  },

  setOrderTerm: (term) => set({ orderTerm: term, currentPage: 1 }),
  setStatusFilter: (status) => set({ status, currentPage: 1 }),

  /* =========================================================
     Attach Order
  ========================================================= */
  attachLoading: false,
  attachError: null,
  attachedOrders: {},

  attachOrderToUser: async (orderId) => {
    set({ attachLoading: true, attachError: null });

    try {
      const { data } = await axios.post(
        `${API_URL}/api/orders/attach`,
        { orderId },
        { withCredentials: true }
      );

      set((state) => ({
        attachedOrders: {
          ...state.attachedOrders,
          [data.order._id]: data.order,
        },
        attachLoading: false,
        attachError: null,
      }));

      return data.order;
    } catch (error) {
      console.error("Failed to attach order:", error.response?.data || error.message);
      set({
        attachLoading: false,
        attachError: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  /* =========================================================
     Orders
  ========================================================= */
  createOrder: async (orderData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        { withCredentials: true }
      );
      set({ lastOrder: data });
      return data;
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      throw error;
    }
  },

  fetchAllOrders: async (page = null) => {
    set({ loading: true });

    try {
      const { orderTerm, status, currentPage, sort } = get();

      const { data } = await axios.get(`${API_URL}/api/orders`, {
        withCredentials: true,
        params: {
          page: page || currentPage,
          limit: 8,
          search: orderTerm,
          status,
          sort,
        },
      });

      set({
        allOrders: data.orders,
        totalOrders: data.totalOrders,
        currentPage: data.page,
        totalPages: data.pages,
        loading: false,
        lastOrderMade:
          data.orders.length > 0
            ? data.orders[data.orders.length - 1]
            : null,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error.message);
      set({ allOrders: [], loading: false });
    }
  },

  fetchArchivedOrders: async () => {
    set({ loading: true });

    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/archived`,
        { withCredentials: true }
      );
      set({ archivedOrders: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch archived orders:", error.response?.data || error.message);
      set({ archivedOrders: [], loading: false });
    }
  },

  archiveOrder: async (orderId) => {
    try {
      await axios.patch(
        `${API_URL}/api/orders/${orderId}/archive`,
        {},
        { withCredentials: true }
      );

      await Promise.all([
        get().fetchAllOrders(get().currentPage),
        get().fetchArchivedOrders(),
      ]);
    } catch (error) {
      console.error("Failed to archive order:", error.response?.data || error.message);
      throw error;
    }
  },

  unarchiveOrder: async (orderId) => {
    try {
      await axios.patch(
        `${API_URL}/api/orders/${orderId}/unarchive`,
        {},
        { withCredentials: true }
      );

      await Promise.all([
        get().fetchAllOrders(get().currentPage),
        get().fetchArchivedOrders(),
      ]);
    } catch (error) {
      console.error("Failed to unarchive order:", error.response?.data || error.message);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      set((state) => ({
        allOrders: state.allOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.status }
            : order
        ),
        selectedOrder:
          state.selectedOrder?._id === orderId
            ? data
            : state.selectedOrder,
      }));

      return data;
    } catch (error) {
      console.error("Failed to update order status:", error.response?.data || error.message);
      throw error;
    }
  },

  /* =========================================================
     My Orders
  ========================================================= */
  loadingMyOrders: false,
  myOrdersError: null,
  myOrders: [],

  fetchMyOrders: async () => {
    set({ loadingMyOrders: true, myOrdersError: null });

    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/my-orders`,
        { withCredentials: true }
      );
      set({ myOrders: data, loadingMyOrders: false });
    } catch (err) {
      set({
        myOrdersError: err.response?.data?.message || err.message,
        loadingMyOrders: false,
      });
    }
  },

  /* =========================================================
     Last / Single Order
  ========================================================= */
  fetchLastOrder: async () => {
    set({ loading: true });

    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/last-order`,
        { withCredentials: true }
      );
      set({ loading: false, lastOrder: data });
    } catch (error) {
      if (error.response?.status === 404) {
        set({ loading: false, lastOrder: null });
      } else {
        console.error("Error fetching last order:", error);
        set({ loading: false, lastOrder: null });
      }
    }
  },

  fetchOrderById: async (orderId) => {
    set({ loading: true });

    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/${orderId}`,
        { withCredentials: true }
      );
      set({ selectedOrder: data, loading: false });
      return data;
    } catch (error) {
      console.error("Failed to fetch order by ID:", error.response?.data || error.message);
      set({ selectedOrder: null, loading: false });
      throw error;
    }
  },

  countAllOrders: async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders`,
        { withCredentials: true }
      );
      set({ totalOrders: data.totalOrders });
    } catch (error) {
      console.error("Failed to count all orders");
      throw error;
    }
  },
}));

export default useOrderStore;
