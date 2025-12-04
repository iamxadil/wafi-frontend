import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useNotesQuery = () =>
  useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/notes`, { withCredentials: true });
      return res.data;
    },
  });

export const useAddNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) =>
      axios.post(`${API}/api/notes`, { text }, { withCredentials: true }),
    onSuccess: () => qc.invalidateQueries(["notes"]),
  });
};

export const useUpdateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }) =>
      axios.put(`${API}/api/notes/${id}`, { text }, { withCredentials: true }),
    onSuccess: () => qc.invalidateQueries(["notes"]),
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      axios.delete(`${API}/api/notes/${id}`, { withCredentials: true }),
    onSuccess: () => qc.invalidateQueries(["notes"]),
  });
};
