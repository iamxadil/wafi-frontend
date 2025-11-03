// src/components/hooks/useOthersQuery.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * 🧠 useOthersQuery
 * Handles dynamic fetching for "Other" category products
 * (Routers, Adapters, Flash Drives, etc.)
 */
export const useOthersQuery = ({
  limit = 6,
  page = 1,
  search = "",
  sort = "date-desc",
  ...filters // allows brand, tags, minPrice, maxPrice, etc.
} = {}) => {
  return useQuery({
    queryKey: ["others", { limit, page, search, sort, filters }],

    queryFn: async () => {
      const params = new URLSearchParams();

      // Pagination
      params.append("limit", limit);
      params.append("page", page);

      // Search
      if (search?.trim()) {
        params.append("search", search.trim());
      }

      // Sort
      if (sort) {
        params.append("sort", sort);
      }

      // Dynamic filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "" || value?.length === 0) return;

        // handle arrays (e.g. brand=["Asus","TP-Link"])
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        }
        // handle price range objects: { min: 10, max: 200 }
        else if (typeof value === "object" && value.min != null && value.max != null) {
          const capitalized = key[0].toUpperCase() + key.slice(1);
          params.append(`min${capitalized}`, value.min);
          params.append(`max${capitalized}`, value.max);
        }
        // handle scalar values
        else {
          params.append(key, value);
        }
      });

      // Request
      const res = await axios.get(`${API_URL}/api/products/others?${params.toString()}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      // Normalize prices
      const normalized = products.map((p) => ({
        ...p,
        finalPrice:
          typeof p.finalPrice === "number"
            ? p.finalPrice
            : Number((p.price ?? 0) - (p.discountPrice ?? 0)),
      }));

      // Pagination
      const pagination = data.pagination || {};
      return {
        products: normalized,
        pagination: {
          currentPage: pagination.currentPage ?? page,
          totalPages: pagination.totalPages ?? 0,
          totalItems: pagination.totalItems ?? 0,
        },
      };
    },

    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};
