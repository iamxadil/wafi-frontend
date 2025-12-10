import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useComponentsQuery = (
  params = {
    page: 1,
    limit: 6,
    search: "",
    brand: "",
    tags: "",
    minPrice: "",
    maxPrice: "",
    sort: "date-desc",
    isOffer: undefined,
    isTopProduct: undefined,
    inStock: undefined,
    category: "",   // ⭐ FIXED
  }
) => {

  /* ==================================================
     🧹 CLEAN PARAMS (Remove only undefined values)
  ================================================== */
  const cleanParams = {};

  for (const key in params) {
    const value = params[key];

    // Skip undefined values
    if (value === undefined) continue;

    // Convert booleans to strings (backend expects "true"/"false")
    if (typeof value === "boolean") {
      cleanParams[key] = String(value);
      continue;
    }

    cleanParams[key] = value;
  }

  const queryString = new URLSearchParams(cleanParams).toString();

  /* ==================================================
     📡 REACT QUERY
  ================================================== */
  return useQuery({
    queryKey: ["components", cleanParams], // 🧩 stable key
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/products/components?${queryString}`,
        { withCredentials: true }
      );

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      /* Normalize finalPrice */
      const normalized = products.map((p) => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? p.price ?? 0),
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: Number(data.pagination?.currentPage ?? params.page),
          totalPages: Number(data.pagination?.totalPages ?? 1),
          totalItems: Number(data.pagination?.totalItems ?? 0),
          limit: Number(data.pagination?.limit ?? params.limit),
        },
      };
    },

    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
