import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useBlackFridayQuery = (page = 1, limit = 2) => {
  return useQuery({
    queryKey: ["blackFriday", page, limit],

    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/products/black-friday?page=${page}&limit=${limit}`
      );

      // 🔥 Normalize finalPrice
      const normalizedProducts = (data?.products || []).map((p) => {
        const price = Number(p.price) || 0;
        const discount = Number(p.discountPrice) || 0;

        return {
          ...p,
          finalPrice: Math.max(price - discount, 0),
        };
      });

      // Return EVERYTHING for proper pagination
      return {
        success: data?.success ?? true,
        total: data?.total ?? 0,
        page: data?.page ?? page,
        pages: data?.pages ?? 1,
        limit, // return the same limit you passed
        products: normalizedProducts,
      };
    },

    keepPreviousData: true,
  });
};
