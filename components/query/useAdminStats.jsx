import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/admin/stats`, {
        withCredentials: true
      });
      return data;
    },
    staleTime: 30000,         // reduce unnecessary fetches
    retry: 1,                 // prevent infinite retry spam
    refetchInterval: 60000    // auto-refresh every 60 sec
  });
}
