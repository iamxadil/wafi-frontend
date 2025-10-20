import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useLaptopsQuery = ({page = 1 ,limit = 4 ,brands = [] ,minPrice ,maxPrice ,sort ,search, isTopProduct} = {}) => {
  
  return useQuery({
    queryKey: ["laptops", page, limit, brands, minPrice, maxPrice, sort, search, isTopProduct],
    
    queryFn: async () => {
      let query = `category=Laptops&page=${page}&limit=${limit}`;
      if (brands.length > 0) query += `&brand=${brands.join(",")}`;
      if (minPrice != null) query += `&minPrice=${minPrice}`;
      if (maxPrice != null) query += `&maxPrice=${maxPrice}`;
      if (sort) query += `&sort=${sort}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (isTopProduct) query += `&isTopProduct=true`;

      const res = await axios.get(`${API_URL}/api/products?${query}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      const laptops = Array.isArray(data.products) ? data.products : [];
      const normalized = laptops.map(p => ({
        ...p,
        finalPrice: Number(p.finalPrice ?? (p.price ?? 0) - (p.discountPrice ?? 0)),
      }));

      return {
        products: normalized,
        pagination: {
          currentPage: data.page ?? page,
          totalPages: data.pages ?? 0,
          totalItems: data.totalItems ?? data.total ?? 0,
        },
      };
    },
    keepPreviousData: true, // keeps old page visible while fetching new
    staleTime: 1000 * 60,   // cache for 1 minute
  });
};
