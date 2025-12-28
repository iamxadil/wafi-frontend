import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useCategoryQuery = ({
  category = "",
  brand = "",
  search = "",
  page = 1,
  limit = 10,
  sort = "date-desc",
  ...filters
} = {}) => {
  // Prepare a stable queryKey to avoid unnecessary refetches
  const queryKey = ["categoryProducts", { category, brand, search, page, limit, sort, filters }];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Required params
      if (category) params.set("category", category);
      if (brand) params.set("brand", brand);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sort", sort);
      if (search) params.set("search", search);

      // Dynamic filters (CPU, RAM, etc.)
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) {
          params.set(key, Array.isArray(value) ? value.join(",") : value);
        }
      });

      // Fetch data from backend
      const res = await axios.get(`${API_URL}/api/products?${params.toString()}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      // Normalize prices
      const normalized = products.map((p) => ({
        ...p,
        finalPrice: p.discountPrice > 0 ? p.price - p.discountPrice : p.price,
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: Number(data.pagination?.currentPage ?? page),
          totalPages: Number(data.pagination?.totalPages ?? 1),
          totalItems: Number(data.pagination?.totalItems ?? 0),
        },
      };
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
};
