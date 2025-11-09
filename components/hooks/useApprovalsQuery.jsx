import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==========================================================
   ✅ FETCH UNAPPROVED PRODUCTS
========================================================== */
export const useApprovalsQuery = () => {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/products?admin=true`, {
        withCredentials: true,
      });

      // Only return unapproved
      return (res.data.products || []).filter((p) => !p.approved);
    },
    staleTime: 60 * 1000,
  });
};

/* ==========================================================
   ✅ APPROVE OR DELETE PRODUCT (MUTATION)
========================================================== */
export const useSetApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ Accept object so we can pass both { id, action }
    mutationFn: async ({ id, action }) => {
      if (!id || !action)
        throw new Error("Both id and action are required for approval mutation.");

      const res = await axios.put(
        `${API_URL}/api/products/approve/${id}`,
        { action }, 
        { withCredentials: true }
      );

      return res.data;
    },

    // ✅ Refresh the approvals list after any change
    onSuccess: () => {
      queryClient.invalidateQueries(["approvals"]);
    },

    onError: (err) => {
      console.error("❌ Approval or deletion failed:", err);
    },
  });
};
