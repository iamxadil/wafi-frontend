import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useMonitorsQuery = (params = { limit: 4, page: 1 }) => {
  return useQuery({
    queryKey: ["monitors", params],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        category: "Monitors",
        limit: params.limit,
        page: params.page,
      }).toString();

      const res = await axios.get(`${API_URL}/api/products?${queryString}`, {
        withCredentials: true,
      });

      const data = res.data;

      // 🔥 Normalize finalPrice
      const normalized = (data?.products || []).map((p) => {
        const price = Number(p.price) || 0;
        const discount = Number(p.discountPrice) || 0;

        return {
          ...p,
          finalPrice: discount > 0 ? price - discount : price,
        };
      });

      // 🔥 Return products + pagination — ensure normalized overrides original
      return {
        ...data, // spread original first
        products: normalized, // override with normalized
        pagination: data?.pagination || { currentPage: 1, totalPages: 1 },
      };
    },

    keepPreviousData: true,
  });
};
