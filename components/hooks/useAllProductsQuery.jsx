import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAllProductsQuery = ({limit, page, search}) => { 

    return useQuery({
        queryKey:["all-products", limit, page, search],
        queryFn: async () => {
            
            let query = `limit=${limit}&page=${page}`;
            if (search) query += `&search=${encodeURIComponent(search)}`;

            const res = await axios.get(`${API_URL}/api/products?${query}`,{withCredentials: true});
            const data = res.data || {};
            const products = Array.isArray(data.products) ? data.products : [];
            const normalized = products.map(p => ({
                ...p,
                finalPrice: Number(p.finalPrice ?? (p.price ?? 0) - (p.discountPrice ?? 0)),
            }));


            return {
                products: normalized,
                pagination: {
                    currentPage: data.page ?? page,
                    totalPages: data.pages ?? 0,
                    totalItems: data.totalItems ?? data.total ?? 0,
                }
            }
        },
        keepPreviousData: true,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    })
}