import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -----------------------------------------------
   📦 Fetch All Products (with pagination)
------------------------------------------------ */
export const useProductsQuery = (
  params = { limit: 7, page: 1 },
  normalizeProducts
) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();

      const res = await axios.get(`${API_URL}/api/products?${query}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      // ✅ Normalize pagination
      const pagination = {
        page: data.pagination?.currentPage ?? data.page ?? params.page ?? 1,
        totalPages: data.pagination?.totalPages ?? data.pages ?? 1,
        totalItems:
          data.pagination?.totalItems ?? data.totalItems ?? products.length,
        limit: data.pagination?.limit ?? params.limit ?? 8,
      };

      return {
        products: normalizeProducts ? normalizeProducts(products) : products,
        pagination,
      };
    },

    keepPreviousData: true,
    staleTime: 60_000,
    retry: 1,

    onError: (err) => {
      console.error("❌ Error fetching products:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load products");
    },
  });
};

/* -----------------------------------------------
   ➕ Add Product
------------------------------------------------ */
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

    onSuccess: () => {
      toast.success("✅ Product added successfully!");
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      console.error("❌ Error adding product:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add product");
    },
  });
};

/* -----------------------------------------------
   ✏️ Edit Product
------------------------------------------------ */
export const useEditProductMutation = (normalizeProduct) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      if (!id) throw new Error("Missing product ID");

      const res = await axios.put(`${API_URL}/api/products/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data.product || res.data;
      if (!updated) throw new Error("No updated product returned from server");

      return normalizeProduct ? normalizeProduct(updated) : updated;
    },

    onSuccess: (updatedProduct) => {
      toast.success("✏️ Product updated successfully!");
      queryClient.setQueryData(["products"], (oldData) => {
        if (!oldData || !oldData.products) return oldData;
        return {
          ...oldData,
          products: oldData.products.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          ),
        };
      });
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      console.error("❌ Error updating product:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update product");
    },
  });
};

/* -----------------------------------------------
   🗑️ Delete Product (single or multiple)
------------------------------------------------ */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      // Allow both single string or array
      const idList = Array.isArray(ids) ? ids : [ids];
      const results = [];

      for (const id of idList) {
        try {
          const res = await axios.delete(`${API_URL}/api/products/${id}`, {
            withCredentials: true,
          });
          results.push(res.data);
        } catch (err) {
          console.error(`❌ Failed to delete product ${id}:`, err.message);
          throw err;
        }
      }

      return results;
    },

    onSuccess: (results) => {
      toast.success(`🗑️ ${results.length} product${results.length > 1 ? "s" : ""} deleted.`);
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      console.error("❌ Error deleting product:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete product");
    },
  });
};
