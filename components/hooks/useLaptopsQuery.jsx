// ✅ src/hooks/useLaptopsQuery.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useLaptopsQuery = ({
  page = 1,
  limit = 6,
  search = "",
  sort = "date-desc",    
  isTopProduct,
  isOffer,
  inStock,
  category = "Laptops",  
  ...filters
} = {}) => {
  return useQuery({
    queryKey: [
      "laptops",
      { page, limit, search, sort, isTopProduct, isOffer, inStock, filters },
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      /* ----------------------------
         Base params (required)
      ----------------------------- */
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sort", sort);           // "date-desc", "price-asc", etc.
      params.set("category", category);   // ensures only laptops fetched

      /* ----------------------------
         Search
      ----------------------------- */
      if (search.trim()) {
        params.set("search", search.trim());
      }

      /* ----------------------------
         Offer / Top Product
      ----------------------------- */
      if (isOffer === true || isOffer === "true") {
        params.set("isOffer", "true");
      }

      if (isTopProduct === true || isTopProduct === "true") {
        params.set("isTopProduct", "true");
      }

      /* ----------------------------
         Stock Filter
         Supports true, false, "true", "false"
      ----------------------------- */
      if (inStock === true || inStock === "true") {
        params.set("inStock", "true");
      } 
      else if (inStock === false || inStock === "false") {
        params.set("inStock", "false");
      }

      /* -------------------------------------------------------
         Dynamic Filters (cpuModel, gpuFamily, ramSize, etc.)
         EXACTLY matches backend specFilters logic
      -------------------------------------------------------- */
      Object.entries(filters).forEach(([key, val]) => {
        if (val == null) return;

        // Array filters (e.g. brands = ['ASUS','HP'])
        if (Array.isArray(val)) {
          if (val.length > 0) params.set(key, val.join(","));
          return;
        }

        // Price Range {min, max}
        if (typeof val === "object" && ("min" in val || "max" in val)) {
          if (val.min != null) params.set("minPrice", val.min);
          if (val.max != null) params.set("maxPrice", val.max);
          return;
        }

        // Single values
        params.set(key, String(val));
      });

      /* ----------------------------
         API Fetch
      ----------------------------- */
      const { data } = await axios.get(
        `${API_URL}/api/products?${params.toString()}`,
        { withCredentials: true }
      );

      const normalized = (data?.products || []).map((p) => ({
        ...p,
        finalPrice: p.discountPrice > 0 ? p.price - p.discountPrice : p.price,
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: data.pagination?.currentPage ?? page,
          totalPages: data.pagination?.totalPages ?? 0,
          totalItems: data.pagination?.totalItems ?? 0,
          limit: data.pagination?.limit ?? limit,
        },
      };
    },

    keepPreviousData: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};
