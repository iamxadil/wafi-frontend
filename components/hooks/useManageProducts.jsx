// ✅ useAddProductMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAddProductMutation = (normalizeProduct) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${API_URL}/api/products`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const product = res.data.product || res.data;
      if (!product) throw new Error("No product returned from server");

      return normalizeProduct ? normalizeProduct(product) : product;
    },

    onSuccess: (newProduct) => {
      toast.success("✅ Product added successfully!");
      queryClient.setQueryData(["products"], (old = []) => [...old, newProduct]);
    },

    onError: (err) => {
      console.error("❌ Error adding product:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add product");
    },
  });
};
