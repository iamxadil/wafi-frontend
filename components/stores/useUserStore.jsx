import { create } from "zustand";
import axios from "axios";

const API_URL = "https://wafi-backend-nlp6.onrender.com";


const useUserStore = create((set, get) => ({
  allUsers: [],
  users: [],
  selectedUsers: [],
  page: 1,
  limit: 10,
  pages: 1,
  search: "",
  role: "",

  setPage: (newPage) => set({ page: newPage }),

  setSelectedUsers: (ids) => set({ selectedUsers: ids }),

  toggleSelectUser: (id) => {
    const selected = get().selectedUsers;
    set({
      selectedUsers: selected.includes(id)
        ? selected.filter((u) => u !== id)
        : [...selected, id],
    });
  },

  fetchUsers: async (page, limit, role, search) => {
  try {
    const query = new URLSearchParams();
    query.append("page", page);
    query.append("limit", limit);

    if (search) query.append("search", search);
    if (role) query.append("role", role); 

    const res = await axios.get(`${API_URL}/api/users?${query.toString()}`, {
      withCredentials: true,
    });

    const { users, totalUsers } = res.data;

    const normalized = users.map(u => ({
      ...u,
      id: u._id,
      joined: new Date(u.createdAt).toLocaleString(),
    }));

    const totalPages = Math.ceil(totalUsers / limit);

    set({ users: normalized, pages: totalPages });
  } catch (error) {
    console.error(error);
  }
},


  updateUser: async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/api/users/${id}`, data, {
      withCredentials: true,
    });

    // Optionally refresh users list if needed
    get().fetchUsers(get().page, get().limit);

    return res.data; // return updated user data
  } catch (err) {
    console.error(err);

    // Throw an error so your modal can catch it
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Failed to update user.");
    }
  }
},

  
  promoteUserRole: async (userId, role) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/users/${userId}/promote`,
      { role },
      { withCredentials: true }
    );

    const updated = res.data;

    set((state) => ({
      users: state.users.map((u) =>
        u._id === userId ? { ...u, role: updated.role } : u
      ),
    }));

    return updated;
  }
   catch (error) {
    console.error("Failed to promote user", error);
  }
},

  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        withCredentials: true,
      });
      // remove from selection if selected
      set({
        selectedUsers: get().selectedUsers.filter((u) => u !== id),
      });
      get().fetchUsers(get().page, get().limit);
    } catch (err) {
      console.error(err);
    }
  },

  countAllUsers: async() => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, {withCredentials: true});
      const users = res.data.users
      set({allUsers: users.map((u) => u)});
    }

    catch(err) {
      console.log(err);
    }
  }
}));

export default useUserStore;
