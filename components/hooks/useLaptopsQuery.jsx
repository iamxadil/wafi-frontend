// ✅ src/hooks/useLaptopsQuery.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useLaptopsQuery = ({
  page = 1,
  limit = 6,
  search = "",
  sort = "newest",
  isTopProduct,
  isOffer,
  inStock,
  ...filters // dynamic (brand, tags, price, etc.)
} = {}) => {
  return useQuery({
    queryKey: ["laptops", { page, limit, search, sort, isTopProduct, isOffer, inStock, filters }],

    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("category", "Laptops");
      params.append("page", page);
      params.append("limit", limit);
      if (search?.trim()) params.append("search", search.trim());
      if (sort) params.append("sort", sort);
      if (isTopProduct) params.append("isTopProduct", "true");
      if (isOffer) params.append("isOffer", "true");
      if (inStock) params.append("inStock", "true");

      // Dynamic filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "" || value?.length === 0) return;
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else if (typeof value === "object" && value.min != null && value.max != null) {
          params.append(`min${key[0].toUpperCase() + key.slice(1)}`, value.min);
          params.append(`max${key[0].toUpperCase() + key.slice(1)}`, value.max);
        } else {
          params.append(key, value);
        }
      });

      const res = await axios.get(`${API_URL}/api/products?${params.toString()}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      const normalized = products.map((p) => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? (p.price ?? 0) - (p.discountPrice ?? 0)),
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: data.page ?? page,
          totalPages: data.pages ?? 0,
          totalItems: data.totalItems ?? data.total ?? 0,
        },
      };
    },

    keepPreviousData: true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
