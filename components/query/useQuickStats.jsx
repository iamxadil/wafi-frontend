// src/queries/useQuickStats.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fetchQuickStats = async () => {
  const { data } = await axios.get(`${API_URL}/api/admin/quick-stats`, {
    withCredentials: true,
  });
  return data;
};

export default function useQuickStats() {
  return useQuery({
    queryKey: ["quick-stats"],

    queryFn: fetchQuickStats,

    // Refresh every 30 seconds (optional)
    refetchInterval: 30_000,

    // Refresh when window refocuses
    refetchOnWindowFocus: true,

    // Retry if token expired or server down
    retry: 1,
  });
}
