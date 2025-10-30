// src/App.jsx
import React, { useEffect, useMemo, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// === Hooks & Stores ===
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useThemeStore from "../components/stores/useThemeStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useFavoritesStore from "../components/stores/useFavoritesStore.jsx";

// === Shared Layouts ===
import Navbar from "../components/main/Navbar.jsx";
import BottomNavbar from "../components/main/BottomNavbar.jsx";
import AppFooter from "../components/main/AppFooter.jsx";
import NotificationToast from "../components/main/NotificationToast.jsx";
import SocketListener from "../components/main/SocketListener.jsx";

// === Lazy-loaded Pages ===
// Home & Core
const Home = lazy(() => import("../pages/Home.jsx"));
const ProductDetails = lazy(() => import("../pages/ProductDetails.jsx"));
const CategoryNavigation = lazy(() => import("../pages/CategoryNavigation.jsx"));
const CatLaptops = lazy(() => import("../pages/CatLaptops.jsx"));
const CatAccessories = lazy(() => import("../pages/CatAccessories.jsx"));

// Auth
const Signin = lazy(() => import("../components/pages/Auth/Signin.jsx"));
const Register = lazy(() => import("../components/pages/Auth/Register.jsx"));
const ForgotPassword = lazy(() => import("../components/pages/Auth/ForgotPassword.jsx"));
const VerifyEmail = lazy(() => import("../components/pages/Auth/VerifyEmail.jsx"));
const ResetPassword = lazy(() => import("../components/pages/Auth/ResetPassword.jsx"));

// User
const Profile = lazy(() => import("../components/pages/User/Profile.jsx"));
const MyOrders = lazy(() => import("../components/pages/User/MyOrders.jsx"));
const Favorites = lazy(() => import("../components/pages/User/Favorites.jsx"));

// Admin
const AdminDashboard = lazy(() => import("../components/pages/Admin/AdminDashboard.jsx"));
const AdminLandingPage = lazy(() => import("../components/pages/Admin/layouts/AdminLandingPage.jsx"));
const Products = lazy(() => import("../components/pages/Admin/navs/Products.jsx"));
const Notifications = lazy(() => import("../components/pages/Admin/layouts/Notifications.jsx"));
const PermissionFields = lazy(() => import("../components/pages/Admin/forms/PermissionFields.jsx"));
const FormDashboard = lazy(() => import("../components/pages/Admin/layouts/FormDashboard.jsx"));

// Cart & Orders
const Cart = lazy(() => import("../components/main/Cart.jsx"));
const Payment = lazy(() => import("../components/main/Payment.jsx"));
const OrderConfirmation = lazy(() => import("../components/main/OrderConfirmation.jsx"));

// Routes
import PublicRoute from "../routes/PublicRoute.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";

// Styles
import "./output.css";

export default function App() {
  const location = useLocation();
  const { user, profile } = useAuthStore.getState();
  const theme = useThemeStore((s) => s.theme);
  const cartStore = useCartStore.getState();
  const favoritesStore = useFavoritesStore.getState();
  const width = useWindowWidth();

  // === Route filters (memoized once) ===
  const hideNavbarOn = useMemo(() => ["/admin-dashboard", "/dashboard", "/cart", "/payment"], []);
  const footerOn = useMemo(
    () => [
      "/admin-dashboard",
      "/dashboard",
      "/cart",
      "/payment",
      "/favorites",
      "/my-orders",
      "/settings",
      "/product",
    ],
    []
  );
  const bottomNavbarOn = useMemo(() => ["/admin-dashboard", "/cart", "/payment"], []);

  // === Initial App Bootstrap ===
  useEffect(() => {
    (async () => {
      try {
        await profile();
      } catch (err) {
        console.warn("Profile load failed:", err.message);
      } finally {
        await cartStore.initCart();
      }
    })();
  }, []);

  // === Initialize favorites ===
  useEffect(() => {
    (async () => {
      try {
        if (user) await favoritesStore.loadFavorites?.();
        else favoritesStore.initGuestFavorites?.();
      } catch (err) {
        console.warn("Favorites init failed:", err.message);
      }
    })();
  }, [user]);

  // === Theme binding ===
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const showAdminFeatures = user?.role === "admin";

  return (
    <>
      {/* === Navbar === */}
      {!hideNavbarOn.some((path) => location.pathname.startsWith(path)) && <Navbar />}

      {/* === Admin Socket & Notifications === */}
      {showAdminFeatures && (
        <>
          <NotificationToast />
          <SocketListener />
        </>
      )}

      {/* === Global Toast === */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        stacked={width > 480}
        draggable
        closeOnClick
        transition={Zoom}
        limit={4}
      />

      {/* === Lazy routes with fallback === */}
      <Suspense
        fallback={
          <div className="global-loader">
            <span className="spinner" />
          </div>
        }
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Signin />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User */}
          <Route path="/settings" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/favorites" element={<Favorites />} />

          {/* Product / Category */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryName" element={<CategoryNavigation />} />
          <Route path="/category/:categoryName/:brandName" element={<CategoryNavigation />} />
          <Route path="/laptops" element={<CatLaptops />} />
          <Route path="/accessories" element={<CatAccessories />} />

          {/* Cart / Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminLandingPage />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<FormDashboard page="users" />} />
            <Route path="approvals" element={<FormDashboard page="approvals" />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="order-status" element={<FormDashboard page="order-status" />} />
            <Route path="archive" element={<FormDashboard page="archive" />} />
            <Route path="permissions" element={<PermissionFields />} />
          </Route>
        </Routes>
      </Suspense>

      {/* === Persistent Layouts === */}
      {!bottomNavbarOn.some((path) => location.pathname.startsWith(path)) && <BottomNavbar />}
      {!footerOn.some((path) => location.pathname.startsWith(path)) && <AppFooter />}
    </>
  );
}
