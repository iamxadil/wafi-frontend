import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useWindowsKeySuggestions(enabled) {
  return useQuery({
    queryKey: ["suggest-windows-key", enabled], 
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/api/products?tags=windows-key&limit=6&suggest=true`
      );
      return data.products;
    },
    enabled, 
    staleTime: 1000 * 60 * 5,
  });
}
