import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ------------------------------------------------------------
   ⭐ SORT MAPPING (UI → Backend)
------------------------------------------------------------ */
const SORT_MAP = {
  Default: "date-desc",
  Newest: "date-desc",
  Oldest: "date-asc",
  "A → Z": "alpha-asc",
  "Z → A": "alpha-desc",
  "Price ↑": "price-asc",
  "Price ↓": "price-desc",
};

/* ------------------------------------------------------------
   ⭐ MULTI-STOCK FILTER MAPPING (UI → Backend)
------------------------------------------------------------ */
const OPT_FILTER_MAP = {
  "In Stock": { inStock: "true" },
  "Out of Stock": { inStock: "false" },
  "Low Stock": { lowStock: "true" },
};

/* ------------------------------------------------------------
   📦 FETCH ALL PRODUCTS (COMPLETE FIX)
------------------------------------------------------------ */
export const useProductsQuery = (params = {}, normalizeProducts) => {
  return useQuery({
    queryKey: ["products", params],

    queryFn: async () => {
      const parsed = {};

      /* ------------------------------------------------------------
         1️⃣ SORT MAPPING
      ------------------------------------------------------------ */
      if (params.sort) {
        parsed.sort = SORT_MAP[params.sort] || params.sort;
      }

      /* ------------------------------------------------------------
         2️⃣ MULTI FILTERS (inStock, lowStock)
      ------------------------------------------------------------ */
      if (Array.isArray(params.optFilters)) {
        params.optFilters.forEach((label) => {
          const mapped = OPT_FILTER_MAP[label];
          if (mapped) Object.assign(parsed, mapped);
        });
      }

      /* ------------------------------------------------------------
         3️⃣ PASS OTHER FILTERS
      ------------------------------------------------------------ */
      Object.entries(params).forEach(([key, val]) => {
        if (
          val !== "" &&
          val !== undefined &&
          val !== null &&
          key !== "optFilters"
        ) {
          parsed[key] = val;
        }
      });

      /* ------------------------------------------------------------
         4️⃣ Build final query
      ------------------------------------------------------------ */
      const query = new URLSearchParams(parsed).toString();

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

/* ------------------------------------------------------------
   ➕ Add Product
------------------------------------------------------------ */
export const useAddProductMutation = (normalizeProduct, setUploadProgress) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${API_URL}/api/products`, formData, {
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

    onSuccess: () => {
      toast.success("✅ Product added successfully!");
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add product");
    },
  });
};

/* ------------------------------------------------------------
   ✏️ Edit Product
------------------------------------------------------------ */
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

    onSuccess: () => {
      toast.success("✏️ Product updated successfully!");
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update product");
    },
  });
};

/* ------------------------------------------------------------
   🗑️ Delete Product
------------------------------------------------------------ */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      const list = Array.isArray(ids) ? ids : [ids];
      const results = [];

      for (const id of list) {
        const res = await axios.delete(`${API_URL}/api/products/${id}`, {
          withCredentials: true,
        });
        results.push(res.data);
      }

      return results;
    },

    onSuccess: (results) => {
      toast.success(`🗑️ Deleted ${results.length} product(s).`);
      queryClient.invalidateQueries(["products"]);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete product");
    },
  });
};
