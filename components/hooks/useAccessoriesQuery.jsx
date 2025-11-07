import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * 🧠 useAccessoriesQuery
 * Handles dynamic fetching for Accessories — with search, filters, sort, pagination.
 */
export const useAccessoriesQuery = ({
  limit = 4,
  page = 1,
  search = "",
  sort = "newest",
  ...filters // allow dynamic filter keys (e.g. brand, price range, tags)
} = {}) => {
  return useQuery({
    queryKey: ["accessories", { limit, page, search, sort, filters }],

    queryFn: async () => {
      const params = new URLSearchParams();

      // Basic pagination
      params.append("limit", limit);
      params.append("page", page);

      // Search text
      if (search?.trim()) {
        params.append("search", search.trim());
      }

      // Sorting
      if (sort) {
        params.append("sort", sort);
      }

      // Dynamic filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value == null || value === "" || value?.length === 0) return;

          // handle arrays (e.g. brand=["Razer","Logitech"])
          if (Array.isArray(value)) {
            params.append(key, value.join(","));
          }
          // handle price range object: { min: 100, max: 500 }
          else if (typeof value === "object" && value.min != null && value.max != null) {
            params.append(`min${key[0].toUpperCase() + key.slice(1)}`, value.min);
            params.append(`max${key[0].toUpperCase() + key.slice(1)}`, value.max);
          }
          // handle simple scalar values
          else {
            params.append(key, value);
          }
        });
      }

      const url = `${API_URL}/api/products/accessories?${params.toString()}`;
      const res = await axios.get(url, { withCredentials: true });
      console.log("🔍 Accessories Query URL:", url);

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      // normalize prices
      const normalized = products.map((p) => ({
        ...p,
        finalPrice:
          typeof p.finalPrice === "number"
            ? p.finalPrice
            : Number((p.price ?? 0) - (p.discountPrice ?? 0)),
      }));

      // pagination defaults
      const pagination = data.pagination || {};
      return {
        products: normalized,
        pagination: {
          currentPage: pagination.page ?? page,
          totalPages: pagination.pages ?? 0,
          totalItems: pagination.totalItems ?? 0,
        },
      };
    },

    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};
