import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useCategoryQuery = (params = {}) => {
  const cleanParams = JSON.parse(JSON.stringify(params)); // removes undefined safely
  const queryString = new URLSearchParams(cleanParams).toString();

  return useQuery({
    queryKey: ["categoryProducts", queryString], // stable key
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/products?${queryString}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const products = Array.isArray(data.products) ? data.products : [];

      const normalized = products.map((p) => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? p.price ?? 0),
      }));

      return {
        products: normalized,

        pagination: {
          currentPage: Number(data.pagination?.currentPage ?? params.page ?? 1),
          totalPages: Number(data.pagination?.totalPages ?? 1),
          totalItems: Number(data.pagination?.totalItems ?? 0),
        },
      };
    },

    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
