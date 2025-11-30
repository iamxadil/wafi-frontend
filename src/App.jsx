// src/App.jsx
import React, { useEffect, useMemo, Suspense, lazy, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/swipe.css';

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
import VitalsTracker from '../components/main/VitalsTracker.jsx';

// === Lazy-loaded Pages ===
const Home = lazy(() => import("../pages/Home.jsx"));
const ProductDetails = lazy(() => import("../pages/ProductDetails.jsx"));
const CategoryNavigation = lazy(() => import("../pages/CategoryNavigation.jsx"));
const CatLaptops = lazy(() => import("../pages/CatLaptops.jsx"));
const CatAccessories = lazy(() => import("../pages/CatAccessories.jsx"));
const CatOthers = lazy(() => import ("../pages/CatOthers.jsx"));
const CatMonitors = lazy(() => import ("../pages/CatMonitors.jsx"));
const BlackFridayPage = lazy(() => import ("../pages/BlackFridayPage.jsx"));

// Auth
const Signin = lazy(() => import("../components/pages/Auth/Signin.jsx"));
const Register = lazy(() => import("../components/pages/Auth/Register.jsx"));
const ForgotPassword = lazy(() => import("../components/pages/Auth/ForgotPassword.jsx"));
const VerifyEmail = lazy(() => import("../components/pages/Auth/VerifyEmail.jsx"));
const ResetPassword = lazy(() => import("../components/pages/Auth/ResetPassword.jsx"));
const EmailVerification= lazy(() => import("../components/pages/User/EmailVerification.jsx")) ;

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
const Orders = lazy(() => import("../components/pages/Admin/navs/Orders.jsx"));
const Users = lazy(() => import("../components/pages/Admin/navs/Users.jsx"));
const Archive = lazy(() => import("../components/pages/Admin/navs/Archive.jsx"));
const Analytics = lazy(() => import("../components/pages/Admin/navs/Analytics.jsx"));
const Approvals = lazy(() => import("../components/pages/Admin/navs/Approvals.jsx"));
const Vitals = lazy(() => import("../components/pages/Admin/navs/Vitals.jsx"));
import Test from "../sections/Test.jsx";

// Cart & Orders
const Cart = lazy(() => import("../components/main/Cart.jsx"));
const Payment = lazy(() => import("../components/main/Payment.jsx"));
const OrderConfirmation = lazy(() => import("../components/main/OrderConfirmation.jsx"));

// Routes
import PublicRoute from "../routes/PublicRoute.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";

// Styles
import "./output.css";

// === Safe requestIdleCallback polyfill ===
const idle = (cb) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(cb);
  }
  // Safari / iOS fallback
  return setTimeout(() => cb({ timeRemaining: () => 0, didTimeout: false }), 1);
};

export default function App() {
  const location = useLocation();
  const { user, profile } = useAuthStore.getState();
  const theme = useThemeStore((s) => s.theme);
  const cartStore = useCartStore.getState();
  const favoritesStore = useFavoritesStore.getState();
  const width = useWindowWidth();
  const [initialized, setInitialized] = useState(false);

  /* === UI visibility filters === */
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
  const path = location.pathname;

  const showNavbar = useMemo(() => !hideNavbarOn.some((p) => path.startsWith(p)), [path]);
  const showFooter = useMemo(() => !footerOn.some((p) => path.startsWith(p)), [path]);
  const showBottomNavbar = useMemo(
    () => !bottomNavbarOn.some((p) => path.startsWith(p)),
    [path]
  );

  const showAdminFeatures = user?.role === "admin";

  /* === Initialize Auth + Cart lazily (safe for Safari) === */
  useEffect(() => {
    idle(async () => {
      try {
        await profile();
      } catch (err) {
        console.warn("Profile load failed:", err?.message || err);
      } finally {
        try {
          await cartStore.initCart();
        } catch (err) {
          console.warn("Cart init failed:", err?.message || err);
        }
        setInitialized(true);
      }
    });
  }, []);

  /* === Initialize Favorites lazily === */
  useEffect(() => {
    idle(async () => {
      try {
        if (user) await favoritesStore.loadFavorites?.();
        else favoritesStore.initGuestFavorites?.();
      } catch (err) {
        console.warn("Favorites init failed:", err?.message || err);
      }
    });
  }, [user]);

  /* === Apply Theme instantly === */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>


      {/* === Navbar === */}
      {showNavbar && <Navbar />}

      {/* === Admin-only Features === */}
      {showAdminFeatures && (
        <>
          <NotificationToast />
          <SocketListener />
        </>
      )}

      
      {/* === Toast Notifications === */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        stacked={width > 480}
        draggable={width > 480}
        closeOnClick
        transition={Zoom}
        limit={4}
      />

      {/* === Routes === */}
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
          <Route path="/verify-email/:token" element={<EmailVerification />} />

          {/* User */}
          <Route path="/settings" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/favorites" element={<Favorites />} />

          {/* Test */}
          <Route path="/test" element={<Test />} />
        

          {/* Product / Category */}
         <Route path="/product/:id" element={<ProductDetails />} />


          <Route path="/category/:categoryName" element={<CategoryNavigation />} />
          <Route path="/category/:categoryName/:brandName" element={<CategoryNavigation />} />
          <Route path="/laptops" element={<CatLaptops />} />
          <Route path="/accessories" element={<CatAccessories />} />
          <Route path="/monitors" element={<CatMonitors />} />
          <Route path="/others" element={<CatOthers />} />

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
            <Route path="orders" element={<Orders />} />
            <Route path="archive" element={<Archive />} />
            <Route path="users" element={<Users />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="permissions" element={<PermissionFields />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="vitals" element={<Vitals />} />
          </Route>
        </Routes>
      </Suspense>

      {/* === Persistent Layouts === */}
      {showFooter && <AppFooter />}
      {showBottomNavbar && <BottomNavbar />}
    </>
  );
}
