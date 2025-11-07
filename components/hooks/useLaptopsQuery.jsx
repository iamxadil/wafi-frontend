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
  ...filters // dynamic filters: brand, cpu, ram, etc.
} = {}) => {
  return useQuery({
    queryKey: ["laptops", { page, limit, search, sort, isTopProduct, isOffer, inStock, filters }],

    queryFn: async () => {
      const params = new URLSearchParams();

      // ✅ Always fetch laptop category
      params.append("category", "Laptops");
      params.append("page", page);
      params.append("limit", limit);

      if (search?.trim()) params.append("search", search.trim());
      if (sort) params.append("sort", sort);
      if (isTopProduct) params.append("isTopProduct", "true");
      if (isOffer) params.append("isOffer", "true");
      if (inStock) params.append("inStock", "true");

      /* =======================================================
         🧩 Dynamic filters (brand, cpu, ram, gpu, storage, etc.)
      ======================================================= */
      Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "" || value?.length === 0) return;

        // 🧠 Handle array filters (e.g. multiple brands or CPUs)
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        }

        // 💰 Handle price range only
        else if (
          typeof value === "object" &&
          value.min != null &&
          value.max != null &&
          key.toLowerCase() === "price"
        ) {
          params.append("minPrice", value.min);
          params.append("maxPrice", value.max);
        }

        // 🧱 Fallback for single filter values
        else {
          params.append(key, value);
        }
      });

      console.log("🧠 Params sent to backend:", Object.fromEntries(params));

      /* =======================================================
         📦 Fetch Data
      ======================================================= */
      const res = await axios.get(`${API_URL}/api/products?${params.toString()}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      // 🧮 Calculate final price
      const normalized = products.map((p) => ({
        ...p,
        finalPrice:
          p.discountPrice && p.discountPrice > 0
            ? p.price - p.discountPrice
            : p.price,
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
    staleTime: 1000 * 60, // 1 minute cache
    refetchOnWindowFocus: false,
  });
};
