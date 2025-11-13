import { create } from "zustand";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import { User, LogOut, Mail, Key } from 'lucide-react';
import useCartStore from "./useCartStore";
import useFavoritesStore from './useFavoritesStore';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RESEND_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

const useAuthStore = create((set, get) => ({
  // -------------------
  // State
  // -------------------
  user: null,
  loading: false,
  loggedOut: false,
  isProfileLoading: false,
  error: null,
  success: null,
  resendCooldown: 0,       // seconds
  unverifiedEmail: null,



  // -------------------
  // Setters
  // -------------------
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  setResendCooldown: (seconds) => set({ resendCooldown: seconds }),
  setUnverifiedEmail: (email) => set({ unverifiedEmail: email }),
  
  
  // -------------------
  // Sign In
  // -------------------
signin: async (email, password, navigate, rememberMe) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/users/auth`,
        { email, password, rememberMe },
        { withCredentials: true }
      );

      const userData = response.data;
      set({ user: userData, loading: false, loggedOut: false, unverifiedEmail: null });

      toast.success(`Welcome, ${userData.name}!`, {
        transition: Slide,
        icon: <User size={20} color="#16a34a" />,
        hideProgressBar: false,
      });

      // Merge guest cart
      await useCartStore.getState().syncCartWithServer(true);

      useFavoritesStore.getState().initGuestFavorites();
      await useFavoritesStore.getState().mergeOnLogin();

      navigate("/");
    } catch (error) {
      set({ loading: false });

      const msg = error.response?.data?.message || "Login failed";

      // If email is not verified
      if (msg.includes("verify your email")) {
        toast.warning(msg, { transition: Slide });

        const key = `resendCooldown_${email.toLowerCase()}`;
        const storedEnd = parseInt(localStorage.getItem(key), 10) || 0;
        let remaining = Math.max(Math.ceil((storedEnd - Date.now()) / 1000), 0);

        // If no cooldown stored, start default
        if (!remaining) {
          const expireTime = Date.now() + RESEND_COOLDOWN_MS;
          localStorage.setItem(key, expireTime.toString());
          remaining = RESEND_COOLDOWN_MS / 1000;
        }

        set({
          resendCooldown: remaining,
          unverifiedEmail: email
        });

        return;
      }

      toast.error(msg, { transition: Slide });
    }
  },

  // -------------------
  // Register
  // -------------------
  register: async (name, email, password, confirm, navigate) => {
    set({ loading: true, error: null });
    if (password !== confirm) {
      toast.warning("Passwords do not match", { transition: Slide });
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users`, { name, email, password }, { withCredentials: true });
      toast.success(response.data.message || "Registration successful! Please verify your email.", { transition: Slide });
      set({ loading: false });
      navigate("/signin");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Registration failed", { transition: Slide });
    }
  },

  // -------------------
  // Logout
  // -------------------
  logout: async (navigate) => {
    set({ loading: true });
    try {
      const cartStore = useCartStore.getState();
      // Save guest cart locally
      localStorage.setItem("cart", JSON.stringify(cartStore.cart));

      await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });

      set({ user: null, loggedOut: true, loading: false });
      toast.warning("You logged out", {
        transition: Slide,
        icon: <LogOut size={20} color="#facc15" />,
      });

      navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
      set({ user: null, loading: false });
      toast.error("Logout failed", { transition: Slide });
    }
  },

  // -------------------
  // Fetch Profile
  // -------------------
profile: async () => {
  set({ isProfileLoading: true });

  try {
    const res = await axios.get(`${API_URL}/api/users/profile`, {
      withCredentials: true,
    });

    const { user, loggedIn } = res.data;

    // 🔵 Logged out (silent)
    if (!loggedIn || !user) {
      set({
        user: null,
        loggedOut: true,
        isProfileLoading: false,
      });

      return { user: null, loggedIn: false };
    }

    // 🟢 Logged in
    set({
      user,
      loggedOut: false,
      isProfileLoading: false,
    });

    return { user, loggedIn: true };

  } catch (error) {
    // Only unexpected server errors should reach here
    console.error("Unexpected profile error:", error);

    set({
      user: null,
      loggedOut: true,
      isProfileLoading: false,
    });

    return { user: null, loggedIn: false };
  }
},



  // -------------------
  // Forgot Password
  // -------------------

forgotPassword: async (email) => {
  const COOLDOWN_SECONDS = 120;
  
  set({ loading: true });
  try {
    const { data } = await axios.post(
      `${API_URL}/api/users/forgot-password`,
      { email },
      { withCredentials: true }
    );

    toast.info(data.message || "Email link has been sent to your email.", {
      transition: Slide,
    });

    // If backend returns remaining cooldown, use it
    if (data.remaining || data.retryAfter) {
      return data.remaining || data.retryAfter;
    }

    return 0; // no cooldown
  } catch (err) {
    // Rate-limit hit
    if (err.response?.status === 429) {
      const remaining = err.response.data.remaining || err.response.data.retryAfter || COOLDOWN_SECONDS;
      toast.error(err.response.data.message || `Too many requests. Please wait ${remaining} seconds.`);
      return remaining;
    }

    toast.error(err.response?.data?.message || "Something went wrong.");
    return 0;
  } finally {
    set({ loading: false });
  }
},

  // -------------------
  // Reset Password
  // -------------------
  resetPassword: async (token, password) => {
    set({ loading: true, error: null, success: null });
    try {
      const { data } = await axios.post(`${API_URL}/api/users/reset-password/${token}`, { password }, { withCredentials: true });
      set({ loading: false, success: data.message });
      toast.success(data.message, { transition: Slide, icon: <Key size={20} color="#10b981" /> });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Something went wrong" });
      toast.error(err.response?.data?.message || "Reset failed", { transition: Slide });
    }
  },

  // -------------------
  // Update Profile
  // -------------------
  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, data, { withCredentials: true });
      set({ user: res.data });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile", { transition: Slide });
      throw new Error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ loading: false });
    }
  },

  // -------------------
// Delete User (Admin)
// -------------------
deleteUser: async (id) => {
  set({ loading: true });
  try {
    await axios.delete(`${API_URL}/api/users/${id}`, { withCredentials: true });
    toast.success("User deleted successfully", { transition: Slide });
    set({ loading: false });
    return true;
  } catch (err) {
    set({ loading: false });
    toast.error(err.response?.data?.message || "Failed to delete user", { transition: Slide });
    return false;
  }
},

// -------------------
// Update User (Admin)
// -------------------
updateUser: async (id, data) => {
  set({ loading: true });
  try {
    const res = await axios.put(`${API_URL}/api/users/${id}`, data, { withCredentials: true });
    toast.success("User updated successfully", { transition: Slide });
    set({ loading: false });
    return res.data;
  } catch (err) {
    set({ loading: false });
    toast.error(err.response?.data?.message || "Failed to update user", { transition: Slide });
    return null;
  }
},

// -------------------
// Promote User (Admin)
// -------------------
promoteUser: async (id, role) => {
  set({ loading: true });
  try {
    const res = await axios.put(`${API_URL}/api/users/${id}/promote`, { role }, { withCredentials: true });
    toast.success(`User promoted to ${role}`, { transition: Slide });
    set({ loading: false });
    return res.data;
  } catch (err) {
    set({ loading: false });
    toast.error(err.response?.data?.message || "Failed to promote user", { transition: Slide });
    return null;
  }
},


  // -------------------
  // Resend Verification Email (optional for frontend integration)
  // -------------------
 resendVerificationEmail: async (email) => {
    if (!email) return 0;

    const key = `resendCooldown_${email.toLowerCase()}`;
    const now = Date.now();
    const storedEnd = parseInt(localStorage.getItem(key), 10) || 0;

    if (storedEnd > now) {
      const remaining = Math.ceil((storedEnd - now) / 1000);
      toast.error(`You can resend email in ${remaining}s`);
      set({ resendCooldown: remaining });
      return remaining;
    }

    set({ loading: true });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/users/resend-verification`,
        { email },
        { withCredentials: true }
      );

      toast.success(data.message || "Verification email sent!", {
        transition: Slide,
        icon: <Mail size={20} color="#3b82f6" />,
      });

      const expireTime = now + RESEND_COOLDOWN_MS;
      localStorage.setItem(key, expireTime.toString());
      set({ resendCooldown: RESEND_COOLDOWN_MS / 1000 });

      return RESEND_COOLDOWN_MS / 1000;
    } catch (err) {
      if (err.response?.status === 429) {
        const backendRemaining = err.response.data.remaining || RESEND_COOLDOWN_MS / 1000;
        const expireTime = now + backendRemaining * 1000;
        localStorage.setItem(key, expireTime.toString());
        toast.error(err.response.data.message || `Please wait ${backendRemaining}s`);
        set({ resendCooldown: backendRemaining });
        return backendRemaining;
      }

      toast.error(err.response?.data?.message || "Failed to resend email");
      return 0;
    } finally {
      set({ loading: false });
    }
  },

}));



export default useAuthStore;
