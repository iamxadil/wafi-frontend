import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAccessoriesQuery = ({ limit = 4, page = 1, search } = {}) => {
  return useQuery({
    queryKey: ["accessories", limit, page, search],

    queryFn: async () => {
      // build query params dynamically
      let query = `limit=${limit}&page=${page}`;
      if (search && search.trim()) {
        query += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await axios.get(`${API_URL}/api/products/accessories?${query}`, {
        withCredentials: true,
      });

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
