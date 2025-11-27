import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useProductByTag = (tag, options = {}) => {
  return useQuery({
    queryKey: ["product-by-tag", tag],
    enabled: !!tag && (options.enabled ?? true),

    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/products?tags=${tag}`);

      let arr = [];
      if (Array.isArray(res.data?.products)) arr = res.data.products;
      if (Array.isArray(res.data?.data)) arr = res.data.data;
      if (Array.isArray(res.data)) arr = res.data;

      // Fallback: match ANY product with similar tags
      if (arr.length === 0) {
        const alt = await axios.get(`${API_URL}/api/products`);
        const list = alt.data.products || [];

        const similar = list.find((p) =>
          (p.tags || []).some((tg) =>
            tg.toLowerCase().includes("windows") ||
            tg.toLowerCase().includes("key") ||
            tg.toLowerCase().includes("license")
          )
        );

        return similar || null;
      }

      return arr[0] || null;
    },

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
