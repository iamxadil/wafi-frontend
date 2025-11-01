import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Fetches complete dashboard stats and quick info
 * from /api/dashboard/stats
 */
export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/dashboard/stats`, {
        withCredentials: true,
      });

      // ✅ Normalize the backend response (prevent undefined crashes)
      return {
        /* === CORE STATS === */
        ordersCount: data.ordersCount ?? 0,
        usersCount: data.usersCount ?? 0,
        productsCount: data.productsCount ?? 0,
        pendingProducts: data.pendingProducts ?? 0,
        totalRevenue: data.totalRevenue ?? 0,

        /* === FINANCIAL === */
        avgOrderValue: data.avgOrderValue ?? 0,
        revenueThisMonth: data.revenueThisMonth ?? 0,
        revenueThisWeek: data.revenueThisWeek ?? 0,

        /* === GROWTH === */
        growth: {
          users: data.growth?.users ?? 0,
          orders: data.growth?.orders ?? 0,
          revenue: data.growth?.revenue ?? 0,
        },

        /* === INVENTORY === */
        outOfStock: data.outOfStock ?? 0,
        lowStock: data.lowStock ?? 0,
        topSellingBrand: data.topSellingBrand ?? "N/A",
        topCategory: data.topCategory ?? "N/A",
        offersCount: data.offersCount ?? 0,

        /* === ORDERS === */
        deliveredOrders: data.deliveredOrders ?? 0,
        canceledOrders: data.canceledOrders ?? 0,
        refundedOrders: data.refundedOrders ?? 0,
        pendingOrders: data.pendingOrders ?? 0,
        avgDeliveryTime: data.avgDeliveryTime ?? 0,

        /* === USERS === */
        newUsersThisMonth: data.newUsersThisMonth ?? 0,
        newUsersThisWeek: data.newUsersThisWeek ?? 0,
        newOrdersThisMonth: data.newOrdersThisMonth ?? 0,
        newOrdersThisWeek: data.newOrdersThisWeek ?? 0,
        guestOrders: data.guestOrders ?? 0,
        pickupOrders: data.pickupOrders ?? 0,
        revenueLast7Days: data.revenueLast7Days ?? [],

        /* === RECENT ACTIVITY === */
        recentOrders: Array.isArray(data.recentOrders)
          ? data.recentOrders
          : [],
        recentUsers: Array.isArray(data.recentUsers)
          ? data.recentUsers
          : [],
        recentProducts: Array.isArray(data.recentProducts)
          ? data.recentProducts
          : [],
      };
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
