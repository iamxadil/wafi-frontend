// src/hooks/useDynamicFilters.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useDynamicFilters = (context = {}) => {
  return useQuery({
    queryKey: ["dynamic-filters", context],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Automatically handle arrays or strings
      for (const [key, value] of Object.entries(context)) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else if (value) {
          params.append(key, value);
        }
      }

      const { data } = await axios.get(`${API_URL}/api/products/filters?${params.toString()}`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

