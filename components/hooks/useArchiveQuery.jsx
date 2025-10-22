import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {toast} from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Fetch archived orders
export const useArchiveQuery = ({ page = 1, limit = 4, sort, search } = {}) => {
  return useQuery({
    queryKey: ["archive", page, limit, sort, search],
    queryFn: async () => {
      
      let query = `?page=${page}&limit=${limit}`;
      if (sort) query += `&sort=${sort}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await axios.get(`${API_URL}/api/orders/archived${query}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const orders = Array.isArray(data.orders) ? data.orders : [];

      return {
        orders,
        pagination: {
          currentPage: data.page ?? page,
          totalPages: data.pages ?? 0,
          totalItems: data.totalItems ?? data.total ?? 0,
        },
      };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
};

// ✅ Restore order mutation
export const useRestoreOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId) => {
      console.log("Calling restore mutation for orderId:", orderId); // debug
      return axios.patch(`${API_URL}/api/orders/${orderId}/unarchive`, {}, {withCredentials: true});
    },
    onSuccess: (res, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["archive"], exact: false });
      toast.success("Order restored")
    },
    onError: (error, orderId) => {
      toast.error("Failed to restore order")
    },
  });
};
