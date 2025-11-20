import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -----------------------------------------------
   📦 Fetch All Products (with pagination)
------------------------------------------------ */
export const useProductsQuery = (
  params = {
    page: 1,
    limit: 10,
    search: "",
    sort: "date-desc",
    category: "",
    brand: "",
    inStock: "",
    isOffer: "",
    isTopProduct: "",
  },
  normalizeProducts
) => {
  return useQuery({
    queryKey: ["products", params],

    queryFn: async () => {
      const filteredParams = {};

      // remove empty params
      Object.entries(params).forEach(([key, val]) => {
        if (val !== "" && val !== undefined && val !== null) {
          filteredParams[key] = val;
        }
      });

      const query = new URLSearchParams(filteredParams).toString();

      const res = await axios.get(`${API_URL}/api/products?${query}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      const pagination = {
        page: data.pagination?.currentPage ?? params.page ?? 1,
        totalPages: data.pagination?.totalPages ?? 1,
        totalItems: data.pagination?.totalItems ?? 0,
        limit: data.pagination?.limit ?? params.limit ?? 10,
      };

      return {
        products: normalizeProducts ? normalizeProducts(products) : products,
        pagination,
      };
    },

    keepPreviousData: true,
    staleTime: 60000,
    retry: 1,
  });
};

/* -----------------------------------------------
   ➕ Add Product
------------------------------------------------ */
export const useAddProductMutation = (normalizeProduct, setUploadProgress) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${API_URL}/api/products`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);   // 🔥 live number
        },
      });

      return normalizeProduct
        ? normalizeProduct(res.data.product)
        : res.data.product;
    },

    onSuccess: () => {
      toast.success("✅ Product added successfully!");
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add product");
    },
  });
};


/* -----------------------------------------------
   ✏️ Edit Product
------------------------------------------------ */
export const useEditProductMutation = (normalizeProduct, setUploadProgress) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await axios.put(`${API_URL}/api/products/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        },
      });

      return normalizeProduct
        ? normalizeProduct(res.data.product)
        : res.data.product;
    },

    onSuccess: (updatedProduct) => {
      toast.success("✏️ Product updated successfully!");
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
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
