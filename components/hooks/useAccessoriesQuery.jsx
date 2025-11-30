import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * 🧠 useAccessoriesQuery
 * Fully compatible with backend filtering + priority/sort logic
 */
export const useAccessoriesQuery = ({
  limit = 4,
  page = 1,
  search = "",
  sort = "date-desc",      // ⭐ backend default (priority ON)
  inStock,
  isOffer,
  isTopProduct,
  category = "",            // optional category override
  ...filters                // brand, tags, priceRange, etc.
} = {}) => {

  return useQuery({
    queryKey: [
      "accessories",
      { limit, page, search, sort, inStock, isOffer, isTopProduct, category, filters },
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      /* ---------------------------------------------------------
         BASIC PARAMS
      --------------------------------------------------------- */
      params.set("limit", limit);
      params.set("page", page);
      params.set("sort", sort);

      // Optional category override
      if (category) params.set("category", category);

      // Search
      if (search.trim()) params.set("search", search.trim());

      /* ---------------------------------------------------------
         BOOLEAN FLAGS (Offer / Top Product)
      --------------------------------------------------------- */
      if (isOffer === true || isOffer === "true") {
        params.set("isOffer", "true");
      }

      if (isTopProduct === true || isTopProduct === "true") {
        params.set("isTopProduct", "true");
      }

      /* ---------------------------------------------------------
         STOCK FILTER (true or false)
      --------------------------------------------------------- */
      if (inStock === true || inStock === "true") {
        params.set("inStock", "true");
      } 
      else if (inStock === false || inStock === "false") {
        params.set("inStock", "false");
      }

      /* ---------------------------------------------------------
         DYNAMIC FILTERS (brand, tags, minPrice/maxPrice, etc.)
      --------------------------------------------------------- */
      Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "" || value?.length === 0) return;

        // Arrays: brand=["Razer","Logitech"]
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
          return;
        }

        // Price range: {min: X, max: Y}
        if (typeof value === "object" && ("min" in value || "max" in value)) {
          if (value.min != null) params.set("minPrice", value.min);
          if (value.max != null) params.set("maxPrice", value.max);
          return;
        }

        // Scalar values
        params.set(key, value);
      });

      /* ---------------------------------------------------------
         REQUEST
      --------------------------------------------------------- */
      const url = `${API_URL}/api/products/accessories?${params.toString()}`;

      const { data } = await axios.get(url, { withCredentials: true });
      const products = Array.isArray(data.products) ? data.products : [];

      /* ---------------------------------------------------------
         NORMALIZE FINAL PRICE
      --------------------------------------------------------- */
      const normalized = products.map((p) => ({
        ...p,
        finalPrice: p.discountPrice > 0 ? p.price - p.discountPrice : p.price,
      }));

      /* ---------------------------------------------------------
         PAGINATION FALLBACKS
      --------------------------------------------------------- */
      return {
        products: normalized,
        pagination: {
          currentPage: data.pagination?.page ?? page,
          totalPages: data.pagination?.pages ?? 0,
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
