import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ======================================================
   🧭 FETCH USERS
====================================================== */
export const useUsersQuery = (params = { limit: 6, page: 1 }) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}/api/users?${query}`, {
        withCredentials: true,
      });
      const data = res.data;
      return {
        users: data.users || [],
        pagination: {
          page: data.pagination?.page || params.page || 1,
          totalPages: data.pagination?.pages || data.pages || 1,
          total: data.pagination?.total || data.total || 0,
        },
      };
    },
  });
};

/* ======================================================
   🚫 BAN / UNBAN USER
====================================================== */
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, action, reason }) => {
      const res = await axios.patch(
        `${API_URL}/api/users/${userId}/ban`, // ✅ correct route
        {
          action,  // backend can read "ban" or "unban"
          reason,
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (_, vars) => {
      toast.success(
        vars.action === "ban"
          ? "User banned successfully"
          : "User unbanned successfully"
      );

      // ✅ invalidate relevant caches
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userInsights"]);
    },
    onError: (err) => {
      console.error("❌ Ban request failed:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to update ban status"
      );
    },
  });
};


/* ======================================================
   🗑️ DELETE USER
====================================================== */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const res = await axios.delete(`${API_URL}/api/users/${userId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    },
  });
};


export const useUserInsightsQuery = (userId) => {
  return useQuery({
    queryKey: ["userInsights", userId],
    enabled: !!userId, // only run when userId is available
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/users/${userId}/insights`, {
        withCredentials: true,
      });
      const data = res.data || {};

      return {
        // 🧩 Insights summary metrics
        insights: data.insights || {
          totalOrders: 0,
          totalFavorites: 0,
          totalReviews: 0,
          avgRating: 0,
          deliveredOrders: 0,
          canceledOrders: 0,
          totalSpent: 0,
        },

        // 🧾 Data arrays
        orders: data.orders || [],
        favorites: data.favorites || [],
        reviews: data.reviews || [],
      };
    },
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
    retry: 1,
  });
};

export const usePromoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axios.put(
        `${API_URL}/api/users/${userId}/promote`,
        { role },
        { withCredentials: true }
      );
      return data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || "User role updated successfully!");
      // Refresh users list or cached data
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", data?.user?._id]);
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update user role.";
      toast.error(message);
    },
  });
};