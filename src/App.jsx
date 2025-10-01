import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Stores
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useThemeStore from "../components/stores/useThemeStore.jsx";
import useCartStore from '../components/stores/useCartStore.jsx';

//Components
import Navbar from '../components/main/Navbar.jsx';
import Signin from "../components/pages/Auth/Signin.jsx";
import Register from '../components/pages/Auth/Register.jsx';
import ForgotPassword from '../components/pages/Auth/ForgotPassword.jsx';
import VerifyEmail from '../components/pages/Auth/VerifyEmail.jsx';
import ResetPassword from '../components/pages/Auth/ResetPassword.jsx';
import MyOrdersPage from '../components/pages/User/MyOrders.jsx';
import Static from '../pages/Static.jsx';

import Home from '../pages/Home'; 
import CategoryNavigation from '../pages/CategoryNavigation.jsx';
import CatLaptops from '../pages/CatLaptops.jsx';
import AdminDashboard from '../components/pages/Admin/AdminDashboard.jsx';
import FormDashboard from '../components/pages/Admin/layouts/FormDashboard.jsx';
import AdminLandingPage from '../components/pages/Admin/layouts/AdminLandingPage.jsx';
import Notifications from '../components/pages/Admin/layouts/Notifications.jsx';
import AllowedRoute from '../routes/AllowedRoute.jsx';
import PublicRoute from '../routes/PublicRoute.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import SocketListener from '../components/main/SocketListener.jsx';
import NotificationToast from '../components/main/NotificationToast.jsx';
import Profile from '../components/pages/User/Profile.jsx';
import Cart from '../components/main/Cart.jsx';
import Payment from '../components/main/Payment.jsx';
import PermissionFields from '../components/pages/Admin/forms/PermissionFields.jsx';
import OrderConfirmation from '../components/main/OrderConfirmation.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import { unlockAudio } from "../components/effects/PlayNotSound.jsx";


import './app.css';


function App() {
  const location = useLocation();
  const hideNavbarOn = ["/admin-dashboard", "/dashboard", "/cart", "/payment"];
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const theme = useThemeStore((state) => state.theme);
  const cartStore = useCartStore.getState();

  // Initialize cart on app load
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await profile(); // returns user object or null
        await cartStore.initCart();       // safely loads server or guest cart
      } catch (err) {
        console.error("Failed to initialize cart:", err);
      }
    };
    init();
  }, []);

  // Set theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const showAdminFeatures = user && user.role === "admin";

  // Unlock audio for first click
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  return (
    <>
      {!hideNavbarOn.some(path => location.pathname.startsWith(path)) && <Navbar />}

      {showAdminFeatures && (
        <>
          <NotificationToast />
          <SocketListener />
        </>
      )}

      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin dashboard */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<AdminLandingPage />} />
          <Route path="products" element={<FormDashboard page="products" />} />
          <Route path="users" element={<FormDashboard page="users" />} />
          <Route path="approvals" element={<FormDashboard page="approvals" />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="order-status" element={<FormDashboard page="order-status" />} />
          <Route path="archive" element={<FormDashboard page="archive" />} />
          <Route path="permissions" element={<PermissionFields />} />
        </Route>

        {/* Auth routes */}
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* User & cart */}
        <Route path="/settings" element={<AllowedRoute><Profile /></AllowedRoute>} />
        <Route path="/my-orders" element={<AllowedRoute><MyOrdersPage /></AllowedRoute>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:categoryName" element={<CategoryNavigation />} />
        <Route path="/category/:categoryName/:brandName" element={<CategoryNavigation />} />
        <Route path='/laptops' element={<CatLaptops />}/>
        <Route path='/static' element={<Static />}/>

      </Routes>
    </>
  );
}

export default App;
