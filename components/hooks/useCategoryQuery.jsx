import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useCategoryQuery = (params) => {
  return useQuery({
    queryKey: ["categoryProducts", params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}/api/products?${query}`, { withCredentials: true });
      const data = res.data || {};
      const products = Array.isArray(res.data.products) ? res.data.products : [];
      const normalized = products.map(p => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? (p.price ?? 0) - (p.discountPrice ?? 0)),
      }));
      return {
        products: normalized,
        
        pagination: {
          currentPage: data.pagination?.currentPage ?? page,
          totalPages: data.pagination?.totalPages ?? 0,
          totalItems: data.pagination?.totalItems ?? 0,
        },
      };
    },
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
