import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useCartStore from "./useCartStore";

const API_URL = "https://wafi-backend-nlp6.onrender.com";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: false,
  loggedOut: false,
  isProfileLoading: false,

  // Setters
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  // Signin
  signin: async (email, password, navigate, rememberMe) => {
  set({ loading: true });
  try {
    const response = await axios.post(`${API_URL}/api/users/auth`,
      { email, password, rememberMe },
      { withCredentials: true }
    );

    const userData = response.data;
    set({ loading: false, user: userData });
    toast.success(`Welcome, ${userData.name}!`);

    // Merge guest cart with server
    await useCartStore.getState().syncCartWithServer(true);

    navigate("/");
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Login failed");
  }
},

  // Register
  register: async (name, email, password, confirm, navigate) => {
    set({ loading: true });

    if (password !== confirm) {
      toast.warning("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users`,
        { name, email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Registration successful! Please verify your email.");
      set({ loading: false });
      navigate("/signin");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Registration failed");
    }
  },

  // Logout
logout: async (navigate) => {
  set({ loading: true });
  try {
    const cartStore = useCartStore.getState();
    // Save guest cart for persistence
    localStorage.setItem("cart", JSON.stringify(cartStore.cart));

    await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });

    set({ user: null, loggedOut: true, loading: false });
    toast.info("Logged out");
    navigate("/signin");
  } catch (err) {
    console.error("Logout failed", err);
    set({ user: null, loading: false });
    toast.error("Logout failed");
  }
},

  // Fetch Profile
  profile: async () => {
    set({ isProfileLoading: true });
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, { withCredentials: true });
      set({ user: response.data, loggedOut: false, isProfileLoading: false });
      return response.data;
    } catch (error) {
      console.error("Profile fetch failed:", error);
      set({ loggedOut: true, isProfileLoading: false, user: null });
      return null;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email }, {withCredentials: true});
      toast.info("Reset instructions have been sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      set({ loading: false });
    }
  },

  // Reset Password
  resetPassword: async (token, password) => {
    set({ loading: true, error: null, success: null });
    try {
      const { data } = await axios.post(`${API_URL}/api/users/reset-password/${token}`, { password }, {withCredentials: true});
      set({ loading: false, success: data.message });
      toast.success(data.message);
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Something went wrong, please try again",
      });
      toast.error(err.response?.data?.message || "Reset failed");
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, data, { withCredentials: true });
      set({ user: res.data });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      throw new Error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
