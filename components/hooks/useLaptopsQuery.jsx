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
      {
        page,
        limit,
        search,
        sort,
        isTopProduct,
        isOffer,
        inStock,
        filters, // dynamic filters
      },
    ],

    queryFn: async () => {
      const params = new URLSearchParams({
        category,
        page,
        limit,
        sort,
      });

      if (search.trim()) params.set("search", search.trim());
      if (isTopProduct) params.set("isTopProduct", "true");
      if (isOffer) params.set("isOffer", "true");
      if (inStock) params.set("inStock", "true");

      /* =======================================================
         🧩 Dynamic Filters
      ======================================================= */
      for (const [key, val] of Object.entries(filters)) {
        if (val == null) continue;

        // Arrays (brands, cpuModel, gpuFamily, ramSize...)
        if (Array.isArray(val)) {
          if (val.length > 0) params.set(key, val.join(","));
          continue;
        }

        // Range object
        if (typeof val === "object" && ("min" in val || "max" in val)) {
          if (val.min != null) params.set("minPrice", val.min);
          if (val.max != null) params.set("maxPrice", val.max);
          continue;
        }

        // Single values
        params.set(key, String(val));
      }

      /* =======================================================
         📡 Fetch
      ======================================================= */
      const { data } = await axios.get(
        `${API_URL}/api/products?${params.toString()}`,
        { withCredentials: true }
      );

      const normalized = (data?.products || []).map((p) => ({
        ...p,
        finalPrice:
          p.discountPrice > 0 ? p.price - p.discountPrice : p.price,
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
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
