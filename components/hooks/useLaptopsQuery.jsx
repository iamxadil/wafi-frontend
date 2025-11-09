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
  ...filters // dynamic filters: brand, cpu, ram, gpu, etc.
} = {}) => {
  return useQuery({
    queryKey: ["laptops", { page, limit, search, sort, isTopProduct, isOffer, inStock, filters }],

    queryFn: async () => {
      const params = new URLSearchParams({
        category: "Laptops",
        page,
        limit,
        sort,
      });

      if (search?.trim()) params.set("search", search.trim());
      if (isTopProduct) params.set("isTopProduct", "true");
      if (isOffer) params.set("isOffer", "true");
      if (inStock) params.set("inStock", "true");

      /* =======================================================
         🧩 Dynamic filters (auto-encode arrays & complex filters)
      ======================================================= */
      for (const [key, val] of Object.entries(filters)) {
        if (val == null || val === "" || (Array.isArray(val) && !val.length)) continue;

        // 🧠 Array filters (e.g., multiple brands or CPUs)
        if (Array.isArray(val)) {
          params.set(key, val.join(","));
          continue;
        }

        // 💰 Range object (price, etc.)
        if (typeof val === "object" && ("min" in val || "max" in val)) {
          if (val.min != null) params.set("minPrice", val.min);
          if (val.max != null) params.set("maxPrice", val.max);
          continue;
        }

        // 🎯 Basic single value (string, number, combo)
        params.set(key, String(val).trim());
      }

      console.log("🧠 Query params sent:", Object.fromEntries(params));

      /* =======================================================
         📦 Fetch
      ======================================================= */
      const { data } = await axios.get(`${API_URL}/api/products?${params.toString()}`, {
        withCredentials: true,
      });

      const products = data?.products || [];

      const normalized = products.map((p) => ({
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
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};
