// src/components/hooks/useOthersQuery.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * 🧠 useOthersQuery
 * Fully compatible with backend sorting / priority logic.
 * Fetches Routers, Adapters, Flash Drives, HDD/SSD, Cables, etc.
 */
export const useOthersQuery = ({
  limit = 6,
  page = 1,
  search = "",
  sort = "date-desc",    // ⭐ backend default (priority active)
  inStock,
  isOffer,
  isTopProduct,
  ...filters             // brand, tags, minPrice, maxPrice, etc.
} = {}) => {
  return useQuery({
    queryKey: [
      "others",
      { limit, page, search, sort, inStock, isOffer, isTopProduct, filters },
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      /* ---------------------------------------------------------
         BASIC PARAMS
      --------------------------------------------------------- */
      params.set("limit", limit);
      params.set("page", page);
      params.set("sort", sort);

      if (search.trim()) params.set("search", search.trim());

      /* ---------------------------------------------------------
         OFFER / TOP PRODUCT
      --------------------------------------------------------- */
      if (isOffer === true || isOffer === "true") params.set("isOffer", "true");
      if (isTopProduct === true || isTopProduct === "true")
        params.set("isTopProduct", "true");

      /* ---------------------------------------------------------
         STOCK FILTER
         (true and false supported)
      --------------------------------------------------------- */
      if (inStock === true || inStock === "true") {
        params.set("inStock", "true");
      } else if (inStock === false || inStock === "false") {
        params.set("inStock", "false");
      }

      /* ---------------------------------------------------------
         DYNAMIC FILTERS
      --------------------------------------------------------- */
      Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "" || value?.length === 0) return;

        // Arrays: brand=["Asus","TP-Link"]
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
          return;
        }

        // Price range: { min: 10, max: 200 }
        if (typeof value === "object" && ("min" in value || "max" in value)) {
          if (value.min != null) params.set("minPrice", value.min);
          if (value.max != null) params.set("maxPrice", value.max);
          return;
        }

        // Single value
        params.set(key, value);
      });

      /* ---------------------------------------------------------
         REQUEST
      --------------------------------------------------------- */
      const { data } = await axios.get(
        `${API_URL}/api/products/others?${params.toString()}`,
        { withCredentials: true }
      );

      const productsRaw = Array.isArray(data.products) ? data.products : [];

      /* ---------------------------------------------------------
         NORMALIZE PRICES
      --------------------------------------------------------- */
      const products = productsRaw.map((p) => ({
        ...p,
        finalPrice:
          p.discountPrice > 0 ? p.price - p.discountPrice : p.price,
      }));

      /* ---------------------------------------------------------
         PAGINATION
      --------------------------------------------------------- */
      return {
        products,
        pagination: {
          currentPage: data.pagination?.currentPage ?? page,
          totalPages: data.pagination?.totalPages ?? 0,
          totalItems: data.pagination?.totalItems ?? 0,
          limit,
        },
      };
    },

    keepPreviousData: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};
