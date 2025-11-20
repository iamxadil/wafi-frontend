import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==========================================================
   ✅ FETCH UNAPPROVED PRODUCTS — CLEAN & CORRECT
========================================================== */
export const useApprovalsQuery = () => {
  return useQuery({
    queryKey: ["approvals"],

    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/products/pending`, {
        withCredentials: true,
      });

      // Backend returns: [ {…}, {…}, ... ]
      return Array.isArray(res.data) ? res.data : [];
    },

    staleTime: 60 * 1000, // 1 min caching
    refetchOnWindowFocus: false,
  });
};

/* ==========================================================
   ✅ APPROVE / DELETE PRODUCT
========================================================== */
export const useSetApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }) => {
      if (!id || !action) {
        throw new Error("Both id and action are required for approval mutation.");
      }

      const res = await axios.put(
        `${API_URL}/api/products/approve/${id}`,
        { action }, // { action: "approve" | "delete" }
        { withCredentials: true }
      );

      return res.data;
    },

    onSuccess: () => {
      // Refresh list of pending products
      queryClient.invalidateQueries(["approvals"]);
    },

    onError: (error) => {
      console.error("❌ Approval/deletion failed:", error);
    },
  });
};
