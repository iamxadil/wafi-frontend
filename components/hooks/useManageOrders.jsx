import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =======================================================
   🧾 FETCH ORDERS (with pagination)
======================================================= */
export const useOrdersQuery = (params = { page: 1, limit: 2, sort, filter, search }) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_URL}/api/orders?${query}`, {
          withCredentials: true,
        });

        const data = res.data || {};

        // ✅ Normalize structure
        return {
          orders: Array.isArray(data.orders) ? data.orders : [],
          pagination: {
            page: data.pagination?.page || params.page || 1,
            totalPages: data.pagination?.pages || data.pages || 1,
            total: data.pagination?.total || data.total || 0,
          },
        };
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        toast.error(err.response?.data?.message || "Failed to load orders.");
        throw err;
      }
    },
  });
};

/* =======================================================
   🔁 UPDATE ORDER STATUS (with admin note)
======================================================= */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, note }) => {
      const res = await axios.put(
        `${API_URL}/api/orders/${id}/status`,
        { status, note },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`✅ Order updated to "${data.status}"`);
      // ✅ Revalidate both active and archived orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["archivedOrders"] });
    },
    onError: (err) => {
      console.error("❌ Failed to update order status:", err);
      toast.error(err.response?.data?.message || "Failed to update order status.");
    },
  });
};

/* =======================================================
   🗃️ ARCHIVE ORDER
======================================================= */
export const useArchiveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.patch(
        `${API_URL}/api/orders/${id}/archive`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.info("🗃️ Order archived successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["archivedOrders"] });
    },
    onError: (err) => {
      console.error("❌ Failed to archive order:", err);
      toast.error(err.response?.data?.message || "Failed to archive order.");
    },
  });
};

/* =======================================================
   ♻️ UNARCHIVE ORDER
======================================================= */
export const useUnarchiveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.patch(
        `${API_URL}/api/orders/${id}/unarchive`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("♻️ Order restored successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["archivedOrders"] });
    },
    onError: (err) => {
      console.error("❌ Failed to unarchive order:", err);
      toast.error(err.response?.data?.message || "Failed to unarchive order.");
    },
  });
};
