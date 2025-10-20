import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useOffersQuery = ({ page = 1, limit = 4 } = {}) =>
  useQuery({
    queryKey: ["offers", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/products/offers?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );

      const products = Array.isArray(res.data.products) ? res.data.products : [];
      const normalized = products.map((p) => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? (p.price ?? 0) - (p.discountPrice ?? 0)),
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: res.data.pagination?.currentPage ?? page,
          totalPages: res.data.pagination?.totalPages ?? 1,
          totalItems: res.data.pagination?.totalItems ?? 0,
        },
      };
    },
    keepPreviousData: true, // smooth pagination
    staleTime: 1000 * 60,   // 1 minute cache
  });
